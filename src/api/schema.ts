import {
  makeExecutableSchema,
} from "apollo-server-express";
import {
  typeDefs,
  resolvers,
} from "graphql-scalars";
import {
  RootSchema
} from "./graphql";

export const schema = makeExecutableSchema({
  typeDefs: [
    ...typeDefs,
    RootSchema.typeDefs
  ],
  resolvers: [
    resolvers,
    RootSchema.resolver
  ],
});
