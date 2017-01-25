const contracts = require('../modules/contracts')
const chaithereum = require('./chaithereum')
const params = require('./testparams.js')
const Q = require('q')
const multiproxPromise = require('./Multiprox')
const parseTransactionReceipt = require('../modules/parseTransactionReceipt')

const deferred = Q.defer()

let multiprox
multiproxPromise.then((_multiprox) => {
  multiprox = _multiprox
})

module.exports = deferred.promise

describe('Store', () => {

  let store

  after(() => {
    deferred.resolve(store)
  })

  it('successfully create via multiprox', () => {
    const pseudoStore = chaithereum.web3.eth.contract(contracts.Store.abi).at(0)
    const calldatas = [
      pseudoStore.set_isOwner.getData(chaithereum.account, true),
      pseudoStore.set_currency.getData(params.currency1),
      pseudoStore.set_bufferPicoperun.getData(params.bufferPicoperun1),
      pseudoStore.set_disputeSeconds.getData(params.disputeSeconds1),
      pseudoStore.set_minProductsTeratotal.getData(params.minProductsTeratotal1),
      pseudoStore.set_affiliateFeePicoperun.getData(params.affiliateFeePicoperun1),
      pseudoStore.set_metaMultihash.getData(params.fileHash0),
      pseudoStore.add_Product.getData(true, params.teraprice1, params.units1),
      pseudoStore.add_Product.getData(false, params.teraprice2, params.units2),
      pseudoStore.add_Transport.getData(true, params.teraprice3),
      pseudoStore.add_Transport.getData(false, params.teraprice4)
    ].map((calldata) => {
      return calldata.replace('0x', '')
    })
    const calldatasConcated = `0x${calldatas.join('')}`
    const lengths = calldatas.map((calldata) => { return Math.ceil(calldata.length / 2) })

    return multiprox.createAndExecute.estimateGas.q(
      contracts.Store.codeHash, lengths, calldatasConcated, { gas: chaithereum.gasLimit }
    ).then((gas) => {
      console.log('==================')
      console.log('Store Gas', gas)
      console.log('==================')
      return multiprox.createAndExecute.q(
        contracts.Store.codeHash, lengths, calldatasConcated, { gas: chaithereum.gasLimit }
      ).then((transactionHash) => {
        return chaithereum.web3.eth.getTransactionReceipt.q(
          transactionHash
        ).then((transactionReceipt) => {
          const addr = parseTransactionReceipt(transactionReceipt).addr
          store = chaithereum.web3.eth.contract(contracts.Store.abi).at(addr)
        })
      })
    })

  })

  it('should have right bytecode', () => {
    return chaithereum.web3.eth.getCode.q(store.address).should.eventually.equal(
      contracts.Store.runtimeBytecode
    )
  })

  it('should have chaithereum.account as owner', () => {
    return store.get_isOwner.q(chaithereum.account).should.eventually.equal(true)
  })

  it('should have correct currency', () => {
    return store.currency.q().should.eventually.be.ascii(params.currency1)
  })

  it('should have correct metaMultihash', () => {
    return store.metaMultihash.q().should.eventually.be.ascii(params.fileHash0)
  })

  it('should have correct products length', () => {
    return store.get_Product_array_length.q().should.eventually.be.bignumber.equal(2)
  })

  it('should have correct products', () => {
    return chaithereum.web3.Q.all([
      store.get_Product_array_length.q().should.eventually.be.bignumber.equal(2),
      store.get_Product_isArchived.q(0).should.eventually.be.true,
      store.get_Product_teraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice1),
      store.get_Product_units.q(0).should.eventually.be.bignumber.equal(params.units1),
      store.get_Product_isArchived.q(1).should.eventually.be.false,
      store.get_Product_teraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice2),
      store.get_Product_units.q(1).should.eventually.be.bignumber.equal(params.units2),
      store.get_Product_isArchived.q(2).should.eventually.be.rejectedWith(Error)
    ])
  })

  it('should have correct transports', () => {
    return chaithereum.web3.Q.all([
      store.get_Transport_array_length.q().should.eventually.be.bignumber.equal(2),
      store.get_Transport_isArchived.q(0).should.eventually.be.true,
      store.get_Transport_teraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice3),
      store.get_Transport_isArchived.q(1).should.eventually.be.false,
      store.get_Transport_teraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice4),
      store.get_Transport_isArchived.q(2).should.eventually.be.rejectedWith(Error)
    ])
  })

  it('should be able to add a product', () => {
    return store.add_Product.q(
      true, params.teraprice5, params.units3, { gas: chaithereum.gasLimit }
    ).should.eventually.be.fulfilled
  })

  it('should have added the product correctly', () => {
    return chaithereum.web3.Q.all([
      store.get_Product_array_length.q().should.eventually.be.bignumber.equal(3),
      store.get_Product_isArchived.q(2).should.eventually.be.true,
      store.get_Product_teraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice5),
      store.get_Product_units.q(2).should.eventually.be.bignumber.equal(params.units3)
    ])
  })

  it('should be able to add a transport', () => {
    return store.add_Transport.q(
      true, params.teraprice6, { gas: chaithereum.gasLimit }
    ).should.eventually.be.fulfilled
  })

  it('should have added the transport correctly', () => {
    return chaithereum.web3.Q.all([
      store.get_Transport_array_length.q().should.eventually.be.bignumber.equal(3),
      store.get_Transport_isArchived.q(2).should.eventually.be.true,
      store.get_Transport_teraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice6)
    ])
  })

  it('should set the product active state', () => {
    return store.set_Product_isArchived.q(2, false).should.eventually.be.fulfilled
  })

  it('should set the product teraprice', () => {
    return store.set_Product_teraprice.q(2, params.teraprice7).should.eventually.be.fulfilled
  })

  it('should set the product units', () => {
    return store.set_Product_units.q(2, params.units5).should.eventually.be.fulfilled
  })

  it('should have updated the product correctly', () => {
    return chaithereum.web3.Q.all([
      store.get_Product_array_length.q().should.eventually.be.bignumber.equal(3),
      store.get_Product_isArchived.q(2).should.eventually.be.false,
      store.get_Product_teraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice7),
      store.get_Product_units.q(2).should.eventually.be.bignumber.equal(params.units5)
    ])
  })

  it('should set the transport active state', () => {
    return store.set_Transport_isArchived.q(2, false).should.eventually.be.fulfilled
  })

  it('should set the transport teraprice', () => {
    return store.set_Transport_teraprice.q(2, params.teraprice8).should.eventually.be.fulfilled
  })

  it('should have updated the transport correctly', () => {
    return chaithereum.web3.Q.all([
      store.get_Transport_array_length.q().should.eventually.be.bignumber.equal(3),
      store.get_Transport_isArchived.q(2).should.eventually.be.false,
      store.get_Transport_teraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice8)
    ])
  })

})
