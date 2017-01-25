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

describe('Arbitrator', () => {

  let arbitrator

  after(() => {
    deferred.resolve(arbitrator)
  })

  it('should create a arbitrator via multiprox', () => {

    const pseudoArbitrator = chaithereum.web3.eth.contract(contracts.Arbitrator.abi).at(0)
    const calldatas = [
      pseudoArbitrator.set_isOwner.getData(chaithereum.accounts[5], true),
      pseudoArbitrator.set_isOpen.getData(true),
      pseudoArbitrator.set_currency.getData(params.currency1),
      pseudoArbitrator.set_escrowFeeTerabase.getData(params.escrowFeeTerabase1),
      pseudoArbitrator.set_escrowFeePicoperun.getData(params.escrowFeePicoperun1),
      pseudoArbitrator.set_metaMultihash.getData(params.fileHash1)
    ].map((calldata) => {
      return calldata.replace('0x', '')
    })
    const lengths = calldatas.map((calldata) => {
      return Math.ceil(calldata.length / 2)
    })
    const calldatasConcated = `0x${calldatas.join('')}`

    return multiprox.createAndExecute.estimateGas.q(
      contracts.Arbitrator.codeHash, lengths, calldatasConcated, { gas: chaithereum.gasLimit }
    ).then((gas) => {
      console.log('==================')
      console.log('Arbitrator Gas', gas)
      console.log('==================')
      return multiprox.createAndExecute.q(
        contracts.Arbitrator.codeHash, lengths, calldatasConcated, { gas: chaithereum.gasLimit }
      ).then((transactionHash) => {
        return chaithereum.web3.eth.getTransactionReceipt.q(
          transactionHash
        ).then((transactionReceipt) => {
          const addr = parseTransactionReceipt(transactionReceipt).addr
          arbitrator = chaithereum.web3.eth.contract(contracts.Arbitrator.abi).at(addr)
        })
      })
    })
  })

  it('should have account 5 as owner', () => {
    return arbitrator.get_isOwner.q(chaithereum.accounts[5]).should.eventually.equal(true)
  })

  it('should have correct values', () => {
    return chaithereum.web3.Q.all([
      arbitrator.isOpen.q().should.eventually.equal(true),
      arbitrator.currency.q().should.eventually.be.ascii(params.currency1),
      arbitrator.escrowFeeTerabase.q().should.eventually.be.bignumber.equal(
        params.escrowFeeTerabase1
      ),
      arbitrator.escrowFeePicoperun.q().should.eventually.be.bignumber.equal(
        params.escrowFeePicoperun1
      ),
      arbitrator.metaMultihash.q().should.eventually.be.ascii(params.fileHash1)
    ]).should.be.fulfilled
  })

})
