import cors from "cors";
import bodyParser from "body-parser";
import jwtMiddleware from "./utils/jwtMiddleware.js";
import express from "express";
import apolloServer from "./utils/apolloServer.js";

const app = express();

await apolloServer.start();

app.use(
  "/",
  cors({
    origin: process.env.ORIGINS.split(";"),
  }),
  bodyParser.json(),
  jwtMiddleware()
);

const port = +process.env.APP_PORT;

app.listen({ port });

console.log(`🚀 GraphQL Server ready at http://localhost:${port}`);
