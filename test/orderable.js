/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')

before(() => {
  return chaithereum.promise
})

describe('orderable', () => {

  let orderable

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.orderable.abi).new.q({ data: contracts.orderable.bytecode }).should.eventually.be.contract.then((_orderable) => {
      orderable = _orderable
    })
  })

  it('cannot set order addr from accounts[1]', () => {
    return orderable.setOrderReg.q(chaithereum.accounts[0], { from: chaithereum.accounts[1] }).should.be.rejected
  })

  it('set order addr as accounts[0]', () => {
    return orderable.setOrderReg.q(chaithereum.accounts[3]).should.be.fulfilled
  })

  // it('cannot add order addr from non order reg', () => {
  //   return orderable.addOrderAddr.q(1, { from: chaithereum.accounts[1] }).should.be.rejected
  // })
  //
  // it('can add order addr from order reg', () => {
  //   return orderable.addOrderAddr.q(1, {from: chaithereum.accounts[3]}).should.be.fulfilled
  // })
  //
  // it('should retreive correct number of orders', () => {
  //   return orderable.getOrderCount.q().should.eventually.be.bignumber.equal(1)
  // })
  //
  // it('should retreive correct order addr', () => {
  //   return orderable.getOrderAddr.q(0).should.eventually.be.bignumber.equal(1)
  // })

})
