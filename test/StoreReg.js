/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')
const Q = require('q')
const AliasRegTestPromise = require('./AliasReg')
const deferred = Q.defer()
module.exports = deferred.promise

before(() => {
  return chaithereum.promise
})

describe('StoreReg', () => {

  let storeReg
  let aliasReg
  let store

  AliasRegTestPromise.then((results) => {
    aliasReg = results.aliasReg
  })

  after(() => {
    deferred.resolve({ storeReg, store })
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.StoreReg.abi).new.q(
      aliasReg.address,
      { data: contracts.StoreReg.bytecode }
    ).should.eventually.be.contract.then((_storeReg) => {
      storeReg = _storeReg
    }).should.be.fulfilled
  })

  it('should have correct aliasRegAddr', () => {
    return storeReg.aliasRegAddr.q().should.eventually.equal(aliasReg.address)
  })

  it('should create a store', () => {

    const pseudoStore = chaithereum.web3.eth.contract(contracts.Store.abi).at(0)
    const calldatas = [ 
      pseudoStore.setCurrency.getData(params.currency1),
      pseudoStore.setBufferCentiperun.getData(params.bufferCentiperun1),
      pseudoStore.setDisputeSeconds.getData(params.disputeSeconds1),
      pseudoStore.setMinProductsTeratotal.getData(params.minProductsTeratotal1),
      pseudoStore.setAffiliateFeeCentiperun.getData(params.affiliateFeeCentiperun1),
      pseudoStore.setFileHash.getData(params.fileHash0),
      pseudoStore.setAlias.getData(params.alias1),
      pseudoStore.addProduct.getData(true, params.teraprice1, params.units1, params.fileHash1),
      pseudoStore.addProduct.getData(false, params.teraprice2, params.units2, params.fileHash2),
      pseudoStore.addTransport.getData(true, params.teraprice3, params.fileHash3),
      pseudoStore.addTransport.getData(false, params.teraprice4, params.fileHash4),
      pseudoStore.approveAlias.getData(params.alias1),
      pseudoStore.approveAlias.getData(params.alias2),
    ].map((calldata) => {
      return calldata.replace('0x', '')
    })
    const lengths = calldatas.map((calldata) => { return Math.ceil(calldata.length / 2) })

    return storeReg.create.q(lengths, `0x${calldatas.join('')}`).should.be.fulfilled
  })

  it('should have triggered Registration event', () => {
    return storeReg.Registration({}, { fromBlock: 'latest', toBlock: 'latest' })
    .q().should.eventually.have.length(1)
  })

  it('should have updated the store counts correctly', () => {
    return chaithereum.web3.Q.all([
      storeReg.getStoresLength.q().should.eventually.be.bignumber.equal(1),
      storeReg.getCreatedStoresLength.q(chaithereum.account).should.eventually.be.bignumber.equal(1),
    ]).should.eventually.be.fulfilled
  })

  it('should get the store address', () => {
    return chaithereum.web3.Q.all([
      storeReg.getStoreAddr.q().should.eventually.be.address,
      storeReg.getCreatedStoreAddr.q(chaithereum.account, 0).should.eventually.be.address,
    ]).should.eventually.be.fulfilled
  })

  it('should make the store address a contract', () => {
    return storeReg.getCreatedStoreAddr.q(chaithereum.account, 0).then((_storeAddr) => {
      store = chaithereum.web3.eth.contract(contracts.Store.abi).at(_storeAddr)
    })
  })

  it('should make the store owner the msg sender', () => {
    return store.getOwner.q().should.eventually.be.address.equal(chaithereum.account)
  })

  it('should make the store as registered', () => {
    return storeReg.isRegistered.q(store.address).should.eventually.be.true
  })

  describe('store', () => {

    it('should have correct products length', () => {
      return store.getProductsLength.q().should.eventually.be.bignumber.equal(2)
    })

    it('should have correct products', () => {
      return chaithereum.web3.Q.all([
        store.getProductsLength.q().should.eventually.be.bignumber.equal(2),
        store.getProductIsActive.q(0).should.eventually.be.true,
        store.getProductTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice1),
        store.getProductUnits.q(0).should.eventually.be.bignumber.equal(params.units1),
        store.getProductFileHash.q(0).should.eventually.be.ascii(params.fileHash1),
        store.getProductIsActive.q(1).should.eventually.be.false,
        store.getProductTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice2),
        store.getProductUnits.q(1).should.eventually.be.bignumber.equal(params.units2),
        store.getProductFileHash.q(1).should.eventually.be.ascii(params.fileHash2),
        store.getProductIsActive.q(2).should.eventually.be.rejected
      ]).should.eventually.be.fulfilled
    })

    it('should have correct transports', () => {
      return chaithereum.web3.Q.all([
        store.getTransportsLength.q().should.eventually.be.bignumber.equal(2),
        store.getTransportIsActive.q(0).should.eventually.be.true,
        store.getTransportTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice3),
        store.getTransportFileHash.q(0).should.eventually.be.ascii(params.fileHash3),
        store.getTransportIsActive.q(1).should.eventually.be.false,
        store.getTransportTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice4),
        store.getTransportFileHash.q(1).should.eventually.be.ascii(params.fileHash4),
        store.getTransportIsActive.q(2).should.eventually.be.rejected
      ]).should.eventually.be.fulfilled
    })

    it('should have correct approved aliases', () => {
      return chaithereum.web3.Q.all([
        store.getApprovedAliasesLength.q().should.eventually.be.bignumber.equal(2),
        store.getApprovedAlias.q(0).should.eventually.be.ascii(params.alias1),
        store.getApprovedAlias.q(1).should.eventually.be.ascii(params.alias2)
      ]).should.eventually.be.fulfilled
    })

    it('should be able to add a product', () => {
      return store.addProduct.q(true, params.teraprice5, params.units3, params.fileHash5).should.eventually.be.fulfilled
    })

    it('should have added the product correctly', () => {
      return chaithereum.web3.Q.all([
        store.getProductsLength.q().should.eventually.be.bignumber.equal(3),
        store.getProductIsActive.q(2).should.eventually.be.true,
        store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice5),
        store.getProductUnits.q(2).should.eventually.be.bignumber.equal(params.units3),
        store.getProductFileHash.q(2).should.eventually.be.ascii(params.fileHash5)
      ]).should.eventually.be.fulfilled
    })

    it('should be able to add a transport', () => {
      return store.addTransport.q(true, params.teraprice6, params.fileHash6).should.eventually.be.fulfilled
    })

    it('should have added the transport correctly', () => {
      return chaithereum.web3.Q.all([
        store.getTransportsLength.q().should.eventually.be.bignumber.equal(3),
        store.getTransportIsActive.q(2).should.eventually.be.true,
        store.getTransportTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice6),
        store.getTransportFileHash.q(2).should.eventually.be.ascii(params.fileHash6)
      ]).should.eventually.be.fulfilled
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

    it('should set the product fileHash', () => {
      return store.setProductFileHash.q(2, params.fileHash7).should.eventually.be.fulfilled
    })

    it('should have updated the product correctly', () => {
      return chaithereum.web3.Q.all([
        store.getProductsLength.q().should.eventually.be.bignumber.equal(3),
        store.getProductIsActive.q(2).should.eventually.be.false,
        store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice7),
        store.getProductUnits.q(2).should.eventually.be.bignumber.equal(params.units5),
        store.getProductFileHash.q(2).should.eventually.be.ascii(params.fileHash7)
      ]).should.eventually.be.fulfilled
    })

    it('should set the transport active state', () => {
      return store.setTransportIsActive.q(2, false).should.eventually.be.fulfilled
    })

    it('should set the transport teraprice', () => {
      return store.setTransportTeraprice.q(2, params.teraprice8).should.eventually.be.fulfilled
    })

    it('set the transport fileHash', () => {
      return store.setTransportFileHash.q(2, params.fileHash8).should.eventually.be.fulfilled
    })

    it('should have updated the transport correctly', () => {
      return chaithereum.web3.Q.all([
        store.getTransportsLength.q().should.eventually.be.bignumber.equal(3),
        store.getTransportIsActive.q(2).should.eventually.be.false,
        store.getTransportTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice8),
        store.getTransportFileHash.q(2).should.eventually.be.ascii(params.fileHash8)
      ]).should.eventually.be.fulfilled
    })

    // it('should restore product units', () => {
    //   return store.restoreProductUnits.q(2, params.units6).should.eventually.be.fulfilled
    // })

    // it('should deplete product units', () => {
    //   return store.depleteProductUnits.q(2, params.units1).should.eventually.be.fulfilled
    // })

    // it('should have updated the product correctly', () => {
    //   let currentProductUnits = params.units5+params.units6-params.units1;

    //   return chaithereum.web3.Q.all([
    //     store.getProductsLength.q().should.eventually.be.bignumber.equal(3),
    //     store.getProductIsActive.q(2).should.eventually.be.false,
    //     store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice7),
    //     store.getProductUnits.q(2).should.eventually.be.bignumber.equal(currentProductUnits),
    //     store.getProductFileHash.q(2).should.eventually.be.ascii(params.fileHash7)
    //   ]).should.eventually.be.fulfilled
    // })

  })

})
