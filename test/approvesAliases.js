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

  let aliasReg
  let approvesAliases

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.approvesAliases.abi).new.q({
      data: contracts.approvesAliases.bytecode,
    }).should.eventually.be.contract.then((_approvesAliases) => {
      approvesAliases = _approvesAliases
    })
  })

  it('should not let random people approve an alias', () => {
    return chaithereum.web3.Q.all([
      approvesAliases.approveAlias.q(params.alias1, {from: chaithereum.accounts[1]}).should.eventually.be.rejected,
      approvesAliases.approveAlias.q(params.alias2, {from: chaithereum.accounts[2]}).should.eventually.be.rejected,
    ])
  })

  it('should let the creator approve an alias', () => {
    return approvesAliases.approveAlias.q(params.alias1).should.eventually.be.fulfilled
  })

  it('should correctly store alias information', () => {
    return chaithereum.web3.Q.all([
      approvesAliases.getApprovedAliasesLength.q().should.eventually.be.bignumber.equal(1),
      approvesAliases.isAliasApproved.q(params.alias1).should.eventually.be.ok,
      approvesAliases.getApprovedAlias.q(0).should.eventually.be.ascii(params.alias1),
    ])
  })

  it('should not let random people disapprove an alias', () => {
    return chaithereum.web3.Q.all([
      approvesAliases.disapproveAlias.q(params.alias1, {from: chaithereum.accounts[1]}).should.eventually.be.rejected,
      approvesAliases.disapproveAlias.q(params.alias2, {from: chaithereum.accounts[2]}).should.eventually.be.rejected,
    ])
  })

  it('should let the creator disapprove an alias', () => {
    return approvesAliases.disapproveAlias.q(params.alias1).should.eventually.be.fulfilled
  })
})
