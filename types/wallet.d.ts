export interface TransactionInfoType {
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
        topics: any[];
        data: string;
    }[];
    internal_transactions?: {
        [x: string]: any;
    }[];
    result?: string;
    resMessage?: string;
}
export interface TransactionType {
    ret?: {
        contractRet: string;
    }[];
    signature: string[];
    txID: string;
    raw_data: {
        contract: {
            parameter: {
                value: {
                    [x: string]: any;
                };
                type_url: string;
            };
            type: string;
        }[];
        ref_block_bytes: string;
        ref_block_hash: string;
        expiration: number;
        fee_limit: number;
        timestamp: number;
    };
    raw_data_hex: string;
}
export interface ContractCallOpt {
    callValue?: number;
    feeLimit?: number;
}
export interface BlockType {
    blockID: string;
    block_header: {
        raw_data: {
            number: number;
            txTrieRoot: string;
            witness_address: string;
            parentHash: string;
            version: number;
            timestamp: number;
        };
        witness_signature: string;
    };
    transactions: TransactionType[];
}
export default class TrxWallet {
    private fullNode;
    private solidityNode;
    private tronWeb;
    private timeout;
    constructor(timeout?: number);
    setNode(fullNode: string, solidityNode: string): void;
    getSeedHexByMnemonic(mnemonic: string, pass?: string): string;
    getXprivBySeed(seedHex: string): string;
    isAddress(address: string): boolean;
    decodeContractPayload(types: string[], dataStr: string): {
        methodIdHex: string;
        params: any[];
    };
    decodeParams(types: string[], paramsStr: string): any[];
    encodeContractPayload(methodIdHex: string, types: string[], params: any[]): string;
    encodeParams(types: string[], params: any[]): string;
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
    /**
     * 构建转账TRX的交易
     * @param pkey
     * @param toAddress
     * @param amount 最小单位
     */
    buildTransferTx(pkey: string, toAddress: string, amount: string): Promise<{
        txId: string;
        txHex: string;
        txData: {
            [x: string]: any;
        };
    }>;
    getBalance(address: string): Promise<string>;
    getTokenBalance(address: string, contractAddress: string): Promise<string>;
    getUnconfirmedTokenBalance(address: string, contractAddress: string): Promise<string>;
    getUnconfirmedBalance(address: string): Promise<string>;
    buildTransferTokenTx(pkey: string, contractAddress: string, toAddress: string, amount: string, opts?: ContractCallOpt): Promise<{
        txId: any;
        txHex: any;
        txData: any;
    }>;
    getTransaction(txHash: string): Promise<TransactionType>;
    getConfirmedTransaction(txHash: string): Promise<TransactionType>;
    getConfirmedTransactionInfo(txHash: string): Promise<TransactionInfoType>;
    getUnconfirmedTransactionInfo(txHash: string): Promise<TransactionInfoType>;
    syncSendRawTx(tx: {
        [x: string]: any;
    }): Promise<TransactionInfoType>;
    sendRawTxReturnErr(tx: {
        [x: string]: any;
    }): Promise<Error>;
    getLatestBlock(): Promise<BlockType>;
    /**
     * 获取多个块 [start, end)
     * @param start 哪个块开始
     * @param end 哪个块结束
     */
    getBlocksByRange(start: number, end: number): Promise<BlockType[]>;
    getBlockByNumber(number: number): Promise<BlockType>;
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
