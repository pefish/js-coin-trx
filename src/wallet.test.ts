import "@pefish/js-node-assist"
import assert from "assert"
import Wallet from './wallet'
import util from 'util'

describe('Wallet', () => {

  let helper: Wallet

  before(async () => {
    helper = new Wallet()
  })

  it('decodeContractPayload', async () => {
    try {
      const result = helper.decodeContractPayload([
        `address`,
        `uint256`,
      ], `a9059cbb00000000000000000000004131b43ffc5e49b4202f3b6e7640af9e719af71bc000000000000000000000000000000000000000000000000000000000007a1200`)
      // console.error('result', result)
      assert.strictEqual(result.methodIdHex, `0xa9059cbb`)
      assert.strictEqual(result.params[0], `4131b43ffc5e49b4202f3b6e7640af9e719af71bc0`)
      assert.strictEqual(result.params[1].toString(), `8000000`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('decodeParams', async () => {
    try {
      const result = helper.decodeParams([
        `address`,
        `uint256`,
      ], `00000000000000000000004131b43ffc5e49b4202f3b6e7640af9e719af71bc000000000000000000000000000000000000000000000000000000000007a1200`)
      // console.error('result', result)
      assert.strictEqual(result[0], `4131b43ffc5e49b4202f3b6e7640af9e719af71bc0`)
      assert.strictEqual(result[1].toString(), `8000000`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getBandwidthBalance', async () => {
    try {
      const result = await helper.getBandwidthBalance(`TRNigEZz9Vt7PUNJkD2TbgmcaMt9PXdbnC`)
      // console.error('result', result)
      assert.strictEqual(result.gt_(0), true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAccountResources', async () => {
    try {
      const result = await helper.getAccountResources(`TMg7zRkNUpjY5c7NFqQt6hWoYAHSr8Co94`)
      // console.error('result', result)
      assert.strictEqual(result.netAvail >= 0, true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('encodeContractPayload', async () => {
    try {
      const result = helper.encodeContractPayload(`a9059cbb`, [
        `address`,
        `uint256`,
      ], [
        `TEW23SjDRLibvD1cm4MBZSpk74FdmRP6o3`,
        `8000000`,
      ])
      // console.error('result', result)
      assert.strictEqual(result, `a9059cbb00000000000000000000004131b43ffc5e49b4202f3b6e7640af9e719af71bc000000000000000000000000000000000000000000000000000000000007a1200`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('encodeParams', async () => {
    try {
      const result = helper.encodeParams([
        `address`,
        `uint256`,
      ], [
        `TEW23SjDRLibvD1cm4MBZSpk74FdmRP6o3`,
        `8000000`,
      ])
      // console.error('result', result)
      assert.strictEqual(result, `00000000000000000000004131b43ffc5e49b4202f3b6e7640af9e719af71bc000000000000000000000000000000000000000000000000000000000007a1200`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
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

  it('getLatestBlock', async () => {
    try {
      const result = await helper.getLatestBlock()
      // console.error('result', util.inspect(result, false, 10))
      assert.strictEqual(result.block_header.raw_data.number > 0, true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getBlocksByRange', async () => {
    try {
      const blocks = await helper.getBlocksByRange(17825136, 17825140)
      // console.error('blocks', util.inspect(blocks, false, 10))
      for (let block of blocks) {
        assert.strictEqual(block.block_header.raw_data.number > 0, true)
      }
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getBlockByNumber', async () => {
    try {
      const block = await helper.getBlockByNumber(17825136)
      // console.error('block', util.inspect(block, false, 10))
      assert.strictEqual(block.block_header.raw_data.number, 17825136)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getTokenBalance', async () => {
    try {
      const result = await helper.getTokenBalance(`TFhnc8acrgmpvVx1LyZpPbVpwAsYRDisBv`, `TCfVo9rhFqngrCbqcMy2U7uEeFXcd5EyXP`)
      console.error('result', result)
      // assert.strictEqual(result.gt_(0), true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getUnconfirmedTokenBalance', async () => {
    try {
      const result = await helper.getUnconfirmedTokenBalance(`TFhnc8acrgmpvVx1LyZpPbVpwAsYRDisBv`, `TCfVo9rhFqngrCbqcMy2U7uEeFXcd5EyXP`)
      console.error('result', result)
      // assert.strictEqual(result.gt_(0), true)
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
      // console.error('result', util.inspect(result, false, 10))
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
      const result = await helper.getConfirmedTransactionInfo(`354eb2d84c05a0951bed402ca1251384f2e0c67f3b41a26cfc1c4761f1032808`)
      console.error('result', util.inspect(result, false, 10))
      assert.strictEqual(result.id, `354eb2d84c05a0951bed402ca1251384f2e0c67f3b41a26cfc1c4761f1032808`)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getUnconfirmedTransactionInfo', async () => {
    try {
      const result = await helper.getTransactionInfo(`354eb2d84c05a0951bed402ca1251384f2e0c67f3b41a26cfc1c4761f1032808`)
      // console.error('result', util.inspect(result, false, 10))
      assert.strictEqual(result.id, `354eb2d84c05a0951bed402ca1251384f2e0c67f3b41a26cfc1c4761f1032808`)
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
        `TCfVo9rhFqngrCbqcMy2U7uEeFXcd5EyXP`,
        `transfer(address,uint256)`,
        [{
          type: `address`,
          value: `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`,
        }, {
          type: `uint256`,
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

  it('buildTransferTokenTx', async () => {
    try {
      const result = await helper.buildTransferTokenTx(
        `4f37545d72b4da2dcec24942ff281b9e140041df45df62b3fcc55cac760e2ead`,
        `TCfVo9rhFqngrCbqcMy2U7uEeFXcd5EyXP`,
        `TNxg4zPNzQRnVt6JFHRwc6Wf1LepSkhB3H`,
        `1000000000`,
        )
      console.error('result', util.inspect(result, false, 10))
      assert.strictEqual( !!result.txId, true)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })
})

