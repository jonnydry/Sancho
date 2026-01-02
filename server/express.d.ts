import { InferSelectModel } from "drizzle-orm";
import { users } from "../shared/schema.js";

type DatabaseUser = InferSelectModel<typeof users>;

interface OAuthClaims {
  sub: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  exp?: number;
  iat?: number;
}

interface SessionUser {
  claims?: OAuthClaims;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}

export { DatabaseUser, OAuthClaims, SessionUser };
