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
      pseudoStore.setOwner.getData(chaithereum.account, true),
      pseudoStore.setCurrency.getData(params.currency1),
      pseudoStore.setBufferCentiperun.getData(params.bufferCentiperun1),
      pseudoStore.setDisputeSeconds.getData(params.disputeSeconds1),
      pseudoStore.setMinProductsTeratotal.getData(params.minProductsTeratotal1),
      pseudoStore.setAffiliateFeeCentiperun.getData(params.affiliateFeeCentiperun1),
      pseudoStore.setMetaMultihash.getData(params.fileHash0),
      pseudoStore.addProduct.getData(true, params.teraprice1, params.units1),
      pseudoStore.addProduct.getData(false, params.teraprice2, params.units2),
      pseudoStore.addTransport.getData(true, params.teraprice3),
      pseudoStore.addTransport.getData(false, params.teraprice4)
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
    return store.hasOwner.q(chaithereum.account).should.eventually.equal(true)
  })

  it('should have correct currency', () => {
    return store.currency.q().should.eventually.be.ascii(params.currency1)
  })

  it('should have correct metaMultihash', () => {
    return store.metaMultihash.q().should.eventually.be.ascii(params.fileHash0)
  })

  it('should have correct products length', () => {
    return store.getProductsLength.q().should.eventually.be.bignumber.equal(2)
  })

  it('should have correct products', () => {
    return chaithereum.web3.Q.all([
      store.getProductsLength.q().should.eventually.be.bignumber.equal(2),
      store.getProductIsActive.q(0).should.eventually.be.true,
      store.getProductTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice1),
      store.getProductUnits.q(0).should.eventually.be.bignumber.equal(params.units1),
      store.getProductIsActive.q(1).should.eventually.be.false,
      store.getProductTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice2),
      store.getProductUnits.q(1).should.eventually.be.bignumber.equal(params.units2),
      store.getProductIsActive.q(2).should.eventually.be.rejected
    ])
  })

  it('should have correct transports', () => {
    return chaithereum.web3.Q.all([
      store.getTransportsLength.q().should.eventually.be.bignumber.equal(2),
      store.getTransportIsActive.q(0).should.eventually.be.true,
      store.getTransportTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice3),
      store.getTransportIsActive.q(1).should.eventually.be.false,
      store.getTransportTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice4),
      store.getTransportIsActive.q(2).should.eventually.be.rejected
    ])
  })

  it('should be able to add a product', () => {
    return store.addProduct.q(
      true, params.teraprice5, params.units3, { gas: chaithereum.gasLimit }
    ).should.eventually.be.fulfilled
  })

  it('should have added the product correctly', () => {
    return chaithereum.web3.Q.all([
      store.getProductsLength.q().should.eventually.be.bignumber.equal(3),
      store.getProductIsActive.q(2).should.eventually.be.true,
      store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice5),
      store.getProductUnits.q(2).should.eventually.be.bignumber.equal(params.units3)
    ])
  })

  it('should be able to add a transport', () => {
    return store.addTransport.q(
      true, params.teraprice6, { gas: chaithereum.gasLimit }
    ).should.eventually.be.fulfilled
  })

  it('should have added the transport correctly', () => {
    return chaithereum.web3.Q.all([
      store.getTransportsLength.q().should.eventually.be.bignumber.equal(3),
      store.getTransportIsActive.q(2).should.eventually.be.true,
      store.getTransportTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice6)
    ])
  })

  it('should set the product active state', () => {
    return store.setProductIsActive.q(2, false).should.eventually.be.fulfilled
  })

  it('should set the product teraprice', () => {
    return store.setProductTeraprice.q(2, params.teraprice7).should.eventually.be.fulfilled
  })

  it('should set the product units', () => {
    return store.setProductUnits.q(2, params.units5).should.eventually.be.fulfilled
  })

  it('should have updated the product correctly', () => {
    return chaithereum.web3.Q.all([
      store.getProductsLength.q().should.eventually.be.bignumber.equal(3),
      store.getProductIsActive.q(2).should.eventually.be.false,
      store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice7),
      store.getProductUnits.q(2).should.eventually.be.bignumber.equal(params.units5)
    ])
  })

  it('should set the transport active state', () => {
    return store.setTransportIsActive.q(2, false).should.eventually.be.fulfilled
  })

  it('should set the transport teraprice', () => {
    return store.setTransportTeraprice.q(2, params.teraprice8).should.eventually.be.fulfilled
  })

  it('should have updated the transport correctly', () => {
    return chaithereum.web3.Q.all([
      store.getTransportsLength.q().should.eventually.be.bignumber.equal(3),
      store.getTransportIsActive.q(2).should.eventually.be.false,
      store.getTransportTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice8)
    ])
  })

})
