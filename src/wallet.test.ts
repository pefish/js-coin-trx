import "@pefish/js-node-assist"
import assert from "assert"
import Wallet from './wallet'

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

  it('deriveAllByXprivPath', async () => {
    try {
      const result = await helper.deriveAllByXprivPath(`xprv9s21ZrQH143K3iq8soZGLcmK7BdFe8SjXTMTsbU7QkApdiQ1BZRaJFXZTFysz7puWxDPfddorDqedF24F5dSkDaVoiUFvdpMF6MzbcFFMhp`, `m/44'/195'/0'/0/1`)
      // console.error('result', result)
      assert.strictEqual(result.address, `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`)
      assert.strictEqual(result.privateKey, `3e62cc7c5a7cc4fd555cb4831e48a594aec8d33586a326845cec68a3c08d4b05`)
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

  it('buildTransferTx', async () => {
    try {
      const result = await helper.buildTransferTx(
        `4f37545d72b4da2dcec24942ff281b9e140041df45df62b3fcc55cac760e2ead`,
        `TMkySan3Duinty1fRDSRw3KzW6ciq4DNFT`,
        `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`,
        `1000000`
        )
      // console.error('result', JSON.stringify(result))
      assert.strictEqual(!!result.txId, true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildContractCallTx', async () => {
    try {
      const result = await helper.buildContractCallTx(
        `4f37545d72b4da2dcec24942ff281b9e140041df45df62b3fcc55cac760e2ead`,
        `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`,
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

