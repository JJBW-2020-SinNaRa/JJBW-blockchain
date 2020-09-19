import { gql, IResolvers } from "apollo-server-express";
import {caver, Service} from "../../core";

const typeDefs = gql`
    input TransactionInput {
        imageSrc: String!,
        location: String!,
        trashKind: String!
    }
    
    extend type Query {
        getTransaction(transaction : String): String
    }
    
    extend type Mutation {
        makeTransaction(input: TransactionInput): String,
        updateStatus(hash: String, status: String): String,
        updateKlay(hash: String, klay: Int): String
    }
#    extend type Subscription {
#        __: String
#    }
`;

const resolver: IResolvers = {
  Query: {
    getTransaction: (_, {transaction}) => {
      return caver.transaction.decode(transaction)
    }
  },
  Mutation: {
    makeTransaction: (_, {input}) => {
      const {imageSrc, location, trashKind} = input;
      console.debug(input);
      
      return "transaction hash";
    },
    updateStatus: (_, {hash, status}) => {
      console.debug(hash, status);
      
      return "update status";
    },
    updateKlay: (_, {hash, klay}) => {
      console.debug(hash, klay);
      
      return "update klay";
    },
  },
  // Subscription: {
  //   __: () => "",
  // }
};
export const BlockChainSchema = {
  typeDefs,
  resolver
}
