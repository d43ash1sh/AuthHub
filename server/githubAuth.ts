import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  // Use memory store for development to avoid database connection issues
  return session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupGitHubAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Only set up GitHub OAuth if credentials are provided
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    // GitHub OAuth Strategy
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/github/callback",
      scope: ['user:email', 'repo', 'read:user']
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Create or update user with GitHub data
        const user = await storage.upsertUser({
          id: profile.id.toString(),
          email: profile.emails?.[0]?.value || null,
          firstName: profile.displayName?.split(' ')[0] || profile.username,
          lastName: profile.displayName?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: profile.photos?.[0]?.value || null,
          githubUsername: profile.username,
          githubAccessToken: accessToken,
        });

        return done(null, { ...user, accessToken });
      } catch (error) {
        return done(error, null);
      }
    }));

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await storage.getUser(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });

    // Auth routes
    app.get("/api/login", passport.authenticate("github", { 
      scope: ['user:email', 'repo', 'read:user'] 
    }));

    app.get("/api/github/callback", 
      passport.authenticate("github", { failureRedirect: "/login-error" }),
      (req, res) => {
        res.redirect("/");
      }
    );
  } else {
    // Fallback routes when GitHub OAuth is not configured
    app.get("/api/login", (req, res) => {
      res.status(500).json({ 
        message: "GitHub OAuth not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables." 
      });
    });

    app.get("/api/github/callback", (req, res) => {
      res.status(500).json({ 
        message: "GitHub OAuth not configured." 
      });
    });
  }

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};