/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const runSubmarketTests = require('./Submarket.js').runSubmarketTests
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})


describe('SubmarketReg', () => {
  let infosphere
  let aliasReg
  let orderReg
  let submarketReg
  let submarket
  let submarketArgs = {}

  before(() => {
    return chaithereum.web3.Q.all([
      chaithereum.web3.eth.contract(contracts.Infosphere.abi).new.q({
        data: contracts.Infosphere.bytecode,
      }).should.eventually.be.contract.then((_infosphere) => {
        infosphere = _infosphere
      }),
      chaithereum.web3.eth.contract(contracts.AliasReg.abi).new.q({
        data: contracts.AliasReg.bytecode,
      }).should.eventually.be.contract.then((_aliasReg) => {
        aliasReg = _aliasReg
      }),
    ])
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.SubmarketReg.abi).new.q({ data: contracts.SubmarketReg.bytecode }).should.eventually.be.contract.then((_submarketReg) => {
      submarketReg = _submarketReg
    }).should.eventually.be.fulfilled
  })

  it('should set infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      submarketReg.setInfosphereAddr.q(infosphere.address).should.be.fulfilled,
      submarketReg.setAliasRegAddr.q(aliasReg.address).should.be.fulfilled
    ])
  })

  it('should correctly retreive infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      submarketReg.infosphereAddr.q().should.eventually.equal(infosphere.address),
      submarketReg.aliasRegAddr.q().should.eventually.equal(aliasReg.address)
    ])
  })

  it('should create a submarket', () => {
    return submarketReg.create.q(
      chaithereum.accounts[2],
      true,
      params.currency1,
      params.escrowFeeTerabase1,
      params.escrowFeeCentiperun1,
      params.fileHash1,
      params.alias2,
      {from: chaithereum.accounts[5]}
    ).should.eventually.be.fulfilled
  })

  it('should have triggered Registration event', () => {
    return submarketReg.Registration({}, { fromBlock: 'latest', toBlock: 'latest' }).q().should.eventually.have.length(1)
  })

  it('should have updated the submarket counts correctly', () => {
    return chaithereum.web3.Q.all([
      submarketReg.getSubmarketCount.q().should.eventually.be.bignumber.equal(1),
      submarketReg.getCreatedSubmarketCount.q(chaithereum.accounts[2])
      .should.eventually.be.bignumber.equal(1),
    ])
  })

  it('should get the submarket address', () => {
    return chaithereum.web3.Q.all([
      submarketReg.getSubmarketAddr.q().should.eventually.be.address,
      submarketReg.getCreatedSubmarketAddr.q(chaithereum.accounts[2], 0)
      .should.eventually.be.address,
    ])
  })

  it('should make the submarket address a contract', (done) => {
    return submarketReg.getCreatedSubmarketAddr.q(chaithereum.accounts[2], 0)
    .then((_submarketAddr) => {
      submarketArgs.address = _submarketAddr
      submarketArgs.contract = chaithereum.web3.eth
      .contract(contracts.Submarket.abi).at(_submarketAddr)
      submarket = submarketArgs.contract
      submarketArgs.contract.should.be.contract
      done()
    })
  })

  it('should make the submarket owner the msg sender', () => {
    return submarketArgs.contract.getOwner.q().should.eventually.be.address
    .equal(chaithereum.accounts[2])
  })

  it('should make the submarket as registered', () => {
    return submarketReg.isRegistered.q(submarketArgs.address).should.eventually.be.true
  })

  it('should have correct alias', () => {
    return chaithereum.web3.Q.all([
      aliasReg.getAlias.q(submarket.address).should.eventually.be.ascii(params.alias2),
      aliasReg.getAddr.q(params.alias2).should.eventually.equal(submarket.address),
    ])
  })

  it('should have correct owner', () => {
    return submarket.owner.q().should.eventually.equal(chaithereum.accounts[2])
  })

  it('should have correct infosphere address', () => {
    return submarket.getInfosphereAddr.q().should.eventually.equal(infosphere.address)
  })

  it('should have correct infosphere values', () => {
    return chaithereum.web3.Q.all([
      infosphere.getBool.q(submarket.address, 'isOpen').should.eventually.equal(true),
      submarket.getBytes32.q('currency').should.eventually.be.ascii(params.currency1),
      submarket.getUint.q('escrowFeeTerabase').should.eventually.be.bignumber.equal(params.escrowFeeTerabase1),
      submarket.getUint.q('escrowFeeCentiperun').should.eventually.be.bignumber.equal(params.escrowFeeCentiperun1),
      submarket.getBytes32.q('fileHash').should.eventually.be.ascii(params.fileHash1),
    ])
  })

  runSubmarketTests(submarketArgs)
})
