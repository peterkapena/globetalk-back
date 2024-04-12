import { ApolloServer } from "@apollo/server";
import { unwrapResolverError } from "@apollo/server/errors";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import schema from "../schema/schema.js";

const apolloServer = new ApolloServer({
  schema,
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
    ApolloServerPluginLandingPageDisabled()
  ],
});
export default apolloServer