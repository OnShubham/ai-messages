import { NextAuthOptions } from "next-auth";
import CredionalProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { constants } from "fs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredionalProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found");
          }
          if (user.isVerified) {
            throw new Error("User not verified");
          }

          const isPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPassword) {
            return user;
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (err: any) {
          throw new Error("An error occurred");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.MEXTAUTH_SECRET,
};
