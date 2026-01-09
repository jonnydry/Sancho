import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import { Request, Response, NextFunction, Application } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage.js";
import type { SessionUser, OAuthClaims } from "./express.d.ts";

function getClientId(): string {
  const replId = process.env.REPL_ID;
  if (!replId) {
    console.error('[Auth] REPL_ID is not set. Available env vars:', 
      Object.keys(process.env).filter(k => k.startsWith('REPL') || k.startsWith('REPLIT')).join(', '));
    throw new Error(
      'REPL_ID environment variable is required for OAuth authentication. ' +
      'This should be automatically set by Replit.'
    );
  }
  return replId;
}

const getOidcConfig = memoize(
  async () => {
    const clientId = getClientId();
    console.log(`[Auth] Initializing OIDC discovery with client_id: ${clientId.substring(0, 8)}...`);
    try {
      const config = await client.discovery(
        new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
        clientId
      );
      console.log('[Auth] OIDC discovery completed successfully');
      return config;
    } catch (error) {
      console.error('[Auth] OIDC discovery failed:', error);
      throw error;
    }
  },
  { maxAge: 3600 * 1000 }
);

export function getFrontendOrigin(req?: { hostname?: string }): string {
  // In production with custom domain, use the custom domain for OAuth callback
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1' || process.env.NODE_ENV === 'production';
  const customDomain = process.env.CUSTOM_DOMAIN;
  
  if (isProduction && customDomain) {
    return `https://${customDomain}`;
  }
  
  // Use request hostname if available (for dynamic callback matching)
  if (req?.hostname) {
    return `https://${req.hostname}`;
  }
  
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  } else if (process.env.REPLIT_DOMAINS) {
    const firstDomain = process.env.REPLIT_DOMAINS.split(',')[0].trim();
    return `https://${firstDomain}`;
  } else if (process.env.FRONTEND_ORIGIN) {
    return process.env.FRONTEND_ORIGIN;
  } else {
    return 'http://localhost:5000';
  }
}

export function getSession(): ReturnType<typeof session> {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET must be set for sessions to work.');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set. Sessions require a database connection.');
  }

  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  // Detect production environment
  const isReplitProduction = Boolean(process.env.REPLIT_DEPLOYMENT === '1');
  const isProduction = process.env.NODE_ENV === 'production' || isReplitProduction;
  
  // Set cookie domain for custom domains to allow cross-subdomain session sharing
  // e.g., ".sanchopoetry.com" matches both www.sanchopoetry.com and sanchopoetry.com
  let cookieDomain: string | undefined;
  const customDomain = process.env.CUSTOM_DOMAIN;
  if (isProduction && customDomain) {
    cookieDomain = customDomain.startsWith('.') ? customDomain : `.${customDomain}`;
  }
  
  console.log(`[Auth] Session configuration - isProduction: ${isProduction}, NODE_ENV: ${process.env.NODE_ENV}, REPLIT_DEPLOYMENT: ${process.env.REPLIT_DEPLOYMENT || 'not set'}, cookieDomain: ${cookieDomain || 'default'}`);
  
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: sessionTtl,
      ...(cookieDomain && { domain: cookieDomain }),
    },
  });
}

function updateUserSession(user: SessionUser, tokens: client.TokenEndpointResponse): void {
  const getClaims = tokens.claims as (() => Record<string, unknown>) | undefined;
  const claims = (getClaims ? getClaims() : {}) as unknown as OAuthClaims;
  user.claims = claims;
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = claims?.exp;
}

async function upsertUser(claims: OAuthClaims): Promise<void> {
  await storage.upsertUser({
    id: claims.sub,
    email: claims.email,
    firstName: claims.first_name,
    lastName: claims.last_name,
    profileImageUrl: claims.profile_image_url,
  });
}

export async function setupAuth(app: Application): Promise<void> {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const callbackURL = `${getFrontendOrigin()}/api/callback`;
  console.log(`[Auth] Setting up OAuth with callback URL: ${callbackURL}`);

  const verify = async (
    tokens: client.TokenEndpointResponse, 
    verified: (err: Error | null, user?: SessionUser) => void
  ): Promise<void> => {
    try {
      console.log('[Auth] Verify callback started - processing tokens');
      const user: SessionUser = {};
      updateUserSession(user, tokens);
      const getClaims = tokens.claims as (() => Record<string, unknown>) | undefined;
      const claims = (getClaims ? getClaims() : {}) as unknown as OAuthClaims;
      console.log(`[Auth] Claims extracted - sub: ${claims?.sub || 'missing'}, email: ${claims?.email || 'missing'}`);
      
      await upsertUser(claims);
      console.log('[Auth] User upserted successfully');
      
      verified(null, user);
    } catch (error) {
      console.error('[Auth] Verify callback error:', error);
      verified(error as Error);
    }
  };

  const strategy = new Strategy(
    {
      config,
      scope: "openid email profile offline_access",
      callbackURL,
    },
    verify
  );

  passport.use(strategy);

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    console.log(`[Auth] Login initiated from ${req.hostname}`);
    passport.authenticate("openid-client", {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    console.log(`[Auth] Callback received - code: ${req.query.code ? 'present' : 'missing'}, state: ${req.query.state ? 'present' : 'missing'}, error: ${req.query.error || 'none'}`);
    
    if (req.query.error) {
      console.error(`[Auth] OAuth error from provider: ${req.query.error} - ${req.query.error_description || 'no description'}`);
      return res.redirect('/?login_error=oauth_denied');
    }
    
    passport.authenticate("openid-client", (err: Error | null, user: Express.User | false, info: object | undefined) => {
      if (err) {
        console.error(`[Auth] Passport authentication error:`, err.message);
        console.error(`[Auth] Full error:`, err);
        return res.redirect('/?login_error=auth_failed');
      }
      
      if (!user) {
        console.error(`[Auth] No user returned from authentication. Info:`, info);
        return res.redirect('/?login_error=no_user');
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error(`[Auth] Session login error:`, loginErr.message);
          return res.redirect('/?login_error=session_failed');
        }
        
        console.log(`[Auth] Login successful, redirecting to /`);
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: getClientId(),
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.user;

  if (!req.isAuthenticated() || !user || !user.expires_at) {
    res.status(401).json({ 
      error: "Authentication required",
      message: "Please log in to continue",
      code: "NOT_AUTHENTICATED"
    });
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    next();
    return;
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ 
      error: "Session expired",
      message: "Your session has expired. Please log in again",
      code: "SESSION_EXPIRED"
    });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken, {
      client_id: getClientId()
    });
    updateUserSession(user as SessionUser, tokenResponse);
    next();
    return;
  } catch (error) {
    const err = error as Error;
    console.error("Token refresh failed:", err.message);
    res.status(401).json({ 
      error: "Session expired",
      message: "Your session has expired. Please log in again",
      code: "TOKEN_REFRESH_FAILED"
    });
    return;
  }
};
