# Replit Development & Deployment Guidelines

**Critical specifications and guardrails for AI agents and developers working on this Replit project.**

---

## 🚨 Critical Constraints

### Port Configuration
- **Frontend (Vite)**: MUST run on port **5000** (only port exposed for webview)
- **Backend (Express)**: Runs on port **3001** (internal only)
- ⚠️ **NEVER change frontend port** - Replit only exposes port 5000 for web preview
- ⚠️ **NEVER bind backend to port 5000** - Keep backend on 3001

### Server Binding
```javascript
// CORRECT - Frontend binds to 0.0.0.0:5000
server: {
  port: 5000,
  host: '0.0.0.0',
  allowedHosts: true,  // REQUIRED for Replit iframe preview
}

// CORRECT - Backend binds to 0.0.0.0:3001
const PORT = 3001;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, ...);
```

### Vite Configuration Requirements
```typescript
// vite.config.ts MUST include:
export default defineConfig({
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,  // Critical for Replit iframe
    hmr: {
      clientPort: 5000,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: false,  // Keep original host for OAuth
      }
    }
  },
});
```

---

## 🔐 Authentication (Replit Auth)

### Environment Variables
These are **auto-configured** by Replit - DO NOT hardcode:
- `REPL_ID` - Replit project ID (used for OAuth)
- `REPLIT_DEV_DOMAIN` - Development domain (e.g., `xxx-00-yyy.worf.replit.dev`)
- `REPLIT_DOMAINS` - Fallback domain
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Auto-generated session secret

### OAuth Callback URL Configuration
```javascript
// CORRECT - Dynamic domain detection
let frontendOrigin;
if (process.env.REPLIT_DEV_DOMAIN) {
  frontendOrigin = `https://${process.env.REPLIT_DEV_DOMAIN}`;
} else if (process.env.REPLIT_DOMAINS) {
  frontendOrigin = `https://${process.env.REPLIT_DOMAINS}`;
} else {
  frontendOrigin = "http://localhost:5000"; // Local dev fallback
}

// WRONG - Hardcoded localhost
const frontendOrigin = "http://localhost:5000"; // ❌ Breaks in Replit
```

### Session Cookie Configuration
```javascript
// CORRECT - Conditional security based on environment
const isProduction = process.env.NODE_ENV === 'production';
session({
  cookie: {
    httpOnly: true,
    secure: isProduction,  // Only HTTPS in production
    maxAge: sessionTtl,
  }
});

// WRONG - Always secure
cookie: { secure: true }  // ❌ Breaks HTTP dev environment
```

### Database Session Storage
```javascript
// CORRECT - Auto-create sessions table
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,  // Critical for first deployment
  ttl: sessionTtl,
  tableName: "sessions",
});

// WRONG - Requires manual table creation
createTableIfMissing: false  // ❌ Fails on fresh database
```

---

## 💾 Database (PostgreSQL)

### Schema Management
```bash
# NEVER manually write SQL migrations
# ALWAYS use Drizzle Kit

# Push schema changes
npm run db:push

# If conflicts occur
npm run db:push --force
```

### Critical ID Column Rules
⚠️ **NEVER change primary key ID types** - Breaks existing data

```typescript
// If existing table uses serial IDs - KEEP IT
id: serial("id").primaryKey()

// If existing table uses UUID varchar - KEEP IT  
id: varchar("id").primaryKey().default(sql`gen_random_uuid()`)

// ❌ NEVER switch between serial ↔ varchar on existing tables
```

### Required Tables (Replit Auth)
```typescript
// sessions table - REQUIRED, never drop
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// users table - REQUIRED for auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

---

## 🎨 Frontend Framework Rules

### React/Vite Specific
```javascript
// ❌ NEVER use localhost references in frontend API calls
fetch('http://localhost:3001/api/...') // Wrong

// ✅ ALWAYS use relative paths (Vite proxy handles routing)
fetch('/api/...') // Correct
```

### Asset References
```typescript
// CORRECT - Using @assets alias
import image from '@assets/generated_images/image.png'

// CORRECT - Public folder
<img src="/sancho-logo.png" />

// ❌ WRONG - Absolute paths
<img src="http://localhost:5000/sancho-logo.png" />
```

---

## 🔑 API Keys & Secrets

### Required Secrets
Set these in Replit Secrets (never commit to repo):
- `XAI_API_KEY` - XAI Grok API key for AI features

### Auto-Generated (DO NOT manually set)
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Session encryption
- `REPL_ID` - OAuth client ID
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Accessing Secrets
```javascript
// CORRECT - Environment variables
const apiKey = process.env.XAI_API_KEY;

// ❌ WRONG - Hardcoded
const apiKey = "xai-abc123...";
```

---

## 🚀 Workflow Configuration

### Development Workflow
```yaml
name: dev
command: node server.js & vite
output_type: webview
wait_for_port: 5000  # MUST match frontend port
```

### Critical Workflow Rules
- ✅ Use `output_type: webview` for web applications
- ✅ Set `wait_for_port: 5000` (frontend port only)
- ✅ Start backend first, then frontend: `node server.js & vite`
- ❌ NEVER use port 3001 in `wait_for_port`
- ❌ NEVER use `output_type: vnc` for web apps

---

## 📦 Package Management

### Installing Dependencies
```bash
# NEVER use virtual environments or Docker
# Replit uses Nix package management

# For Node.js packages
npm install <package>

# For system packages (use packager_tool in AI agents)
# Example: jq, ffmpeg, etc.
```

### Module Installation
```bash
# NEVER manually edit .replit or replit.nix
# Use built-in tools to add language toolchains
```

---

## 🌐 CORS Configuration

### Backend CORS Setup
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true  // Required for session cookies
};
app.use(cors(corsOptions));
```

---

## 🔒 Security Guidelines

### API Key Protection
- ✅ **ALWAYS** store API keys in Replit Secrets
- ✅ **ALWAYS** call external APIs from backend (never frontend)
- ✅ Use backend proxy pattern to protect keys
- ❌ **NEVER** expose API keys in frontend code
- ❌ **NEVER** commit secrets to repository

### Session Security
```javascript
// Backend session configuration
session({
  secret: process.env.SESSION_SECRET,  // Auto-generated
  store: sessionStore,  // PostgreSQL storage
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,  // Always
    secure: isProduction,  // Only in production
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  }
});
```

### Protected Routes
```javascript
// Backend middleware
export const isAuthenticated = async (req, res, next) => {
  if (!req.isAuthenticated() || !req.user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Token refresh logic...
  next();
};

// Apply to protected routes
app.get('/api/protected', isAuthenticated, handler);
```

---

## 🎯 Theme System (Premium Features)

### Theme Access Rules
```typescript
// Free theme - accessible to all
'dark' - Default black/white theme

// Premium themes - require authentication
'paper' - Parchment-style theme (logged in only)
'slate' - Slate-style theme (logged in only)
```

### Theme Enforcement
```typescript
// Frontend: Block premium theme selection
if (isPremium && !isAuthenticated) {
  window.location.href = '/api/login';
  return;
}

// Backend polling: Reset premium themes on logout
// Runs every 10 seconds to catch auth changes
```

---

## 📝 File Structure Rules

### Critical Files (NEVER delete)
- `replit.md` - Project memory/documentation
- `server.js` - Backend server (port 3001)
- `vite.config.ts` - Frontend config (port 5000)
- `shared/schema.js` - Database schema
- `server/replitAuth.js` - Authentication logic
- `drizzle.config.ts` - Database migrations config

### Service Files
- `services/apiService.ts` - Backend API calls (formerly geminiService.ts)
- DO NOT create separate geminiService or googleService files

---

## 🐛 Common Pitfalls

### ❌ DON'T
1. Change frontend port from 5000
2. Use localhost URLs in OAuth callbacks
3. Hardcode API keys in code
4. Manually write SQL migrations
5. Change ID column types in existing tables
6. Use `secure: true` cookies in dev environment
7. Bind backend to port 5000
8. Use `output_type: vnc` for web apps
9. Reference Google/Gemini in new code
10. Create virtual environments or Docker containers

### ✅ DO
1. Use environment variables for all configs
2. Bind servers to `0.0.0.0` (not `localhost`)
3. Use relative API paths in frontend
4. Run `npm run db:push` for schema changes
5. Set `allowedHosts: true` in Vite config
6. Use Replit Secrets for API keys
7. Test OAuth flow with actual Replit domain
8. Keep backend proxy pattern for API security
9. Use XAI/Grok terminology for AI features
10. Use Nix package management

---

## 📊 Testing Guidelines

### Local Development
```bash
# Start both servers
npm run dev

# Frontend: http://localhost:5000
# Backend: http://localhost:3001
# OAuth callbacks use: http://localhost:5000/api/callback
```

### Replit Environment
```bash
# Servers auto-start via workflow
# Frontend: https://<REPLIT_DEV_DOMAIN>
# Backend: Internal only (port 3001)
# OAuth callbacks use: https://<REPLIT_DEV_DOMAIN>/api/callback
```

### Pre-Deployment Checklist
- [ ] Environment variables set in Replit Secrets
- [ ] Database schema pushed (`npm run db:push`)
- [ ] OAuth callback URLs use Replit domain
- [ ] Session cookies configured correctly
- [ ] CORS settings updated for production
- [ ] No hardcoded API keys or secrets
- [ ] Premium theme enforcement working
- [ ] Workflow configured with correct ports

---

## 🚢 Deployment & Publishing

### Publishing Configuration (Autoscale)
This app is configured for **Autoscale Deployment** - ideal for web apps with variable traffic.

```javascript
// Deployment configuration (set via deploy_config_tool):
{
  deployment_target: "autoscale",
  build: ["npm", "run", "build"],  // Vite production build
  run: ["npm", "run", "preview:prod"],  // Both servers in production
}
```

### Build & Run Commands
```json
// package.json scripts
{
  "build": "vite build",  // Creates optimized production bundle
  "preview": "vite preview --port 5000 --host 0.0.0.0",  // Preview only
  "preview:prod": "node server.js & vite preview --port 5000 --host 0.0.0.0"  // Production
}
```

### Critical Port Configuration for Deployment
⚠️ **MUST expose port 5000** - Replit only supports ONE external port in Autoscale

```typescript
// vite.config.ts - Preview configuration
export default defineConfig({
  preview: {
    port: 5000,  // MUST match expected production port
    host: '0.0.0.0',  // MUST bind to all interfaces
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: false,
      }
    }
  }
});
```

### Publishing Checklist
Before publishing your app:
- [ ] Run `npm run build` successfully
- [ ] Test `npm run preview:prod` locally
- [ ] Verify preview server runs on port 5000 (not 4173)
- [ ] Confirm backend starts on port 3001
- [ ] Check all environment secrets are set in deployment
- [ ] Database schema is up to date (`npm run db:push`)
- [ ] No hardcoded localhost URLs
- [ ] Session cookies configured correctly for production

### Production Environment Variables
Set these in Replit deployment settings (not dev secrets):
- `XAI_API_KEY` - XAI Grok API key
- `DATABASE_URL` - Production database URL (auto-provided)
- `NODE_ENV=production` (optional, for conditional logic)
- `SESSION_SECRET` - Auto-generated by Replit

### Autoscale Deployment Features
✅ **Automatic scaling**: Scales up for traffic, down to zero when idle  
✅ **Cost optimization**: Only pay when serving requests  
✅ **99.95% uptime**: High reliability  
✅ **Custom domains**: Use your own domain or `<app-name>.replit.app`  
✅ **Monitoring**: Track performance and usage  

⚠️ **Limitations**:
- No persistent filesystem storage (use database or Object Storage)
- Must handle parallel requests
- Single external port only (port 5000)

---

## 🔄 Production vs Development Differences

### Environment Detection
```javascript
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
```

### Key Differences

| Feature | Development | Production (Published) |
|---------|------------|------------------------|
| **Domain** | `https://<id>-00-<hash>.worf.replit.dev` | `https://<app-name>.replit.app` or custom domain |
| **Database** | Development PostgreSQL instance | Production PostgreSQL instance |
| **Sessions** | Development session table | Production session table |
| **Secrets** | Dev secrets (Secrets tab) | Deployment secrets (separate) |
| **Frontend** | `npm run dev` (Vite dev server) | `npm run preview:prod` (Vite preview) |
| **Port 5000** | Local only | Exposed to public (port 80) |
| **Cookie Secure** | `false` (HTTP allowed) | `true` (HTTPS only) |
| **Scaling** | Single instance | Auto-scales 0→N instances |
| **Storage** | Temporary filesystem | No persistent filesystem |
| **Logs** | Workflow logs visible | Deployment logs tab |

### Database Separation
⚠️ **Development and Production use DIFFERENT databases**

```bash
# Development database
DATABASE_URL (from dev environment)
└─ Used during local development and testing

# Production database  
DATABASE_URL (from deployment environment)
└─ Used by published app
└─ Separate data, separate sessions, separate users
```

**Important**: Schema changes must be pushed to BOTH:
```bash
# Push to development database (while developing)
npm run db:push

# Push to production database (after publishing)
# Use Replit deployment console or manual migration
```

### Session Handling
Development and production maintain **separate session stores**:
- Users logged in during dev won't be logged in on production
- Session tables are independent
- Auth flow must be tested in both environments

### OAuth Callback URLs
```javascript
// Development
https://<dev-domain>/api/callback

// Production
https://<app-name>.replit.app/api/callback
// OR https://your-custom-domain.com/api/callback
```

⚠️ Both URLs must be registered in OAuth provider settings

### Testing Strategy
1. **Development**: Test features locally with `npm run dev`
2. **Preview**: Test production build with `npm run preview:prod`
3. **Deploy**: Publish to production
4. **Verify**: Test published app with real domain
5. **Monitor**: Check deployment logs for errors

---

## 📚 Additional Resources

- **Replit Docs**: https://docs.replit.com
- **Replit Auth Guide**: See `blueprint:javascript_log_in_with_replit`
- **Project Documentation**: `replit.md`
- **Database Schema**: `shared/schema.js`
- **API Service**: `services/apiService.ts`

---

## 🤖 For AI Agents

When working on this project:
1. **Read `replit.md` first** - Contains project context and preferences
2. **Never change port configurations** - Follow specifications above
3. **Use Replit environment variables** - Never hardcode domains/ports
4. **Respect authentication flow** - OAuth must use Replit domains
5. **Follow database rules** - Use Drizzle Kit, never manual migrations
6. **Test before completing tasks** - Restart workflows and check logs
7. **Update `replit.md`** - Document significant changes

---

## 🔧 Common Deployment Issues & Solutions

### Issue: Port 4173 Instead of 5000
**Problem**: Deployment fails with "application is running on port 4173"  
**Solution**: 
```typescript
// Add preview config to vite.config.ts
preview: {
  port: 5000,
  host: '0.0.0.0',
}

// Update package.json
"preview": "vite preview --port 5000 --host 0.0.0.0"
```

### Issue: Backend Not Responding in Production
**Problem**: API calls fail with 404 or connection refused  
**Solution**:
- Verify backend starts with frontend: `node server.js & vite preview`
- Check `preview:prod` script runs both servers
- Ensure proxy configuration exists in `preview` config

### Issue: Authentication Fails in Production
**Problem**: Users can't log in or sessions don't persist  
**Solution**:
- Verify `XAI_API_KEY` is set in deployment secrets (not dev secrets)
- Check `DATABASE_URL` points to production database
- Confirm OAuth callback URLs include production domain
- Ensure session table exists in production database

### Issue: Database Schema Mismatch
**Problem**: Production errors about missing tables/columns  
**Solution**:
```bash
# Push schema to production database
# Access deployment console and run:
npm run db:push

# Or connect to production database and manually migrate
```

### Issue: Static Assets Not Loading
**Problem**: Images, CSS, or JS files return 404  
**Solution**:
- Run `npm run build` before deploying
- Verify build creates `dist` folder
- Check Vite preview serves from `dist` folder

### Issue: CORS Errors in Production
**Problem**: "blocked by CORS policy" errors  
**Solution**:
```javascript
// Update CORS configuration for production domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://your-app.replit.app',
  credentials: true
};
```

---

## 📅 Last Updated
November 16, 2025

**Version**: 2.0.0 - Published Edition  
**Maintainer**: Project Team  
**Status**: Production-Ready & Published
