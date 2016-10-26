/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})


describe('approvesAliases', () => {
  let approvesAliases

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.approvesAliases.abi).new.q({
      data: contracts.approvesAliases.bytecode,
    }).should.eventually.be.contract.then((_approvesAliases) => {
      approvesAliases = _approvesAliases
    })
  })

  it('should not have approved alias1', () => {
    return approvesAliases.getIsAliasApproved.q(params.alias1).should.eventually.be.false
  })

  it('should not have approved alias2', () => {
    return approvesAliases.getIsAliasApproved.q(params.alias2).should.eventually.be.false
  })

  it('should approve alias1', () => {
    return approvesAliases.approveAlias.q(params.alias1).should.be.fulfilled
  })

  it('should approve alias1 (again)', () => {
    return approvesAliases.approveAlias.q(params.alias1).should.be.fulfilled
  })

  it('should have 1 approved alias', () => {
    return approvesAliases.getApprovedAliasesLength.q().should.eventually.be.bignumber.equal(1)
  })

  it('should approve alias2', () => {
    return approvesAliases.approveAlias.q(params.alias2).should.be.fulfilled
  })

  it('should have 2 approved aliases', () => {
    return approvesAliases.getApprovedAliasesLength.q().should.eventually.be.bignumber.equal(2)
  })

  it('should approve alias1', () => {
    return approvesAliases.getIsAliasApproved.q(params.alias1).should.eventually.be.true
  })

  it('should approve alias2', () => {
    return approvesAliases.getIsAliasApproved.q(params.alias2).should.eventually.be.true
  })

  it('should disapprove alias1', () => {
    return approvesAliases.disapproveAlias.q(params.alias1).should.be.fulfilled
  })

  it('should have not have approved alias1', () => {
    return approvesAliases.getIsAliasApproved.q(params.alias1).should.eventually.be.false
  })

  it('should disapprove alias1 (again)', () => {
    return approvesAliases.disapproveAlias.q(params.alias1).should.be.fulfilled
  })

  it('should have not have approved alias1', () => {
    return approvesAliases.getIsAliasApproved.q(params.alias1).should.eventually.be.false
  })

  it('should have approved alias2', () => {
    return approvesAliases.getIsAliasApproved.q(params.alias2).should.eventually.be.true
  })

  it('should have 2 approved aliases', () => {
    return approvesAliases.getApprovedAliasesLength.q().should.eventually.be.bignumber.equal(2)
  })

})
