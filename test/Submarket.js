/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})

function createSubmarket (args) {
  it('successfully instantiates with blank params', () => {
    return chaithereum.web3.eth.contract(contracts.Submarket.abi).new.q([], [], [], { data: contracts.Submarket.bytecode }).should.eventually.be.contract.then((_submarket) => {
      args.address = _submarket.address
      args.contract = _submarket
    }).should.eventually.be.fulfilled
  })

  it('successfully instantiates with non-blank params', () => {
    return chaithereum.web3.eth.contract(contracts.Submarket.abi).new.q(
      [true, params.teraprice1, params.units1, params.fileHash1, false, params.teraprice2, params.units2, params.fileHash2].map(toBytes32),
      [true, params.teraprice3, params.fileHash3, false, params.teraprice4, params.fileHash4].map(toBytes32),
      [params.alias1, params.alias2],
      {data: contracts.Submarket.bytecode}
    ).should.eventually.be.contract.then((_submarket) => {
      args.address = _submarket.address
      args.contract = _submarket
    }).should.eventually.be.fulfilled
  })
}

function runSubmarketTests (args) {
  let submarket

  it('gets the submarket from the arguments', () => {
    submarket = args.contract
  })
}

describe('submarket', () => {
  let submarketArgs = {}

  createSubmarket(submarketArgs)
  runSubmarketTests(submarketArgs);
})

function toBytes32 (thing) {
  const hex = chaithereum.web3.toHex(thing)
  const hexWithout0x = hex.replace('0x', '')
  const missingZeros = '0'.repeat(66 - hex.length)
  return `0x${missingZeros}${hexWithout0x}`
}

module.exports = {runSubmarketTests: runSubmarketTests, createSubmarket: createSubmarket}
