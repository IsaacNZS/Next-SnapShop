import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../sever/index";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { users } from "./schema";
import { Stripe } from "stripe";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET!,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Credentials({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const existingmail = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email as string));

        return {
          id: existingmail[0].id.toString(),
          name: existingmail[0].name,
          email: existingmail[0].email,
          image: existingmail[0].image,
          isTwo: existingmail[0].isTwo,
          role: existingmail[0].role,
        };
      },
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2026-05-27.dahlia",
      });
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });
      await db
        .update(users)
        .set({
          clientId: customer.id,
        })
        .where(eq(users.id, user.id!));
    },
  },
});
