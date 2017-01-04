/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')
const AliasRegTestPromise = require('./AliasReg')
const Q = require('q')
const deferred = Q.defer()
module.exports = deferred.promise

before(() => {
  return chaithereum.promise
})


describe('SubmarketReg', () => {

  let aliasReg
  let orderReg
  let submarketReg
  let submarket

  AliasRegTestPromise.then((results) => {
    aliasReg = results.aliasReg
  })

  after(() => {
    deferred.resolve({ submarketReg, submarket })
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.SubmarketReg.abi).new.q(
      aliasReg.address,
      { data: contracts.SubmarketReg.bytecode }
    ).should.eventually.be.contract.then((_submarketReg) => {
      submarketReg = _submarketReg
    }).should.eventually.be.fulfilled
  })


  it('should correctly retreive alias reg', () => {
    return submarketReg.aliasRegAddr.q().should.eventually.equal(aliasReg.address)
  })

  it('should create a submarket', () => {

    const pseudoSubmarket = chaithereum.web3.eth.contract(contracts.Submarket.abi).at(0)
    const calldatas = [
      pseudoSubmarket.setIsOpen.getData(true),
      pseudoSubmarket.setCurrency.getData(params.currency1),
      pseudoSubmarket.setEscrowFeeTerabase.getData(params.escrowFeeTerabase1),
      pseudoSubmarket.setEscrowFeeCentiperun.getData(params.escrowFeeCentiperun1),
      pseudoSubmarket.setFileHash.getData(params.fileHash1),
    ].map((calldata) => {
      return calldata.replace('0x', '')
    })
    const lengths = calldatas.map((calldata) => { return Math.ceil(calldata.length / 2) })

    return submarketReg.create.q(
      lengths,
      `0x${calldatas.join('')}`,
      { from: chaithereum.accounts[5] }
    ).should.eventually.be.fulfilled
  })

  it('should have triggered Registration event', () => {
    return submarketReg.Registration({}, {fromBlock: 'latest', toBlock: 'latest'})
    .q().should.eventually.have.length(1)
  })

  it('should have updated the submarket counts correctly', () => {
    return chaithereum.web3.Q.all([
      submarketReg.getSubmarketCount.q().should.eventually.be.bignumber.equal(1),
      submarketReg.getCreatedSubmarketCount.q(chaithereum.accounts[5])
      .should.eventually.be.bignumber.equal(1),
    ])
  })

  it('should get the submarket address', () => {
    return chaithereum.web3.Q.all([
      submarketReg.getSubmarketAddr.q(0).should.eventually.be.address,
      submarketReg.getCreatedSubmarketAddr.q(chaithereum.accounts[5], 0)
      .should.eventually.be.address,
    ])
  })

  it('should make the submarket address a contract', () => {
    return submarketReg.getCreatedSubmarketAddr.q(chaithereum.accounts[5], 0)
    .then((_submarketAddr) => {
      submarket = chaithereum.web3.eth.contract(contracts.Submarket.abi).at(_submarketAddr)
    })
  })

  it('should make the submarket as registered', () => {
    return submarketReg.isRegistered.q(submarket.address).should.eventually.be.true
  })

  it('should have account 5 as owner', () => {
    return submarket.hasOwner.q(chaithereum.accounts[5]).should.eventually.equal(true)
  })

  it('should have correct values values', () => {
    return chaithereum.web3.Q.all([
      submarket.isOpen.q().should.eventually.equal(true),
      submarket.currency.q().should.eventually.be.ascii(params.currency1),
      submarket.escrowFeeTerabase.q().should.eventually.be.bignumber.equal(params.escrowFeeTerabase1),
      submarket.escrowFeeCentiperun.q().should.eventually.be.bignumber.equal(params.escrowFeeCentiperun1),
      submarket.fileHash.q().should.eventually.be.ascii(params.fileHash1),
    ])
  })

})
