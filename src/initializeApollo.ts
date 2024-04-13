import express from "express";
import http from 'http';
import schema from "./schema/schema.js";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import Context from "./models/context.js";
import UserClass from "./models/user.js";
import jwt from "./utils/jwt.js";
import { unwrapResolverError } from "@apollo/server/errors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    schema,
    introspection: true,
    formatError: (formattedError, error) => {
        // unwrapResolverError removes the outer GraphQLError wrapping from
        // errors thrown in resolvers, enabling us to check the instance of
        // the original error
        if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
            return formattedError;
        }

        console.error(error);

        if (unwrapResolverError(error)) {
            return { message: "Internal server error" };
        }
        return formattedError;
    },
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault()],
});

await server.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>({ origin: "*" }),
    express.json(),
    expressMiddleware(server, {
        context: async (ctx: Context) => {
            console.log("apollo - jwtMiddleware - context")
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
    }),
);

const port = +process.env.GRAPHQL_PORT || 4000;

await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
console.log(`🚀 GraphQL Server ready at http://localhost:${port}`);

