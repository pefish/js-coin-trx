import "@pefish/js-node-assist"
import assert from "assert"
import Wallet from './wallet'
import util from 'util'

describe('Wallet', () => {

  let helper: Wallet

  before(async () => {
    helper = new Wallet()
  })

  it('getSeedHexByMnemonic', async () => {
    try {
      const result = await helper.getSeedHexByMnemonic(`hjuygdjutyshjdeushx`)
      // console.error('result', result)
      assert.strictEqual(result, `dbdb21e2cfc2038a9aad1472781da308afdcc09e7d58bb848fb0d3fad74980c5682da2b63e729cc16377395202a1d98d340cf2d96ca6bcaa8b81679630ef653f`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('hexToUtf8', async () => {
    try {
      const result = helper.hexToUtf8(`4e6f7420656e6f75676820656e6572677920666f722027505553483127206f7065726174696f6e20657865637574696e673a20637572496e766f6b65456e657267794c696d69745b305d2c206375724f70456e657267795b335d2c2075736564456e657267795b305d`)
      // console.error('result', result)
      assert.strictEqual(result.startsWith(`Not enough`), true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getXprivBySeed', async () => {
    try {
      const result = await helper.getXprivBySeed(`dbdb21e2cfc2038a9aad1472781da308afdcc09e7d58bb848fb0d3fad74980c5682da2b63e729cc16377395202a1d98d340cf2d96ca6bcaa8b81679630ef653f`)
      // console.error('result', result)
      assert.strictEqual(result, `xprv9s21ZrQH143K3iq8soZGLcmK7BdFe8SjXTMTsbU7QkApdiQ1BZRaJFXZTFysz7puWxDPfddorDqedF24F5dSkDaVoiUFvdpMF6MzbcFFMhp`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getBalance', async () => {
    try {
      const result = await helper.getBalance(`TRNigEZz9Vt7PUNJkD2TbgmcaMt9PXdbnC`)
      // console.error('result', result)
      assert.strictEqual(result.gt_(0), true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getUnconfirmedBalance', async () => {
    try {
      const result = await helper.getUnconfirmedBalance(`TRNigEZz9Vt7PUNJkD2TbgmcaMt9PXdbnC`)
      // console.error('result', result)
      assert.strictEqual(result.gt_(0), true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('deriveAllByXprivPath', async () => {
    try {
      const result = await helper.deriveAllByXprivPath(`xprv9s21ZrQH143K3iq8soZGLcmK7BdFe8SjXTMTsbU7QkApdiQ1BZRaJFXZTFysz7puWxDPfddorDqedF24F5dSkDaVoiUFvdpMF6MzbcFFMhp`, `m/44'/195'/0'/0/1234`)
      // console.error('result', result)
      assert.strictEqual(result.address, `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`)
      assert.strictEqual(result.privateKey, `3e62cc7c5a7cc4fd555cb4831e48a594aec8d33586a326845cec68a3c08d4b05`)
      assert.strictEqual(result.publicKey, `04a28b4f721f0e040c1c7a8d08f1c0bf41491c2179193076b9f400bed5e2225cde0fe1ccf531273a7041c921c3ab36af3dcf3333b786fa262d27bc006671cbfb75`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAllFromPkey', async () => {
    try {
      const result = await helper.getAllFromPkey(`3e62cc7c5a7cc4fd555cb4831e48a594aec8d33586a326845cec68a3c08d4b05`)
      // console.error('result', result)
      assert.strictEqual(result.address, `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`)
      assert.strictEqual(result.publicKey, `04a28b4f721f0e040c1c7a8d08f1c0bf41491c2179193076b9f400bed5e2225cde0fe1ccf531273a7041c921c3ab36af3dcf3333b786fa262d27bc006671cbfb75`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('isAddress', async () => {
    try {
      const result = await helper.isAddress(`TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`)
      // console.error('result', result)
      assert.strictEqual(result, true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('hexToAddress', async () => {
    try {
      const result = await helper.hexToAddress(`41e3cf5eefe3a2abf35a344ae8a3b2f4bb29810cbd`)
      // console.error('result', result)
      assert.strictEqual(result, `TWjkoz18Y48SgWoxEeGG11ezCCzee8wo1A`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('addressToHex', async () => {
    try {
      const result = await helper.addressToHex(`TWjkoz18Y48SgWoxEeGG11ezCCzee8wo1A`)
      // console.error('result', result)
      assert.strictEqual(result, `41e3cf5eefe3a2abf35a344ae8a3b2f4bb29810cbd`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getTransaction', async () => {
    try {
      const result = await helper.getTransaction(`37eb3c9fa0b9810cddc4e504fbe1d71c139d5b3ce4d402c884dc9b265538c2f2`)
      // console.error('result', result)
      assert.strictEqual(result.txID, `37eb3c9fa0b9810cddc4e504fbe1d71c139d5b3ce4d402c884dc9b265538c2f2`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getConfirmedTransaction', async () => {
    try {
      const result = await helper.getConfirmedTransaction(`12579a84905020674a2ef661bd77230a6133f68eb27e0dc96209c4234d895a35`)
      // console.error('result', util.inspect(result, false, 10))
      assert.strictEqual(result, null)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getConfirmedTransactionInfo', async () => {
    try {
      const result = await helper.getConfirmedTransactionInfo(`37eb3c9fa0b9810cddc4e504fbe1d71c139d5b3ce4d402c884dc9b265538c2f2`)
      // console.error('result', util.inspect(result, false, 10))
      assert.strictEqual(result.id, `37eb3c9fa0b9810cddc4e504fbe1d71c139d5b3ce4d402c884dc9b265538c2f2`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  // it('buildTransferTx', async () => {
  //   try {
  //     const result = await helper.buildTransferTx(
  //       `4f37545d72b4da2dcec24942ff281b9e140041df45df62b3fcc55cac760e2ead`,
  //       `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`,
  //       `1000000`
  //       )
  //     // console.error('result', JSON.stringify(result))
  //     assert.strictEqual(!!result.txId, true)
  //   } catch (err) {
  //     console.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })

  it('buildContractCallTx', async () => {
    try {
      const result = await helper.buildContractCallTx(
        `4f37545d72b4da2dcec24942ff281b9e140041df45df62b3fcc55cac760e2ead`,
        `TMkySan3Duinty1fRDSRw3KzW6ciq4DNFT`,
        `transfer(address,uint256)`,
        [{
          type: `address`,
          value: `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`,
        }, {
          type: `uint64`,
          value: `100000`
        }],
        )
      // console.error('result', JSON.stringify(result))
      assert.strictEqual(!!result.txId, true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })
})

