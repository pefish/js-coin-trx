import TronWeb from 'tronweb';
export interface AbiElementType {
    constant: boolean;
    inputs: {
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        name: string;
        type: string;
    }[];
    payable: boolean;
    stateMutability: string;
    type: string;
}
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
    setNode(node: string): void;
    setTronWebInstance(tronWebInstance: TronWeb): void;
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
     * @param pkey 设置为空字符串，则是使用插件钱包签名，这时from必须指定
     * @param from 设置为空字符串的话，pkey必须指定，且from使用pkey对应的address
     * @param toAddress
     * @param amount 最小单位
     */
    buildTransferTx(pkey: string, from: string, toAddress: string, amount: string): Promise<{
        txId: string;
        txHex: string;
        txData: {
            [x: string]: any;
        };
    }>;
    getBalance(address: string): Promise<string>;
    getTokenBalance(address: string, contractAddress: string): Promise<string>;
    getUnconfirmedTokenBalance(address: string, contractAddress: string): Promise<string>;
    callContractViewMethod(abi: AbiElementType[], contractAddress: string, methodName: string, params: any[], from: string, opts?: ContractCallOpt): Promise<any[]>;
    getUnconfirmedBalance(address: string): Promise<string>;
    /**
     * 构建转账token的交易
     * @param pkey 设置为空字符串，则是使用插件钱包签名，这时from必须指定
     * @param contractAddress
     * @param toAddress
     * @param amount
     * @param from 设置为空字符串的话，pkey必须指定，且from使用pkey对应的address
     * @param opts
     */
    buildTransferTokenTx(pkey: string, contractAddress: string, toAddress: string, amount: string, from: string, opts?: ContractCallOpt): Promise<{
        txId: any;
        txHex: any;
        txData: any;
    }>;
    getTransaction(txHash: string): Promise<TransactionType>;
    getConfirmedTransaction(txHash: string): Promise<TransactionType>;
    getConfirmedTransactionInfo(txHash: string): Promise<TransactionInfoType>;
    getTransactionInfo(txHash: string): Promise<TransactionInfoType>;
    getBandwidthBalance(address: string): Promise<string>;
    getAccountResources(address: string): Promise<{
        freeNetUsed: number;
        freeNetLimit: number;
        netUsed: number;
        netLimit: number;
        energyUsed: number;
        energyLimit: number;
        netAvail: number;
        energyAvail: number;
    }>;
    buildModifyAddressPermissionTx(ownerPk: string, activeThreshold: number, activeKeys: {
        address: string;
        weight: number;
    }[], ownerThreshold?: number, ownerKeys?: {
        address: string;
        weight: number;
    }[]): Promise<{
        txId: any;
        txHex: any;
        txData: any;
    }>;
    syncSendRawTx(tx: {
        [x: string]: any;
    }): Promise<TransactionInfoType>;
    waitConfirm(txHash: string, printLog?: boolean): Promise<TransactionInfoType>;
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
    /**
     * 构建调用合约的交易
     * @param pkey 设置为空字符串，则是使用插件钱包签名，这时from必须指定
     * @param contractAddress
     * @param methodFullName
     * @param params
     * @param from 设置为空字符串的话，pkey必须指定，且from使用pkey对应的address
     * @param opts
     */
    buildCallContractTx(pkey: string, contractAddress: string, methodFullName: string, params: any[], from: string, opts?: ContractCallOpt): Promise<{
        txId: any;
        txHex: any;
        txData: any;
    }>;
    hexToUtf8(hex: string): string;
    utf8ToHex(utf8: string): string;
    hexToAddress(hex: string): string;
    addressToHex(address: string): string;
    toEtherAddress(address: string): string;
    fromEtherAddress(etherAddress: string): string;
}
