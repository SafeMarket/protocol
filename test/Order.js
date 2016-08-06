/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})

describe('order', () => {
  let orderArgs = {}

  createOrder(orderArgs)
  runOrderTest(orderArgs)
})

function createOrder(args) {
  let tickerArgs = {}
  let storeArgs = {}

  it('successfully creates a new Store', () => {
    return chaithereum.web3.eth.contract(contracts.Store.abi).new.q(
      [params.teraprice1, params.units1, params.fileHash1, params.teraprice2, params.units2, params.fileHash2],
      [params.teraprice3, params.fileHash3, params.teraprice4, params.fileHash4],
      [params.alias1].map(toBytes32),
      { data: contracts.Store.bytecode }
    ).should.eventually.be.contract.then((_store) => {;
      storeArgs.address = _store.address
      storeArgs.contract = _store
    }).should.eventually.be.fulfilled
  })

  it('successfully creates a new Ticker', () => {
    return chaithereum.web3.eth.contract(contracts.Ticker.abi).new.q({ data: contracts.Ticker.bytecode })
    .should.eventually.be.contract.then((_ticker) => {
      tickerArgs.address = _ticker.address
      tickerArgs.contract = _ticker
    })
  })

  it('sets the ticker prices', () => {
    return chaithereum.web3.Q.all([
      tickerArgs.contract.setPrice.q(params.currency1, params.price1),
      tickerArgs.contract.setPrice.q(params.currency2, params.price2),
      tickerArgs.contract.setPrice.q(params.currency3, params.price3)
    ])
  })

  //TODO: create tests for the contract creation throw cases

  it('successfully instantiates with non-blank params', () => {
    return chaithereum.web3.eth.contract(contracts.Order.abi).new.q(
      chaithereum.address,
      storeArgs.address,
      toBytes32(0),
      toBytes32(0),
      [0,1],
      [5,7],
      1,
      tickerArgs.address,
      { data: contracts.Order.bytecode }
    ).then((_order) => {
      args.contract = _order
    }).should.eventually.be.fulfilled
  })
}

function runOrderTest(args) {
  let order

  it('gets the order from the arguments', () => {
    order = args.contract
  })
}

function toBytes32(thing) {
  const hex = chaithereum.web3.toHex(thing)
  const hexWithout0x = hex.replace('0x', '')
  const missingZeros = '0'.repeat(66 - hex.length)
  return `0x${missingZeros}${hexWithout0x}`
}
