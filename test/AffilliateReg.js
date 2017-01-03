/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')

before(() => {
  return chaithereum.promise
})

describe('AffiliateReg', () => {

  let affiliateReg

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.AffiliateReg.abi).new
    .q({ data: contracts.AffiliateReg.bytecode }).should.eventually.be.contract
    .then((_affiliateReg) => {
      affiliateReg = _affiliateReg
    }).should.be.fulfilled
  })

  it('should not have "aff" owner', () => {
    return chaithereum.web3.Q.all([
      affiliateReg.getAffiliateOwner.q('aff').should.eventually.be.address,
      affiliateReg.getAffiliateOwner.q('aff').should.eventually.be.zeros
    ])
  })

  it('should be able to claim "aff"', () => {
    return affiliateReg.setAffiliate
    .q('aff', chaithereum.accounts[0], chaithereum.accounts[1], {
      from: chaithereum.accounts[0]
    }).should.be.fulfilled
  })

  it('should have correct owner for "aff"', () => {
    return affiliateReg.getAffiliateOwner.q('aff').should.eventually
    .equal(chaithereum.accounts[0])
  })

  it('should have correct coinbase for "aff"', () => {
    return affiliateReg.getAffiliateCoinbase.q('aff').should.eventually
    .equal(chaithereum.accounts[1])
  })

  it('should not have "aff2" owner', () => {
    return chaithereum.web3.Q.all([
      affiliateReg.getAffiliateOwner.q('aff2').should.eventually.be.address,
      affiliateReg.getAffiliateOwner.q('aff2').should.eventually.be.zeros
    ])
  })

  it('should be able to claim "aff2"', () => {
    return affiliateReg.setAffiliate.q('aff2', chaithereum.accounts[2], chaithereum.accounts[3], {
      from: chaithereum.accounts[1]
    }).should.be.fulfilled
  })

  it('should have correct owner for "aff2"', () => {
    return affiliateReg.getAffiliateOwner.q('aff2').should.eventually
    .equal(chaithereum.accounts[2])
  })

  it('should have correct coinbase for "aff2"', () => {
    return affiliateReg.getAffiliateCoinbase.q('aff2').should.eventually
    .equal(chaithereum.accounts[3])
  })

  it('should allow reassignment of aff by the owner', () => {
    return chaithereum.web3.Q.all([
      affiliateReg.setAffiliate.q('aff', chaithereum.accounts[2], chaithereum.accounts[1], {
        from: chaithereum.accounts[0]
      }).should.be.fulfilled,
      affiliateReg.setAffiliate.q('aff', chaithereum.accounts[2], chaithereum.accounts[3], {
        from: chaithereum.accounts[2]
      }).should.be.fulfilled
    ])
  })

  it('should not allow owner reassignment of aff by others', () => {
    return affiliateReg.setAffiliate.q('aff', chaithereum.accounts[0], chaithereum.accounts[3], {
      from: chaithereum.accounts[0]
    }).should.be.rejected
  })

  it('should have correct owner for "aff"', () => {
    return affiliateReg.getAffiliateOwner.q('aff').should.eventually
    .equal(chaithereum.accounts[2])
  })

  it('should have correct coinbase for "aff"', () => {
    return affiliateReg.getAffiliateCoinbase.q('aff').should.eventually
    .equal(chaithereum.accounts[3])
  })
})
