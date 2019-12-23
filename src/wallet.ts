
import { fromSeed, fromBase58 } from 'bip32'
import * as bip39Lib from 'bip39'
import TronWeb from 'tronweb'

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
    return {
      xpriv: currentNode.toBase58(),
      xpub: currentNode.neutered().toBase58(),
      privateKey,
      publicKey: currentNode.publicKey.toHexString_(false),
      address: TronWeb.address.fromPrivateKey(privateKey),
    }
  }

  async buildTransferTx(pkey: string, fromAddress: string, toAddress: string, amount: string): Promise<{
    txId: string,
    txHex: string,
    txData: { [x: string]: any },
  }> {
    let tx = await this.tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress)
    tx = await this.tronWeb.trx.sign(tx, pkey)
    return {
      txId: tx.txID,
      txHex: tx.raw_data_hex,
      txData: tx,
    }
  }

  async buildTransferTokenTx(pkey: string, fromAddress: string, toAddress: string, tokenName: string, amount: string) {
    let tx = await this.tronWeb.transactionBuilder.sendToken(toAddress, amount, tokenName, fromAddress)
    tx = await this.tronWeb.trx.sign(tx, pkey)
    return {
      txId: tx.txID,
      txHex: tx.raw_data_hex,
      txData: tx,
    }
  }

  async sendRawTransaction(tx: { [x: string]: any }): Promise<boolean> {
    const result = await this.tronWeb.trx.sendRawTransaction(tx)
    return result.result
  }

  async buildContractCallTx(pkey: string, contractAddress: string, fromAddress: string, method: string, params: {
    type: string,
    value: any,
  }[], opts: {[x: string]: any} = {}) {
    let tx = await this.tronWeb.transactionBuilder.triggerSmartContract(contractAddress, method, opts, params, fromAddress);
    tx = await this.tronWeb.trx.sign(tx.transaction, pkey)
    return {
      txId: tx.txID,
      txHex: tx.raw_data_hex,
      txData: tx,
    }
  }

  hexToAddress (hex: string): string {
    return this.tronWeb.address.fromHex(hex)
  }

  addressToHex (address: string): string {
    return this.tronWeb.address.toHex(address)
  }
}
