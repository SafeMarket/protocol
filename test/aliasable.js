/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})

describe('aliasable', () => {

  let aliasReg
  let aliasable

  before(() => {
    return chaithereum.web3.eth.contract(contracts.AliasReg.abi).new.q({
      data: contracts.AliasReg.bytecode,
    }).should.eventually.be.contract.then((_aliasReg) => {
      aliasReg = _aliasReg
    }).should.eventually.be.fulfilled
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.aliasable.abi).new.q({
      data: contracts.aliasable.bytecode,
    }).should.eventually.be.contract.then((_aliasable) => {
      aliasable = _aliasable
    })
  })

  it('should not let random people set the AliasReg', () => {
    return chaithereum.web3.Q.all([
      aliasable.setAliasReg.q(aliasReg.address, {from: params.randomAcc1}).should.eventually.be.rejected,
      aliasable.setAliasReg.q(aliasReg.address, {from: params.randomAcc2}).should.eventually.be.rejected,
    ])
  })

  it('should let the creator set the AliasReg', () => {
    return aliasable.setAliasReg.q(aliasReg.address).should.eventually.be.fulfilled
  })

  it('should not let random people set the contract alias', () => {
    return chaithereum.web3.Q.all([
      aliasable.setAlias.q(params.alias1, {from: params.randomAcc1}).should.eventually.be.rejected,
      aliasable.setAlias.q(params.alias1, {from: params.randomAcc2}).should.eventually.be.rejected,
    ])
  })

  it('should let the creator set the contract alias', () => {
    return aliasable.setAlias.q(params.alias1).should.eventually.be.fulfilled
  })
})
