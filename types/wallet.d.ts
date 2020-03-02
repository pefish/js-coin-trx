interface TransactionInfo {
    id: string;
    fee?: number;
    blockNumber: number;
    blockTimeStamp: number;
    contractResult?: string[];
    contract_address?: string;
    receipt: {
        energy_fee?: number;
        energy_usage_total?: number;
        net_usage: number;
        result?: string;
    };
    log?: {
        address: string;
        topics: any[][];
        data: string;
    }[];
    internal_transactions?: {
        [x: string]: any;
    }[];
    result?: string;
    resMessage?: string;
}
interface Transaction {
    ret?: {
        contractRet: string;
    }[];
    signature: string[];
    txID: string;
    raw_data: {
        contract: {
            [x: string]: any;
        };
        ref_block_bytes: string;
        ref_block_hash: string;
        expiration: number;
        fee_limit: number;
        timestamp: number;
    };
    raw_data_hex: string;
}
interface ContractCallOpt {
    callValue?: number;
    feeLimit?: number;
    _isConstant?: boolean;
    confirmed?: boolean;
}
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
    buildTransferTx(pkey: string, toAddress: string, amount: string): Promise<{
        txId: string;
        txHex: string;
        txData: {
            [x: string]: any;
        };
    }>;
    getBalance(address: string): Promise<string>;
    getTokenBalance(address: string, contractAddress: string): Promise<string>;
    getUnconfirmedBalance(address: string): Promise<string>;
    buildTransferTokenTx(pkey: string, contractAddress: string, toAddress: string, amount: string, opts?: ContractCallOpt): Promise<{
        txId: any;
        txHex: any;
        txData: any;
    }>;
    getTransaction(txHash: string): Promise<Transaction>;
    getConfirmedTransaction(txHash: string): Promise<Transaction>;
    getConfirmedTransactionInfo(txHash: string): Promise<TransactionInfo>;
    syncSendRawTx(tx: {
        [x: string]: any;
    }): Promise<TransactionInfo>;
    sendRawTxReturnErr(tx: {
        [x: string]: any;
    }): Promise<Error>;
    sendRawTx(tx: {
        [x: string]: any;
    }): Promise<void>;
    buildContractCallTx(pkey: string, contractAddress: string, method: string, params: {
        type: string;
        value: any;
    }[], opts?: ContractCallOpt): Promise<{
        txId: any;
        txHex: any;
        txData: any;
    }>;
    hexToUtf8(hex: string): string;
    utf8ToHex(utf8: string): string;
    hexToAddress(hex: string): string;
    addressToHex(address: string): string;
}
export {};
