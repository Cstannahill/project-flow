// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** The `id` you added in your session callback */
      id: string;
    } & DefaultSession["user"];
  }

  // If you ever read `user.id` in callbacks, you can also augment the User type:
  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** Stashed on first sign-in via your jwt() callback */
    id: string;
  }
}
