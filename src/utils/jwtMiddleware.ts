import { expressMiddleware } from "@apollo/server/express4";
import Context from "../models/context.js";
import UserClass from "../models/user.js";
import jwt from "./jwt.js";
import apolloServer from "./apolloServer.js";

export default function jwtMiddleware() {
  return expressMiddleware(apolloServer, {
    context: async (ctx: Context) => {
      const token = ctx.req.headers.authorization || "";
      if (token) {
        try {
          const user = jwt.decodeJwt<UserClass>(token);
          ctx.user = user;
        } catch (error) {
          console.error(error);
        }
      }
      return ctx;
    },
  });
}
