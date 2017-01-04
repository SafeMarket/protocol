/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const Q = require('q')
const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')

before(() => {
  return chaithereum.promise
})

describe('ownable', () => {

  let ownable

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.ownable.abi).new.q({
      data: contracts.ownable.bytecode,
    }).should.eventually.be.contract.then((_ownable) => {
      ownable = _ownable
    })
  })

  it('should have account0 as an owner', () => {
    return ownable.hasOwner.q(chaithereum.accounts[0]).should.eventually.equal(true)
  })

  it('should prevent randos from setting a new owner', () => {
    return ownable.setOwner
    .q(chaithereum.accounts[1], true, {from: chaithereum.accounts[1]}).should.eventually.be.rejected
  })

  it('should allow the owner to change the owner', () => {
    return ownable.setOwner.q(chaithereum.accounts[1], true).should.eventually.be.fulfilled
  })

  it('should have both account 0 and 1 as owners', () => {
    return Q.all([
      ownable.hasOwner.q(chaithereum.accounts[0]).should.eventually.equal(true),
      ownable.hasOwner.q(chaithereum.accounts[1]).should.eventually.equal(true),
    ])
  })

  it('should remove account 0 as owner from account 1', () => {
    return ownable.setOwner.q(chaithereum.accounts[0], false, {
      from: chaithereum.accounts[1]
    }).should.be.fulfilled
  })

  it('account 0 should no longer be owner', () => {
    return ownable.hasOwner.q(chaithereum.accounts[0]).should.eventually.equal(false)
  })

  it('account 1 should still be owner', () => {
    return ownable.hasOwner.q(chaithereum.accounts[1]).should.eventually.equal(true)
  })

})
