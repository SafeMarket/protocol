/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})

describe('orderable', () => {

  let orderReg
  let orderable

  before(() => {
    return chaithereum.web3.eth.contract(contracts.OrderReg.abi).new.q({
      data: contracts.OrderReg.bytecode,
    }).should.eventually.be.contract.then((_orderReg) => {
      orderReg = _orderReg
    }).should.eventually.be.fulfilled
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.orderable.abi).new.q({
      data: contracts.orderable.bytecode,
    }).should.eventually.be.contract.then((_orderable) => {
      orderable = _orderable
    })
  })

  it('should not let random people set the OrderReg', () => {
    return chaithereum.web3.Q.all([
      orderable.setOrderReg.q(orderReg.address, {from: chaithereum.accounts[1]}).should.eventually.be.rejected,
      orderable.setOrderReg.q(orderReg.address, {from: chaithereum.accounts[2]}).should.eventually.be.rejected,
    ])
  })

  it('should let the creator set the OrderReg', () => {
    return orderable.setOrderReg.q(orderReg.address).should.eventually.be.fulfilled
  })
})
