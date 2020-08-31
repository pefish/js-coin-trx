
import { fromSeed, fromBase58 } from 'bip32'
import * as bip39Lib from 'bip39'
import TronWeb from 'tronweb'
import TimeUtil from '@pefish/js-util-time'
import { retry } from '@pefish/js-decorator'
import abiUtil from './abi'
export interface TransactionInfoType {
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

export interface TransactionType {
  ret?: {
    contractRet: string,
  }[],
  signature: string[],
  txID: string,
  raw_data: {
    contract: {
      parameter: {
        value: { [x: string]: any },
        type_url: string,
      },
      type: string,
    }[],
    ref_block_bytes: string,
    ref_block_hash: string,
    expiration: number,
    fee_limit: number,
    timestamp: number,
  },
  raw_data_hex: string,
}

export interface ContractCallOpt {
  callValue?: number,
  feeLimit?: number,
}

export interface BlockType {
  blockID: string,
  block_header: {
    raw_data: {
      number: number,
      txTrieRoot: string,
      witness_address: string,
      parentHash: string,
      version: number,
      timestamp: number,
    },
    witness_signature: string,
  },
  transactions: TransactionType[],
}
export default class TrxWallet {
  private fullNode: string = `https://api.trongrid.io`  // https://api.tronstack.io
  private solidityNode: string = `https://api.trongrid.io`
  private tronWeb: TronWeb
  private timeout: number

  constructor(timeout: number = 60000) {
    this.timeout = timeout
    this.tronWeb = new TronWeb(new TronWeb.providers.HttpProvider(this.fullNode, this.timeout), new TronWeb.providers.HttpProvider(this.solidityNode, this.timeout))
  }

  setNode (fullNode: string, solidityNode: string) {
    this.fullNode = fullNode
    this.solidityNode = solidityNode
    this.tronWeb = new TronWeb(new TronWeb.providers.HttpProvider(this.fullNode, this.timeout), new TronWeb.providers.HttpProvider(this.solidityNode, this.timeout))
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

  decodeContractPayload(types: string[], dataStr: string): {
    methodIdHex: string,
    params: any[],
  } {
    // dataStr = dataStr.replace(/^0x/, ``) // 有0x的话去掉
    // return {
    //   methodIdHex: dataStr.substr(0, 8),
    //   params: TronWeb.utils.abi.decodeParams(types, `0x` + dataStr.substr(8)),
    // }
    const dataBuf = new Buffer(dataStr.replace(/^0x/, ``), `hex`)
    const inputsBuf = dataBuf.slice(4)
    const params = abiUtil.rawDecode(types, inputsBuf)
    return {
      methodIdHex: '0x' +  dataBuf.slice(0, 4).toString(`hex`),
      params
    }
  }

  encodeContractPayload(methodIdHex: string, types: string[], params: any[]): string {
    methodIdHex = methodIdHex.replace(/^0x/, ``)
    for (let i = 0; i < types.length; i++) {
      if (types[i] === 'address') {
        params[i] = TronWeb.address.toHex(params[i])
      }
    }
    const data = abiUtil.rawEncode(types, params).toHexString_(false)
    return methodIdHex + data
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

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
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

  // 获取trx余额（已经确认的）
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getBalance(address: string): Promise<string> {
    const result: number = await this.tronWeb.trx.getBalance(address)
    return result.toString()
  }

  // 获取token余额（已经确认的）
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getTokenBalance(address: string, contractAddress: string): Promise<string> {
    const tx = await this.tronWeb.transactionBuilder.triggerConfirmedConstantContract(contractAddress, `balanceOf(address)`, {},
      [{
        type: `address`,
        value: address,
      }],
      address)
    if (!tx.result.result) {
      throw new Error(`result is false`)
    }
    return tx.constant_result[0].hexToDecimalString_()
  }

  // 获取token余额（包括还没有确认的）
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getUnconfirmedTokenBalance(address: string, contractAddress: string): Promise<string> {
    const tx = await this.tronWeb.transactionBuilder.triggerConstantContract(contractAddress, `balanceOf(address)`, {},
      [{
        type: `address`,
        value: address,
      }],
      address)
    if (!tx.result.result) {
      throw new Error(`result is false`)
    }
    return tx.constant_result[0].hexToDecimalString_()
  }

  // 获取trx余额（包括还没有确认的）
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getUnconfirmedBalance(address: string): Promise<string> {
    const result = await this.tronWeb.trx.getUnconfirmedBalance(address)
    return result.toString()
  }

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async buildTransferTokenTx(pkey: string, contractAddress: string, toAddress: string, amount: string, opts: ContractCallOpt = {
    callValue: 0,
    feeLimit: 1_000_000_000,
  }) {
    const { address } = this.getAllFromPkey(pkey)
    let tx = await this.tronWeb.transactionBuilder.triggerSmartContract(contractAddress, `transfer(address,uint256)`,
      opts,
      [{
        type: `address`,
        value: toAddress,
      }, {
        type: `uint256`,
        value: amount,
      }],
      address)
    tx = await this.tronWeb.trx.sign(tx.transaction, pkey)
    return {
      txId: tx.txID,
      txHex: tx.raw_data_hex,
      txData: tx,
    }
  }

  // 未确认的也能取到
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getTransaction(txHash: string): Promise<TransactionType> {
    return await this.tronWeb.trx.getTransaction(txHash)
  }

  // 只能取到已确认的
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getConfirmedTransaction(txHash: string): Promise<TransactionType> {
    try {
      return await this.tronWeb.trx.getConfirmedTransaction(txHash)
    } catch (err) {
      if (err.indexOf(`Transaction not found`) !== -1) {
        return null
      }
      throw err
    }
  }

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getConfirmedTransactionInfo(txHash: string): Promise<TransactionInfoType> {
    const transactionInfo = await this.tronWeb.trx.getTransactionInfo(txHash)
    if (!transactionInfo || Object.keys(transactionInfo).length === 0) {
      return null
    }
    return transactionInfo
  }

  // 已经确认的同样能取到信息
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getUnconfirmedTransactionInfo(txHash: string): Promise<TransactionInfoType> {
    const transactionInfo = await this.tronWeb.trx.getUnconfirmedTransactionInfo(txHash)
    if (!transactionInfo || Object.keys(transactionInfo).length === 0) {
      return null
    }
    return transactionInfo
  }

  // 交易确认但是失败的话，抛出错误
  async syncSendRawTx(tx: { [x: string]: any }): Promise<TransactionInfoType> {
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

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
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

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getLatestBlock(): Promise<BlockType> {
    return await this.tronWeb.trx.getCurrentBlock()
  }

  /**
   * 获取多个块 [start, end)
   * @param start 哪个块开始
   * @param end 哪个块结束
   */
  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getBlocksByRange(start: number, end: number): Promise<BlockType[]> {
    return await this.tronWeb.trx.getBlockRange(start, end - 1)
  }

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async getBlockByNumber(number: number): Promise<BlockType> {
    return await this.tronWeb.trx.getBlockByNumber(number)
  }

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async sendRawTx(tx: { [x: string]: any }) {
    const err = await this.sendRawTxReturnErr(tx)
    if (err) {
      throw err
    }
  }

  @retry(3, [`status code 502`, `Client network socket disconnected`], 0)
  async buildContractCallTx(pkey: string, contractAddress: string, method: string, params: {
    type: string,
    value: any,
  }[], opts: ContractCallOpt = {
    callValue: 0,
    feeLimit: 1_000_000_000, // 最高Energy费用限额 1000 TRX
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
