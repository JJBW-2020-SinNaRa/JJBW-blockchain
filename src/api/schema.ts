import {
  makeExecutableSchema,
} from "apollo-server-express";
import {
  typeDefs,
  resolvers,
} from "graphql-scalars";
import {
  RootSchema,
  BlockChainSchema
} from "./graphql";

export const schema = makeExecutableSchema({
  typeDefs: [
    ...typeDefs,
    RootSchema.typeDefs,
    BlockChainSchema.typeDefs
  ],
  resolvers: [
    resolvers,
    RootSchema.resolver,
    BlockChainSchema.resolver
  ],
});
