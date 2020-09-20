import {gql, IResolvers} from "apollo-server-express";
import {caver, Service} from "../../core";

const typeDefs = gql`
    input TransactionInput {
        trashID: Int!,
        imageSrc: String!,
        location: String!,
        trashKind: String!
    }
    
    type TransactionResult {
        blockHash: String,
        blockNumber: String,
        contractAddress: String,
        from: String,
        gas: String,
        gasPrice: String,
        gasUsed: String,
        input: String,
        logs: [String],
        logsBloom: String,
        nonce: String,
        senderTxHash: String
        signatures: [Signatures],
        status:String,
        to: String,
        transactionHash: String,
        transactionIndex: String,
        type: String,
        typeInt: Int,
        value: String
    }
    
    type Signatures {
        V: String,
        R: String,
        S: String
    }

    extend type Query {
        getTransaction(transaction : String): String
    }

    extend type Mutation {
        makeTransaction(input: TransactionInput): TransactionResult,
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
      const {pubkey : PublicKey, prikey: PrivateKey} = req.headers;
      
      if (!PublicKey || !PrivateKey) {
        throw new Error('No Public or Private Key!')
      }
      
      let dep = await caver.wallet.getKeyring(PublicKey);
      
      if (!dep) {
        dep = caver.wallet.newKeyring(PublicKey, PrivateKey)
      }
  
      const res: any[] = [];
      Object.keys(input).map((value : string | number) => {
        const v = input[value];
        typeof v === "string"
          ? res.push(caver.utils.utf8ToHex(v))
          : res.push(v)
      })
      console.log(res)
      const [id, imageSrc, location, trashKind] = res
      
      const abiCreateInput = Service.methods.init(
        caver.abi.encodeParameter('uint256', id),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(imageSrc, 64)),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(location, 64)),
        caver.abi.encodeParameter('bytes32', caver.utils.padRight(trashKind, 64)),
      ).encodeABI();
      
      const smartContractExecutionTx = new caver.transaction.smartContractExecution({
        from: dep.address,
        to: process.env.CONTRACT_ADDRESS,
        input: abiCreateInput,
        gas: "0xf4240"
      })
      
      try {
        await caver.wallet.sign(dep.address, smartContractExecutionTx);
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
