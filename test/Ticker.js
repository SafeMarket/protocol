const contracts = require('../modules/contracts')
const chaithereum = require('./chaithereum')
const Q = require('q')
const params = require('./testparams.js')
const deferred = Q.defer()

module.exports = deferred.promise

describe('Ticker', () => {

  let ticker

  after(() => {
    deferred.resolve({ ticker })
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.Ticker.abi).new.q(
      { data: contracts.Ticker.bytecode, gas: chaithereum.gasLimit }
    ).should.eventually.be.contract.then((_ticker) => {
      ticker = _ticker
    })
  })

  it('can set prices', () => {
    return chaithereum.web3.Q.all([
      ticker.setPrice.q('P', 1),
      ticker.setPrice.q('N', 5),
      ticker.setPrice.q('D', 10)
    ])
  })

  it('can retreive prices', () => {
    return chaithereum.web3.Q.all([
      ticker.getPrice.q('P').should.eventually.bignumber.equal(1),
      ticker.getPrice.q('N').should.eventually.bignumber.equal(5),
      ticker.getPrice.q('D').should.eventually.bignumber.equal(10)
    ])
  })

  it('cannot set prices from non-owner', () => {
    return ticker.setPrice.q('P', 1, { from: chaithereum.accounts[1] }).should.be.rejected
  })

  it('correctly converts', () => {
    return chaithereum.web3.Q.all([
      ticker.convert.q(1, 'P', 'P').should.eventually.bignumber.equal(1),
      ticker.convert.q(5, 'P', 'N').should.eventually.bignumber.equal(1),
      ticker.convert.q(5, 'P', 'D').should.eventually.bignumber.equal(0),
      ticker.convert.q(1, 'D', 'P').should.eventually.bignumber.equal(10),
      ticker.convert.q(1, 'P', 'X').should.eventually.be.rejected,
      ticker.convert.q(1, 'X', 'P').should.eventually.be.rejected
    ])
  })

  it('sets test params', () => {
    return chaithereum.web3.Q.all([
      ticker.setPrice.q(params.currency0, params.currencyInWei0),
      ticker.setPrice.q(params.currency1, params.currencyInWei1),
      ticker.setPrice.q(params.currency2, params.currencyInWei2),
      ticker.setPrice.q(params.currency3, params.currencyInWei3),
    ])
  })

  it('gets test params', () => {
    return chaithereum.web3.Q.all([
      ticker.getPrice.q(params.currency0).should.eventually.be.bignumber.equal(params.currencyInWei0),
      ticker.getPrice.q(params.currency1).should.eventually.be.bignumber.equal(params.currencyInWei1),
      ticker.getPrice.q(params.currency2).should.eventually.be.bignumber.equal(params.currencyInWei2),
      ticker.getPrice.q(params.currency3).should.eventually.be.bignumber.equal(params.currencyInWei3)
    ])
  })

})
