/* eslint no-unused-expressions: "off" */
/* globals describe, it, before */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

before(() => {
  return chaithereum.promise
})

describe('forumable', () => {

  let forum
  let forumable

  before(() => {
    return chaithereum.web3.eth.contract(contracts.Forum.abi).new.q({
      data: contracts.Forum.bytecode,
    }).should.eventually.be.contract.then((_forum) => {
      forum = _forum
    }).should.eventually.be.fulfilled
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.forumable.abi).new.q({
      data: contracts.forumable.bytecode,
    }).should.eventually.be.contract.then((_forumable) => {
      forumable = _forumable
    })
  })

  it('should not let random people set the Forum', () => {
    return chaithereum.web3.Q.all([
      forumable.setForum.q(forum.address, {from: chaithereum.accounts[1]})
      .should.eventually.be.rejected,
      forumable.setForum.q(forum.address, {from: chaithereum.accounts[2]})
      .should.eventually.be.rejected,
    ])
  })

  it('should let the creator set the Forum', () => {
    return forumable.setForum.q(forum.address).should.eventually.be.fulfilled
  })

  it('should not let random people add a comment', () => {
    return chaithereum.web3.Q.all([
      forumable.addComment.q(params.id1, params.id1, {from: chaithereum.accounts[1]})
      .should.eventually.be.rejected,
      forumable.addComment.q(params.id1, params.data1, {from: chaithereum.accounts[2]})
      .should.eventually.be.rejected,
    ])
  })

  it('should let the creator add a acomment', () => {
    return forumable.addComment.q(params.id1, params.data1).should.eventually.be.fulfilled
  })

  it('should have triggered a Comment event', () => {
    return forum.Comment({}, { fromBlock: 'latest', toBlock: 'latest' })
    .q().should.eventually.have.length(1)
  })
})
