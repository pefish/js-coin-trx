
import { fromSeed, fromBase58 } from 'bip32'
import * as bip39Lib from 'bip39'
import TronWeb from 'tronweb'
import TimeUtil from '@pefish/js-util-time'
import util from 'util'

interface TransactionInfo {
  id: string,
  fee?: number, // 消耗的energy的数量
  blockNumber: number,
  blockTimeStamp: number,
  contractResult?: string[],
  contract_address?: string,
  receipt: {
    energy_fee?: number,
    energy_usage_total?: number,
    net_usage: number,
    result?: string,
  },
  log?: {
    address: string,
    topics: any[][],
    data: string
  }[],
  internal_transactions?: { [x: string]: any }[],
  result?: string,
  resMessage?: string,
}

interface Transaction {
  ret?: {
    contractRet: string,
  }[],
  signature: string[],
  txID: string,
  raw_data: {
    contract: { [x: string]: any },
    ref_block_bytes: string,
    ref_block_hash: string,
    expiration: number,
    fee_limit: number,
    timestamp: number,
  },
  raw_data_hex: string,
}
export default class Wallet {
  private fullNode: string = `https://api.trongrid.io`
  private solidityNode: string = `https://api.trongrid.io`
  private tronWeb: TronWeb

  constructor() {
    this.tronWeb = new TronWeb(this.fullNode, this.solidityNode)
  }

  getSeedHexByMnemonic(mnemonic: string, pass: string = ''): string {
    return bip39Lib.mnemonicToSeedSync(mnemonic, pass).toString('hex')
  }

  getXprivBySeed(seedHex: string): string {
    const key = fromSeed(Buffer.from(seedHex, `hex`))
    return key.toBase58()
  }

  isAddress(address: string): boolean {
    return TronWeb.isAddress(address)
  }

  deriveAllByXprivPath(xpriv: string, path: string): {
    xpriv: string,
    xpub: string,
    privateKey: string,
    publicKey: string,
    address: string,
  } {
    const node = fromBase58(xpriv)
    const currentNode = node.derivePath(path)
    const privateKey = currentNode.privateKey.toHexString_(false)
    const publicKey = TronWeb.utils.code.byteArray2hexStr(TronWeb.utils.crypto.getPubKeyFromPriKey(currentNode.privateKey)).toLowerCase()
    return {
      xpriv: currentNode.toBase58(),
      xpub: currentNode.neutered().toBase58(),
      privateKey,
      publicKey,
      address: TronWeb.address.fromPrivateKey(privateKey),
    }
  }

  getAllFromPkey(pkey: string): {
    publicKey: string,
    address: string,
  } {
    return {
      publicKey: TronWeb.utils.code.byteArray2hexStr(TronWeb.utils.crypto.getPubKeyFromPriKey(pkey.hexToBuffer_())).toLowerCase(),
      address: TronWeb.address.fromPrivateKey(pkey),
    }
  }

  async buildTransferTx(pkey: string, toAddress: string, amount: string): Promise<{
    txId: string,
    txHex: string,
    txData: { [x: string]: any },
  }> {
    const { address } = this.getAllFromPkey(pkey)
    let tx = await this.tronWeb.transactionBuilder.sendTrx(toAddress, amount, address)
    tx = await this.tronWeb.trx.sign(tx, pkey)
    return {
      txId: tx.txID,
      txHex: tx.raw_data_hex,
      txData: tx,
    }
  }

  async getBalance (address: string): Promise<string> {
    const result = await this.tronWeb.trx.getBalance(address)
    return result.toString()
  }

  async getUnconfirmedBalance (address: string): Promise<string> {
    const result = await this.tronWeb.trx.getUnconfirmedBalance(address)
    return result.toString()
  }

  async buildTransferTokenTx(pkey: string, toAddress: string, tokenName: string, amount: string) {
    const { address } = this.getAllFromPkey(pkey)
    let tx = await this.tronWeb.transactionBuilder.sendToken(toAddress, amount, tokenName, address)
    tx = await this.tronWeb.trx.sign(tx, pkey)
    return {
      txId: tx.txID,
      txHex: tx.raw_data_hex,
      txData: tx,
    }
  }

  // 未确认的也能取到
  async getTransaction(txHash: string): Promise<Transaction> {
    return await this.tronWeb.trx.getTransaction(txHash)
  }

  // 只能取到已确认的
  async getConfirmedTransaction(txHash: string): Promise<Transaction> {
    try {
      return await this.tronWeb.trx.getConfirmedTransaction(txHash)
    } catch (err) {
      if (err.indexOf(`Transaction not found`) !== -1) {
        return null
      }
      throw err
    }
  }

  async getConfirmedTransactionInfo(txHash: string): Promise<TransactionInfo> {
    const transactionInfo = await this.tronWeb.trx.getTransactionInfo(txHash)
    if (!transactionInfo || Object.keys(transactionInfo).length === 0) {
      return null
    }
    return transactionInfo
  }

  // 交易确认但是失败的话，抛出错误
  async syncSendRawTx(tx: { [x: string]: any }): Promise<TransactionInfo> {
    await this.sendRawTx(tx)
    while (true) {
      // console.log(`检查 ${tx.txID} 交易中...`)
      const tran = await this.getConfirmedTransactionInfo(tx.txID)
      if (tran) {
        // console.log(`${tx.txID} 交易已确认。区块id：${tran.blockNumber}`)
        if (tran.receipt.result && tran.receipt.result !== `SUCCESS`) {
          throw new Error(this.hexToUtf8(tran.resMessage))
        }
        return tran
      }
      await TimeUtil.sleep(3000)
    }
  }

  async sendRawTxReturnErr(tx: { [x: string]: any }): Promise<Error> {
    try {
      const result = await this.tronWeb.trx.sendRawTransaction(tx)
      if (result.code) {
        return new Error(this.tronWeb.toUtf8(result.message))
      }
      return null
    } catch (err) {
      return err
    }
  }

  async sendRawTx(tx: { [x: string]: any }) {
    const err = await this.sendRawTxReturnErr(tx)
    if (err) {
      throw err
    }
  }

  async buildContractCallTx(pkey: string, contractAddress: string, method: string, params: {
    type: string,
    value: any,
  }[], opts: {
    callValue?: number,
    feeLimit?: number,
    _isConstant?: boolean,
    confirmed?: boolean,
  } = {
        callValue: 0,
        feeLimit: 1_000_000_000, // 最高Energy费用限额 1000 TRX
        _isConstant: false,
        confirmed: false,
      }) {
    if (!opts.feeLimit) {
      opts.feeLimit = 1_000_000_000
    }
    const { address } = this.getAllFromPkey(pkey)
    let tx = await this.tronWeb.transactionBuilder.triggerSmartContract(contractAddress, method, opts, params, address);
    tx = await this.tronWeb.trx.sign(tx.transaction, pkey)
    return {
      txId: tx.txID,
      txHex: tx.raw_data_hex,
      txData: tx,
    }
  }

  hexToUtf8(hex: string): string {
    return this.tronWeb.toUtf8(hex)
  }

  utf8ToHex(utf8: string): string {
    return this.tronWeb.fromUtf8(utf8)
  }

  hexToAddress(hex: string): string {
    return this.tronWeb.address.fromHex(hex)
  }

  addressToHex(address: string): string {
    return this.tronWeb.address.toHex(address)
  }
}
