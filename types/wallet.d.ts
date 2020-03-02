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
    getAllFromPkey(pkey: string): {
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
        txData: any;
    }>;
    sendRawTransaction(tx: {
        [x: string]: any;
    }): Promise<Error>;
    mustSendRawTransaction(tx: {
        [x: string]: any;
    }): Promise<void>;
    buildContractCallTx(pkey: string, contractAddress: string, fromAddress: string, method: string, params: {
        type: string;
        value: any;
    }[], opts?: {
        callValue?: number;
        feeLimit: number;
        _isConstant?: boolean;
        confirmed?: boolean;
    }): Promise<{
        txId: any;
        txHex: any;
        txData: any;
    }>;
    hexToUtf8(hex: string): string;
    utf8ToHex(utf8: string): string;
    hexToAddress(hex: string): string;
    addressToHex(address: string): string;
}
