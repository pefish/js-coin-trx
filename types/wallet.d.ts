export default class Wallet {
    private fullNode;
    private solidityNode;
    private tronWeb;
    constructor();
    getSeedHexByMnemonic(mnemonic: string, pass?: string): string;
    getXprivBySeed(seedHex: string): string;
    isAddress(address: string): boolean;
    deriveAllByXprivPath(xpriv: string, path: string): {
        xpriv: string;
        xpub: string;
        privateKey: string;
        publicKey: string;
        address: string;
    };
    buildTransferTx(pkey: string, fromAddress: string, toAddress: string, amount: string): Promise<{
        txId: string;
        txHex: string;
        txData: {
            [x: string]: any;
        };
    }>;
    buildTransferTokenTx(pkey: string, fromAddress: string, toAddress: string, tokenName: string, amount: string): Promise<{
        txId: any;
        txHex: any;
    }>;
    sendRawTransaction(tx: {
        [x: string]: any;
    }): Promise<boolean>;
    buildContractCallTx(pkey: string, contractAddress: string, fromAddress: string, method: string, params: {
        type: string;
        value: any;
    }[]): Promise<{
        txId: any;
        txHex: any;
    }>;
}
