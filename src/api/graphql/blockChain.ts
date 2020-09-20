import {gql, IResolvers} from "apollo-server-express";
import {caver, Service} from "../../core";
import {trim} from "../../lib/util";

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
        getTransaction(id : Int): TrashDataResult
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
        const r = await Service.methods.getTrashInfo(id).call()
        
        return {
          trashID: parseInt(r.trashID),
          status: trim(caver.utils.hexToUtf8(r.status)),
          imageSrc: trim(caver.utils.hexToUtf8(r.imageSrc)),
          location: trim(caver.utils.hexToUtf8(r.location)),
          trashKind: trim(caver.utils.hexToUtf8(r.trashKind)),
          klay: parseInt(r.klay)
        };
      } catch (e) {
        throw new Error(e)
      }
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
