import { buildSchema } from "type-graphql";
import { resolvers } from "../resolvers/index.js";
import { authChecker } from "../services/authchecker.js";

const schema = await buildSchema({
  resolvers,
  validate: false,
  authChecker,
});
export default schema