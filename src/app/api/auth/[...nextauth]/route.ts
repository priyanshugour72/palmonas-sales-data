import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_DOMAIN = "palmonas.com";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      const email = user?.email?.toLowerCase() ?? "";
      if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        return `/auth/error?error=DomainNotAllowed&message=${encodeURIComponent(`Only @${ALLOWED_DOMAIN} emails are allowed`)}`;
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user?.email) token.email = user.email;
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
