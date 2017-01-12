const contracts = require('../modules/contracts')
const chaithereum = require('./chaithereum')
const params = require('./testparams.js')
const Q = require('q')
const multiproxPromise = require('./Multiprox')
const parseTransactionReceipt = require('../modules/parseTransactionReceipt')

const deferred = Q.defer()
module.exports = deferred.promise

let multiprox

multiproxPromise.then((_multiprox) => {
  multiprox = _multiprox
})

describe('Submarket', () => {

  let submarket

  after(() => {
    deferred.resolve(submarket)
  })

  it('should create a submarket via multiprox', () => {

    const pseudoSubmarket = chaithereum.web3.eth.contract(contracts.Submarket.abi).at(0)
    const calldatas = [
      pseudoSubmarket.set_isOwner.getData(chaithereum.accounts[5], true),
      pseudoSubmarket.set_isOpen.getData(true),
      pseudoSubmarket.set_currency.getData(params.currency1),
      pseudoSubmarket.set_escrowFeeTerabase.getData(params.escrowFeeTerabase1),
      pseudoSubmarket.set_escrowFeeTeraperun.getData(params.escrowFeeTeraperun1),
      pseudoSubmarket.set_metaMultihash.getData(params.fileHash1)
    ].map((calldata) => {
      return calldata.replace('0x', '')
    })
    const lengths = calldatas.map((calldata) => {
      return Math.ceil(calldata.length / 2)
    })
    const calldatasConcated = `0x${calldatas.join('')}`

    return multiprox.createAndExecute.estimateGas.q(
      contracts.Submarket.codeHash, lengths, calldatasConcated, { gas: chaithereum.gasLimit }
    ).then((gas) => {
      console.log('==================')
      console.log('Submarket Gas', gas)
      console.log('==================')
      return multiprox.createAndExecute.q(
        contracts.Submarket.codeHash, lengths, calldatasConcated, { gas: chaithereum.gasLimit }
      ).then((transactionHash) => {
        return chaithereum.web3.eth.getTransactionReceipt.q(
          transactionHash
        ).then((transactionReceipt) => {
          const addr = parseTransactionReceipt(transactionReceipt).addr
          submarket = chaithereum.web3.eth.contract(contracts.Submarket.abi).at(addr)
        })
      })
    })
  })

  it('should have account 5 as owner', () => {
    return submarket.get_isOwner.q(chaithereum.accounts[5]).should.eventually.equal(true)
  })

  it('should have correct values', () => {
    return chaithereum.web3.Q.all([
      submarket.isOpen.q().should.eventually.equal(true),
      submarket.currency.q().should.eventually.be.ascii(params.currency1),
      submarket.escrowFeeTerabase.q().should.eventually.be.bignumber.equal(
        params.escrowFeeTerabase1
      ),
      submarket.escrowFeeTeraperun.q().should.eventually.be.bignumber.equal(
        params.escrowFeeTeraperun1
      ),
      submarket.metaMultihash.q().should.eventually.be.ascii(params.fileHash1)
    ]).should.be.fulfilled
  })

})
