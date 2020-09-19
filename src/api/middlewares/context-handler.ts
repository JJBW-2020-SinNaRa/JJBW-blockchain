import {
  AuthenticationError,
} from "apollo-server-express";
import type {
  ApolloContext,
  IntegrationContext,
} from "src/types";

export const contextHandler = async ({
  req,
  res,
}: IntegrationContext): Promise<ApolloContext> => {
  return {

  };
};
