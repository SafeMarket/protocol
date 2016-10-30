/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

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

  it('should throw randos for requireOwnership', () => {
    return ownable.requireOwnership.q({from: chaithereum.accounts[1]}).should.eventually.be.rejected
  })

  it('should allow owners for requireOwnership', () => {
    return ownable.requireOwnership.q().should.eventually.be.fulfilled
  })

  it('should return the correct owner', () => {
    return ownable.getOwner.q().should.eventually.be.address.equal(chaithereum.accounts[0])
  })

  it('should prevent randos from changing the owner', () => {
    return ownable.setOwner
    .q(chaithereum.accounts[1], {from: chaithereum.accounts[1]}).should.eventually.be.rejected
  })

  it('should allow the owner to change the owner', () => {
    return ownable.setOwner.q(chaithereum.accounts[1]).should.eventually.be.fulfilled
  })

  it('should return the correct owner', () => {
    return ownable.getOwner.q().should.eventually.be.address.equal(chaithereum.accounts[1])
  })

  it('should allow the new owner requireOwnership', () => {
    return ownable.requireOwnership
    .q({from: chaithereum.accounts[1]}).should.eventually.be.fulfilled
  })
})
