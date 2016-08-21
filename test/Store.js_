/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})

function createStore (args) {
  it('successfully instantiates with blank params', () => {
    return chaithereum.web3.eth.contract(contracts.Store.abi).new.q([], [], [], { data: contracts.Store.bytecode }).should.eventually.be.contract.then((_store) => {
      args.address = _store.address
      args.contract = _store
    }).should.eventually.be.fulfilled
  })

  it('successfully instantiates with non-blank params', () => {
    return chaithereum.web3.eth.contract(contracts.Store.abi).new.q(
      [true, params.teraprice1, params.units1, params.fileHash1, false, params.teraprice2, params.units2, params.fileHash2].map(toBytes32),
      [true, params.teraprice3, params.fileHash3, false, params.teraprice4, params.fileHash4].map(toBytes32),
      [params.alias1, params.alias2],
      {data: contracts.Store.bytecode}
    ).should.eventually.be.contract.then((_store) => {
      args.address = _store.address
      args.contract = _store
    }).should.eventually.be.fulfilled
  })
}

function runStoreTests (args) {
  let store

  it('gets the store from the arguments', () => {
    store = args.contract
  })

  it('should have correct products length', () => {
    return store.getProductCount.q().should.eventually.be.bignumber.equal(2)
  })

  it('should have correct products', () => {
    return chaithereum.web3.Q.all([
      store.getProductCount.q().should.eventually.be.bignumber.equal(2),
      store.getProductIsActive.q(0).should.eventually.be.true,
      store.getProductTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice1),
      store.getProductUnits.q(0).should.eventually.be.bignumber.equal(params.units1),
      store.getProductFileHash.q(0).should.eventually.be.ascii(params.fileHash1),
      store.getProductIsActive.q(1).should.eventually.be.false,
      store.getProductTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice2),
      store.getProductUnits.q(1).should.eventually.be.bignumber.equal(params.units2),
      store.getProductFileHash.q(1).should.eventually.be.ascii(params.fileHash2),
      store.getProductIsActive.q(2).should.eventually.be.rejected
    ])
  })

  it('should have correct transports', () => {
    return chaithereum.web3.Q.all([
      store.getTransportCount.q().should.eventually.be.bignumber.equal(2),
      store.getTransportIsActive.q(0).should.eventually.be.true,
      store.getTransportTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice3),
      store.getTransportFileHash.q(0).should.eventually.be.ascii(params.fileHash3),
      store.getTransportIsActive.q(1).should.eventually.be.false,
      store.getTransportTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice4),
      store.getTransportFileHash.q(1).should.eventually.be.ascii(params.fileHash4),
      store.getProductIsActive.q(2).should.eventually.be.rejected
    ])
  })

  it('should have correct approved aliases', () => {
    return chaithereum.web3.Q.all([
      store.getApprovedAliasCount.q().should.eventually.be.bignumber.equal(2),
      store.getApprovedAlias.q(0).should.eventually.be.ascii(params.alias1),
      store.getApprovedAlias.q(1).should.eventually.be.ascii(params.alias2)
    ])
  })

  it('should be able to add a product', () => {
    return store.addProduct.q(...[params.teraprice5, params.units3, params.fileHash5].map(toBytes32)).should.eventually.be.fulfilled
  })

  it('should have added the product correctly', () => {
    return chaithereum.web3.Q.all([
      store.getProductCount.q().should.eventually.be.bignumber.equal(3),
      store.getProductIsActive.q(2).should.eventually.be.true,
      store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice5),
      store.getProductUnits.q(2).should.eventually.be.bignumber.equal(params.units3),
      store.getProductFileHash.q(2).should.eventually.be.ascii(params.fileHash5)
    ])
  })

  it('should be able to add a transport', () => {
    return store.addTransport.q(...[params.teraprice6, params.fileHash6].map(toBytes32)).should.eventually.be.fulfilled
  })

  it('should have added the transport correctly', () => {
    return chaithereum.web3.Q.all([
      store.getTransportCount.q().should.eventually.be.bignumber.equal(3),
      store.getTransportIsActive.q(2).should.eventually.be.true,
      store.getTransportTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice6),
      store.getTransportFileHash.q(2).should.eventually.be.ascii(params.fileHash6)
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

  it('should set the product fileHash', () => {
    return store.setProductFileHash.q(2, params.fileHash7)
  })

  it('should have updated the product correctly', () => {
    return chaithereum.web3.Q.all([
      store.getProductCount.q().should.eventually.be.bignumber.equal(3),
      store.getProductIsActive.q(2).should.eventually.be.false,
      store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice7),
      store.getProductUnits.q(2).should.eventually.be.bignumber.equal(params.units5),
      store.getProductFileHash.q(2).should.eventually.be.ascii(params.fileHash7)
    ])
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
      store.getTransportCount.q().should.eventually.be.bignumber.equal(3),
      store.getTransportIsActive.q(2).should.eventually.be.false,
      store.getTransportTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice8),
      store.getTransportFileHash.q(2).should.eventually.be.ascii(params.fileHash8)
    ])
  })

  it('should restore product units', () => {
    return store.restoreProductUnits.q(2, params.units6).should.eventually.be.fulfilled
  })

  it('should deplete product units', () => {
    return store.depleteProductUnits.q(2, params.units1).should.eventually.be.fulfilled
  })

  it('should have updated the product correctly', () => {
    let currentProductUnits = params.units5+params.units6-params.units1;

    return chaithereum.web3.Q.all([
      store.getProductCount.q().should.eventually.be.bignumber.equal(3),
      store.getProductIsActive.q(2).should.eventually.be.false,
      store.getProductTeraprice.q(2).should.eventually.be.bignumber.equal(params.teraprice7),
      store.getProductUnits.q(2).should.eventually.be.bignumber.equal(currentProductUnits),
      store.getProductFileHash.q(2).should.eventually.be.ascii(params.fileHash7)
    ])
  })
}

describe('store', () => {
  let storeArgs = {}

  createStore(storeArgs)
  runStoreTests(storeArgs);
})

function toBytes32 (thing) {
  const hex = chaithereum.web3.toHex(thing)
  const hexWithout0x = hex.replace('0x', '')
  const missingZeros = '0'.repeat(66 - hex.length)
  return `0x${missingZeros}${hexWithout0x}`
}

module.exports = {runStoreTests: runStoreTests, createStore: createStore}
