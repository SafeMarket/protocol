/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')

before(() => {
  return chaithereum.promise
})

describe('order', () => {

  let store

  it('successfully instantiates with blank params', () => {
    return chaithereum.web3.eth.contract(contracts.Order.abi).new.q([], [], [], { data: contracts.Order.bytecode }).should.eventually.be.contract.then((_store) => {
      store = _store
    }).should.eventually.be.fulfilled
  })

  //TODO: write tests for this contract
})