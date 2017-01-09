/*globals describe, it, before */

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')
const AliasRegTestPromise = require('./Ticker.js')
const StoreRegTestPromise = require('./StoreReg.js')
const SubmarketRegTestPromise = require('./SubmarketReg.js')
const TickerTestPromise = require('./Ticker.js')
const BigNumber = require('bignumber.js')

before(() => {
  return chaithereum.promise
})

describe('OrderReg', () => {

  let orderReg
  let aliasReg
  let storeReg
  let submarketReg
  let store
  let ticker

  AliasRegTestPromise.then((results) => {
    aliasReg = results.aliasReg
  })

  TickerTestPromise.then((results) => {
    ticker = results.ticker
  })

  StoreRegTestPromise.then((results) => {
    storeReg = results.storeReg
    store = results.store
  })

  SubmarketRegTestPromise.then((results) => {
    submarketReg = results.submarketReg
    submarket = results.submarket
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.OrderReg.abi).new.q(
      storeReg.address,
      submarketReg.address,
      ticker.address,
      { data: contracts.OrderReg.bytecode,
        gas: "0xffffff",
      }
    ).should.eventually.be.contract.then((_orderReg) => {
      orderReg = _orderReg
    }).should.eventually.be.fulfilled
  })

  it('has correct storeReg', () => {
    return orderReg.storeReg.q().should.eventually.equal(storeReg.address)
  })

  it('has correct submarketReg', () => {
    return orderReg.submarketReg.q().should.eventually.equal(submarketReg.address)
  })

  it('has correct ticker', () => {
    return orderReg.ticker.q().should.eventually.equal(ticker.address)
  })
})