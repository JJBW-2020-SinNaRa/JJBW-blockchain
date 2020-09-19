import {gql, IResolvers} from "apollo-server-express";
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
    makeTransaction: async (_, {input}, {req}) => {
      const {pubkey} = req.headers;
      
      if (!pubkey) {
        throw new Error('No Public Key!')
      }
      
      const res: any[] = [];
      Object.keys(input).forEach(value => {
        res.push(caver.utils.asciiToHex(value))
      })
      const [imageSrc, location, trashKind] = res
      
      const abiCreateInput = Service.methods.createProject(
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(imageSrc, 64)),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(location, 64)),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(trashKind, 64)),
      ).encodeABI();
      
      const smartContractExecutionTx = new caver.transaction.smartContractExecution({
        from: "",
        to: process.env.CONTRACT_ADDRESS,
        input: abiCreateInput,
        gas: process.env.GAS_LIMIT
      })
      
      try {
        await caver.wallet.sign("", smartContractExecutionTx);
        return await caver.rpc.klay.sendRawTransaction(smartContractExecutionTx.getRLPEncoding());
      } catch (e) {
        throw new Error(e)
      }
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
