import type {
  Request,
  Response,
} from "express";

export type IntegrationContext = {
  req: Request,
  res: Response,
}

export type ApolloContext = {

}
