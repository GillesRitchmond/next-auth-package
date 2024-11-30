// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstname?: string | null;
      lastname?: string | null;
      email?: string | null;
      image?: string | null;
      access_token?: string | null;
      refresh_token?: string | null;
    };
  }

  interface User {
    id: string;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    image?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
  }

  interface HomeProps {
    user: User;
  }
  
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
  }
}