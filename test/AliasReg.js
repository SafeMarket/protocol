"use strict";

const fs = require('fs')
const crypto = require('crypto')
const contracts = JSON.parse(fs.readFileSync('./generated/contracts.json', 'utf8')).contracts
const chaithereum = require('chaithereum')
const web3 = chaithereum.web3
const chai = chaithereum.chai
const expect = chaithereum.chai.expect

let account
let accounts

before(() => {
  return chaithereum.promise.then(() => {
    account = chaithereum.account
    accounts = chaithereum.accounts
  })
})


describe('AliasReg', () => {

  let aliasReg
  
  it('should deploy aliasReg', () => {
    return web3.eth.contract(JSON.parse(contracts.AliasReg.interface)).new.q().should.eventually.be.contract.then((_aliasReg) => {
      aliasReg = _aliasReg
    })
  })

  it('should claim alias "myalias"', () => {
    return aliasReg.claimAlias.q('myalias').should.eventually.be.fulfilled
  })


})