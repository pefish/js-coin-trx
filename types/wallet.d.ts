export default class Wallet {
    getSeedHexByMnemonic(mnemonic: string, pass?: string): string;
    getXprivBySeed(seedHex: string): string;
    deriveAllByXprivPath(xpriv: string, path: string): {
        xpriv: string;
        xpub: string;
        privateKey: string;
        publicKey: string;
        address: string;
    };
}
