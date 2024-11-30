import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const getDomainWithoutSubdomain = (hostname: string) => {
  const urlParts = hostname.split(".");
  return urlParts.slice(-(urlParts.length === 4 ? 3 : 2)).join(".");
};

const nextUrl = process.env.NEXT_PUBLIC_AUTH_URL || "";
let useSecureCookies = false;
let cookiePrefix = "";
let hostName = "";

try {
  const url = new URL(nextUrl);
  useSecureCookies = url.protocol === "https:";
  cookiePrefix = useSecureCookies ? "__Secure-" : "";
  hostName = getDomainWithoutSubdomain(url.hostname);
} catch (e) {
  console.error("Invalid NEXT_PUBLIC_AUTH_URL:", (e as Error).message);
  hostName = "localhost";
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email et mot de passe requis.");
        }
      
        try {
          const client = await clientPromise;
          const db = client.db(process.env.NEXT_DATABASE);
          const user = await db
            .collection(process.env.NEXT_TABLE || "")
            .findOne({ email: credentials.email });
      
          if (!user) {
            throw new Error("Utilisateur non trouvé.");
          }
      
          const isValid = await bcrypt.compare(credentials.password, user.password);
      
          if (!isValid) {
            throw new Error("Mot de passe incorrect.");
          }
      
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            firstname: user.firstname || null,
            lastname: user.lastname || null,
            image: user.image || null,
            access_token: user.access_token || null,
            refresh_token: user.refresh_token || null,
          };
        } catch (error) {
          console.error("Erreur dans authorize:", error);
          throw new Error("Erreur interne. Veuillez réessayer.");
        }
      },    
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 mins
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: hostName === "localhost" ? hostName : `.${hostName}`,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.picture = user.image;
        token.accessToken = user.access_token || token.accessToken;
        token.refreshToken = user.refresh_token || token.refreshToken;
      }
      return token;
    },    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstname = token.firstname as string | null;
        session.user.lastname = token.lastname as string | null;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === "/") {
        return baseUrl;
      }
    
      try {
        const validUrl = new URL(url);
        return url.startsWith(baseUrl) ? url : baseUrl;
      } catch (e) {
        console.error("Redirection error:", (e as Error).message);
        return baseUrl;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/signin",
  },
};
