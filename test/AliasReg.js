/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('./chaithereum')
const Q = require('q')
const deferred = Q.defer()
module.exports = deferred.promise

describe('AliasReg', () => {

  let aliasReg

  after(() => {
    deferred.resolve({ aliasReg })
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.AliasReg.abi).new
    .q({data: contracts.AliasReg.bytecode, gas: chaithereum.gasLimit}).should.eventually.be.contract
    .then((_aliasReg) => {
      aliasReg = _aliasReg
    }).should.be.fulfilled
  })

  it('cannot claim a blank alias', () => {
    return aliasReg.claimAlias.q('').should.eventually.be.rejected
  })

  it('can claim "myalias"', () => {
    return aliasReg.claimAlias.q('myalias').should.eventually.be.fullfilled
  })

  it('denies others claiming rights to "myalias"', () => {
    return chaithereum.web3.Q.all([
      aliasReg.claimAlias.q('myalias'),
      aliasReg.claimAlias.q('myalias', {
        from: chaithereum.accounts[2]
      }),
    ]).should.eventually.be.rejected
  })

  it('can retreive address associated with "myalias"', () => {
    return aliasReg.getAddr.q('myalias').should.eventually
    .equal(chaithereum.web3.eth.defaultAccount)
  })
})
