/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const runStoreTests = require('./Store.js').runStoreTests
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})


describe('storeReg', () => {

  let infosphere
  let aliasReg
  let orderReg
  let storeReg
  let storeArgs = {}

  const fileHash = chaithereum.web3.sha3('file')

  before(() => {
    return chaithereum.web3.Q.all([
      chaithereum.web3.eth.contract(contracts.Infosphere.abi).new.q({
        data: contracts.Infosphere.bytecode
      }).should.eventually.be.contract.then((_infosphere) => {
        infosphere = _infosphere
      }),
      chaithereum.web3.eth.contract(contracts.AliasReg.abi).new.q({
        data: contracts.AliasReg.bytecode
      }).should.eventually.be.contract.then((_aliasReg) => {
        aliasReg = _aliasReg
      }),
      chaithereum.web3.eth.contract(contracts.OrderReg.abi).new.q({
        data: contracts.OrderReg.bytecode
      }).should.eventually.be.contract.then((_orderReg) => {
        orderReg = _orderReg
      })
    ])
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.StoreReg.abi).new.q({ data: contracts.StoreReg.bytecode }).should.eventually.be.contract.then((_storeReg) => {
      storeReg = _storeReg
    })
  })

  it('should set infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      storeReg.setInfosphereAddr.q(infosphere.address).should.be.fulfilled,
      storeReg.setAliasRegAddr.q(aliasReg.address).should.be.fulfilled,
      storeReg.setOrderRegAddr.q(orderReg.address).should.be.fulfilled
    ])
  })

  it('should correctly retreive infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      storeReg.infosphereAddr.q().should.eventually.equal(infosphere.address),
      storeReg.aliasRegAddr.q().should.eventually.equal(aliasReg.address),
      storeReg.orderRegAddr.q().should.eventually.equal(orderReg.address)
    ])
  })

  it('should create a store', () => {
    return storeReg.create.q(
      chaithereum.account,
      true,
      params.currency1,
      params.bufferCentiperun1,
      params.disputeSeconds1,
      params.minProductsTeratotal1,
      params.affiliateFeeCentiperun1,
      params.fileHash0,
      params.alias1,
      [true, params.teraprice1, params.units1, params.fileHash1, false, params.teraprice2, params.units2, params.fileHash2].map(toBytes32),
      [true, params.teraprice3, params.fileHash3, false, params.teraprice4, params.fileHash4].map(toBytes32),
      [params.alias1, params.alias2]
    ).should.be.fulfilled
  })

  it('should have updated the store counts correctly', () => {
    return chaithereum.web3.Q.all([
      storeReg.getStoreCount.q().should.eventually.be.bignumber.equal(1),
      storeReg.getCreatedStoreCount.q(chaithereum.account).should.eventually.be.bignumber.equal(1),
    ])
  })

  it('should get the store address', () => {
    return chaithereum.web3.Q.all([
      storeReg.getStoreAddr.q().should.eventually.be.address,
      storeReg.getCreatedStoreAddr.q(chaithereum.account, 0).should.eventually.be.address,
    ])
  })

  it('should make the store address a contract', (done) => {
    return storeReg.getCreatedStoreAddr.q(chaithereum.account, 0).then((_storeAddr) => {
      storeArgs.address = _storeAddr
      storeArgs.contract = chaithereum.web3.eth.contract(contracts.Store.abi).at(_storeAddr)
      storeArgs.contract.should.be.contract
      done()
    })
  })

  it('should make the store owner the msg sender', () => {
    return storeArgs.contract.getOwner.q().should.eventually.be.address.equal(chaithereum.account)
  })

  it('should make the store as registered', () => {
    return storeReg.isRegistered.q(storeArgs.address).should.eventually.be.true
  })

  runStoreTests(storeArgs)

})

function toBytes32(thing) {
  const hex = chaithereum.web3.toHex(thing)
  const hexWithout0x = hex.replace('0x', '')
  const missingZeros = '0'.repeat(66 - hex.length)
  return `0x${missingZeros}${hexWithout0x}`
}
