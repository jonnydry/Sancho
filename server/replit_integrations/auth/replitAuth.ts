import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Application, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Application) {
  // Validate required environment variables
  if (!process.env.REPL_ID) {
    console.error('[AUTH] REPL_ID is not set. Available env vars:',
      Object.keys(process.env).filter(k => k.startsWith('REPL') || k.startsWith('REPLIT')).join(', '));
    throw new Error(
      'REPL_ID environment variable is required for OAuth authentication. ' +
      'This should be automatically set by Replit.'
    );
  }

  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET must be set for sessions to work.');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set. Sessions require a database connection.');
  }

  // Log environment for debugging
  console.log('[AUTH] Environment check:');
  console.log(`  REPL_ID: ${process.env.REPL_ID.substring(0, 8)}...`);
  console.log(`  CUSTOM_DOMAIN: ${process.env.CUSTOM_DOMAIN || 'NOT SET'}`);
  console.log(`  REPLIT_DEV_DOMAIN: ${process.env.REPLIT_DEV_DOMAIN || 'NOT SET'}`);
  console.log(`  REPLIT_DOMAINS: ${process.env.REPLIT_DOMAINS || 'NOT SET'}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();
  console.log('[AUTH] OIDC discovery completed successfully');

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      console.log('[AUTH] Verify callback started - processing tokens');
      const user = {};
      updateUserSession(user, tokens);
      const claims = tokens.claims();
      console.log(`[AUTH] Claims extracted - sub: ${claims?.sub || 'missing'}, email: ${claims?.email || 'missing'}`);

      await upsertUser(claims);
      console.log('[AUTH] User upserted successfully');

      verified(null, user);
    } catch (error) {
      console.error('[AUTH] Verify callback error:', error);
      verified(error as Error);
    }
  };

  const getEffectiveProtocol = (req: any): string => {
    const forwardedProto = req.get('x-forwarded-proto');
    if (forwardedProto) {
      return forwardedProto.split(',')[0].trim();
    }
    return req.secure ? 'https' : req.protocol;
  };

  const replitDomains = (process.env.REPLIT_DOMAINS || '').split(',').map(d => d.trim()).filter(Boolean);
  if (replitDomains.length === 0) {
    throw new Error('REPLIT_DOMAINS environment variable is required for OAuth authentication.');
  }

  const registeredStrategies = new Set<string>();

  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const callbackURL = `https://${domain}/api/callback`;
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
      console.log(`[AUTH] Registered strategy for domain: ${domain}, callback: ${callbackURL}`);
    }
    return strategyName;
  };

  for (const domain of replitDomains) {
    ensureStrategy(domain);
  }

  const getStrategyForHost = (host: string): string => {
    const matchedDomain = replitDomains.find(d => host === d || host.startsWith(d));
    if (matchedDomain) {
      return ensureStrategy(matchedDomain);
    }
    return ensureStrategy(replitDomains[0]);
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    try {
      const host = req.get('host') || req.hostname;
      const strategyName = getStrategyForHost(host);
      console.log(`[AUTH] Login request - host: ${host}, strategy: ${strategyName}`);

      passport.authenticate(strategyName, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      res.status(500).json({ message: 'Authentication setup failed', error: String(error) });
    }
  });

  app.get("/api/callback", (req, res, next) => {
    const host = req.get('host') || req.hostname;
    const strategyName = getStrategyForHost(host);

    console.log(`[AUTH] Callback request - host: ${host}, strategy: ${strategyName}`);
    console.log(`[AUTH] Callback query params - code: ${req.query.code ? 'present' : 'missing'}, state: ${req.query.state ? 'present' : 'missing'}, error: ${req.query.error || 'none'}`);

    if (req.query.error) {
      console.error(`[AUTH] OAuth error from provider: ${req.query.error} - ${req.query.error_description || 'no description'}`);
      return res.redirect('/?login_error=oauth_denied');
    }

    passport.authenticate(strategyName, (err: Error | null, user: Express.User | false, info: object | undefined) => {
      if (err) {
        console.error(`[AUTH] Passport authentication error:`, err.message);
        return res.redirect('/?login_error=auth_failed');
      }

      if (!user) {
        console.error(`[AUTH] No user returned from authentication. Info:`, info);
        return res.redirect('/?login_error=no_user');
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error(`[AUTH] Session login error:`, loginErr.message);
          return res.redirect('/?login_error=session_failed');
        }

        console.log(`[AUTH] Login successful, redirecting to /`);
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    const host = req.get('host') || req.hostname;
    const protocol = getEffectiveProtocol(req);
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${protocol}://${host}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
