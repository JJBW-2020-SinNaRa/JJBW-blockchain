import {gql, IResolvers} from "apollo-server-express";
import {caver, Service} from "../../core";
import {decodeAllInput, encodeAllInput, trim, utf8toHex} from "../../lib/util";

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
        logs: [Logs],
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
    
    type Logs {
        address: String,
        topics: [String],
        data: String,
        blockNumber: String,
        transactionHash: String,
        transactionIndex: String,
        blockHash: String,
        logIndex: String,
        removed: Boolean
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
        updateStatus(id: Int, status: String): String,
        updateKlay(hash: String, klay: Int): String
    }
    #    extend type Subscription {
    #        __: String
    #    }
`;

const resolver: IResolvers = {
  Query: {
    getTrash: async (_, {id}) => {
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
        gas: process.env.GAS_LIMIT
      })

      try {
        await caver.wallet.sign(dep.address, smartContractExecutionTx);
        return await caver.rpc.klay.sendRawTransaction(smartContractExecutionTx.getRLPEncoding());
      } catch (e) {
        throw new Error(e)
      }
    },
    updateStatus: async (_, {id, status}, {req}) => {
      const {pubkey: PublicKey, prikey: PrivateKey} = req.headers;
      
      if (!PublicKey || !PrivateKey) {
        throw new Error('No Public or Private Key!')
      }
      
      let dep = await caver.wallet.getKeyring(PublicKey);
      
      if (!dep) {
        dep = caver.wallet.newKeyring(PublicKey, PrivateKey)
      }
      
      const abiCreateInput = Service
        .methods
        .updateStatus(
          id,
          caver.abi.encodeParameter('bytes32', caver.utils.padRight(utf8toHex(status), 64))
        ).encodeABI();
      
      const smartContractExecutionTx = new caver.transaction.smartContractExecution({
        from: dep.address,
        to: process.env.CONTRACT_ADDRESS,
        input: abiCreateInput,
        gas: process.env.GAS_LIMIT
      })
  
      try {
        await caver.wallet.sign(dep.address, smartContractExecutionTx);
        return await caver.rpc.klay.sendRawTransaction(smartContractExecutionTx.getRLPEncoding());
      } catch (e) {
        throw new Error(e)
      }
    },
    updateKlay: async (_, {id, klay}) => {
      const {pubkey: PublicKey, prikey: PrivateKey} = req.headers;
      
      if (!PublicKey || !PrivateKey) {
        throw new Error('No Public or Private Key!')
      }
      
      let dep = await caver.wallet.getKeyring(PublicKey);
      
      if (!dep) {
        dep = caver.wallet.newKeyring(PublicKey, PrivateKey)
      }
      
      const abiCreateInput = Service
        .methods
        .updateStatus(
          id,
          klay
        ).encodeABI();
      
      const smartContractExecutionTx = new caver.transaction.smartContractExecution({
        from: dep.address,
        to: process.env.CONTRACT_ADDRESS,
        input: abiCreateInput,
        gas: process.env.GAS_LIMIT
      })
      
      try {
        await caver.wallet.sign(dep.address, smartContractExecutionTx);
        return await caver.rpc.klay.sendRawTransaction(smartContractExecutionTx.getRLPEncoding());
      } catch (e) {
        throw new Error(e)
      }
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
