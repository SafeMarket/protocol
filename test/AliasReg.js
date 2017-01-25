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

  it('cannot register a blank alias', () => {
    return aliasReg.register.q(chaithereum.account, '', { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('cannot register an alias with an uppercase letter', () => {
    return aliasReg.register.q(chaithereum.account, 'myAlias', chaithereum.account, { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('cannot register an alias with an space', () => {
    return aliasReg.register.q(chaithereum.account, 'my alias', chaithereum.account, { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('cannot register an alias with a middle 0x00', () => {
    const myAliasHex = chaithereum.web3.fromAscii('myalias').substr(2)
    const badAliasHex = `${myAliasHex}00${myAliasHex}`
    return aliasReg.register.q(chaithereum.account, badAliasHex, { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('can register "myalias"', () => {
    return aliasReg.register.q(chaithereum.account, 'myalias', { gas: chaithereum.gasLimit })
  })

  it('can retreive owner associated with "myalias"', () => {
    return aliasReg.getOwner.q('myalias', { gas: chaithereum.gasLimit }).should.eventually.equal(chaithereum.account)
  })

  it('can retreive alias associated with chaithereum.account', () => {
    return aliasReg.getAlias.q(chaithereum.account, { gas: chaithereum.gasLimit }).should.eventually.ascii('myalias')
  })

  it('cannot claim "myalias" again', () => {
    return aliasReg.register.q(chaithereum.accounts[2], 'myalias', {
      gasLimit: chaithereum.gasLimit
    }).should.be.rejectedWith(Error)
  })

  it('cannot re-register "myalias"', () => {
    return aliasReg.register.q(chaithereum.account, 'myalias', { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('cannot register "myalias2"', () => {
    return aliasReg.register.q(chaithereum.accounts[1], 'myalias2', { gas: chaithereum.gasLimit }).should.be.rejectedWith(Error)
  })

  it('can retreive owner associated with "myalias"', () => {
    return aliasReg.getOwner.q('myalias', { gas: chaithereum.gasLimit }).should.eventually.equal(chaithereum.account)
  })

  it('can retreive alias associated with chaithereum.account', () => {
    return aliasReg.getAlias.q(chaithereum.account, { gas: chaithereum.gasLimit }).should.eventually.ascii('myalias')
  })

  it('can retreive owner associated with "myalias2"', () => {
    return aliasReg.getOwner.q('myalias2', { gas: chaithereum.gasLimit }).should.eventually.bignumber.equal(0)
  })

  it('can retreive alias associated with chaithereum.accounts[1]', () => {
    return aliasReg.getAlias.q(chaithereum.accounts[1], { gas: chaithereum.gasLimit }).should.eventually.ascii('')
  })

  it('can unregister', () => {
    return aliasReg.unregister.q()
  })

  it('can retreive owner associated with "myalias"', () => {
    return aliasReg.getOwner.q('myalias', { gas: chaithereum.gasLimit }).should.eventually.bignumber.equal(0)
  })

  it('can retreive alias associated with chaithereum.account', () => {
    return aliasReg.getAlias.q(chaithereum.accounts[1], { gas: chaithereum.gasLimit }).should.eventually.ascii('')
  })

  it('can re-register "myalias" from accounts[2]', () => {
    return aliasReg.register.q(chaithereum.accounts[2], 'myalias', { gas: chaithereum.gasLimit })
  })

  it('can retreive owner associated with "myalias"', () => {
    return aliasReg.getOwner.q('myalias', { gas: chaithereum.gasLimit }).should.eventually.equal(chaithereum.accounts[2])
  })

  it('can retreive alias associated with chaithereum.account', () => {
    return aliasReg.getAlias.q(chaithereum.accounts[2], { gas: chaithereum.gasLimit }).should.eventually.ascii('myalias')
  })

})
