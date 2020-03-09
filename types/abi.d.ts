import '@pefish/js-node-assist';
export default class ABI {
    static eventID(name: any, types: any): Buffer;
    static methodID(name: any, types: any): Buffer;
    static rawEncode(types: any, values: any): Buffer;
    static rawDecode(types: any, data: any): any[];
    static simpleEncode(method: any): Buffer;
    static simpleDecode(method: any, data: any): any[];
    static stringify(types: any, values: any): any[];
    static solidityPack(types: any, values: any): Buffer;
    static soliditySHA3(types: any, values: any): Buffer;
    static soliditySHA256(types: any, values: any): Buffer;
    static solidityRIPEMD160(types: any, values: any): Buffer;
    static fromSerpent(sig: any): any[];
    static toSerpent(types: any): string;
}
