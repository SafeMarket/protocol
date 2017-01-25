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
    return chaithereum.web3.eth.contract(contracts.AliasReg.abi).new.q({
      data: contracts.AliasReg.bytecode, gas: chaithereum.gasLimit
    }).should.eventually.be.contract.then((_aliasReg) => {
      aliasReg = _aliasReg
    })
  })

  it('cannot claim a blank alias', () => {
    return aliasReg.setOwner.q('', chaithereum.account, { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('cannot claim an alias with an uppercase letter', () => {
    return aliasReg.setOwner.q('myAlias', chaithereum.account, { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('cannot claim an alias with an space', () => {
    return aliasReg.setOwner.q('my alias', chaithereum.account, { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('cannot claim an middle 0x00', () => {
    const myAliasHex = chaithereum.web3.fromAscii('myalias').substr(2)
    const badAliasHex = `${myAliasHex}00${myAliasHex}`
    return aliasReg.setOwner.q(badAliasHex, chaithereum.account, { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('can claim "myalias"', () => {
    return aliasReg.setOwner.q('myalias', chaithereum.account, { gas: chaithereum.gasLimit })
  })

  it('denies others claiming rights to "myalias"', () => {
    return aliasReg.setOwner.q('myalias', chaithereum.account, {
      from: chaithereum.accounts[2],
      gasLimit: chaithereum.gasLimit
    }).should.be.rejectedWith(Error)
  })

  it('can retreive address associated with "myalias"', () => {
    return aliasReg.getOwner.q('myalias', { gas: chaithereum.gasLimit }).should.eventually.equal(chaithereum.account)
  })
})
