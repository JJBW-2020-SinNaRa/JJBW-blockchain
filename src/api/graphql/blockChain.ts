import {gql, IResolvers} from "apollo-server-express";
import {caver, Service} from "../../core";
import {decodeAllInput, encodeAllInput, trim} from "../../lib/util";

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

    type TrashDataResult {
        trashID: Int,
        status: String,
        imageSrc: String,
        location: String,
        trashKind: String,
        klay: Int
    }

    type Signatures {
        V: String,
        R: String,
        S: String
    }

    extend type Query {
        getTrash(id: Int): TrashDataResult
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
    getTrash: async (_, {id}) => {
      const TrashID = caver.abi.encodeParameter('uint256', id);
      try {
        return decodeAllInput(await Service.methods.getTrashInfo(id).call())
      } catch (e) {
        throw new Error(e)
      }
    }
  },
  Mutation: {
    makeTransaction: async (_, {input}, {req}) => {
      const {pubkey: PublicKey, prikey: PrivateKey} = req.headers;
      
      if (!PublicKey || !PrivateKey) {
        throw new Error('No Public or Private Key!')
      }
      
      let dep = await caver.wallet.getKeyring(PublicKey);
      
      if (!dep) {
        dep = caver.wallet.newKeyring(PublicKey, PrivateKey)
      }
      
      const abiCreateInput = Service.methods.init(...encodeAllInput(input)).encodeABI();
      
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
