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
    return chaithereum.web3.eth.contract(contracts.Submarket.abi).new.q([params.alias1, params.alias2], { data: contracts.Submarket.bytecode }).should.eventually.be.contract.then((_submarket) => {
      args.address = _submarket.address
      args.contract = _submarket
    }).should.eventually.be.fulfilled
  })

  it('successfully instantiates with non-blank params', () => {
    return chaithereum.web3.eth.contract(contracts.Submarket.abi).new.q(
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

  it('should have correct approved aliases', () => {
    return chaithereum.web3.Q.all([
      submarket.getApprovedAliasesLength.q().should.eventually.be.bignumber.equal(2),
      submarket.getApprovedAlias.q(0).should.eventually.be.ascii(params.alias1),
      submarket.getApprovedAlias.q(1).should.eventually.be.ascii(params.alias2)
    ]).should.eventually.be.fulfilled
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
