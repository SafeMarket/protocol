const contracts = require('../modules/contracts')
const chaithereum = require('./chaithereum')
const Q = require('q')
const parseTransactionReceipt = require('../modules/parseTransactionReceipt')

const deferred = Q.defer()

module.exports = deferred.promise

describe('Multiprox', () => {

  let multiprox

  after(() => {
    deferred.resolve(multiprox)
  })

  it('should instantiate', () => {
    return chaithereum.web3.eth.contract(contracts.Multiprox.abi).new
      .q({
        data: contracts.Multiprox.bytecode,
        gas: chaithereum.gasLimit,
      }).should.eventually.be.contract
      .then((_multiprox) => {
        multiprox = _multiprox
      }).should.be.fulfilled
  })

  describe('registerCode', () => {
    it('should register Simple', () => {
      return multiprox.registerCode.q(contracts.Simple.bytecode, { gas: chaithereum.gasLimit })
    })
    it('should register Store', () => {
      return multiprox.registerCode.q(contracts.Store.bytecode, { gas: chaithereum.gasLimit })
    })
    it('should register Arbitrator', () => {
      return multiprox.registerCode.q(contracts.Arbitrator.bytecode, { gas: chaithereum.gasLimit })
    })
  })

  describe('create', () => {
    let transactionHash
    let transactionReceipt

    it('should reject unregistered codeHash', () => {
      return multiprox.create.q(contracts.Ticker.codeHash, {
        gas: chaithereum.gasLimit
      }).should.be.rejectedWith(Error)
    })

    it('should be fulfilled', () => {
      return multiprox.create.q(contracts.Simple.codeHash, {
        gas: chaithereum.gasLimit
      }).then((_transactionHash) => {
        transactionHash = _transactionHash
      }).should.be.fulfilled
    })

    it('should get transaction receipt', () => {
      return chaithereum.web3.eth.getTransactionReceipt.q(transactionHash).then((_transactionReceipt) => {
        transactionReceipt = _transactionReceipt
      })
    })

    it('transaction receipt should have right sender', () => {
      parseTransactionReceipt(transactionReceipt).sender.should.equal(
        chaithereum.account
      )
    })

    it('transaction receipt should have right code hash', () => {
      parseTransactionReceipt(transactionReceipt).codeHash.should.equal(
        chaithereum.web3.sha3(contracts.Simple.bytecode, { encoding: 'hex' })
      )
    })

    it('transaction receipt should have right code at addr', () => {
      return chaithereum.web3.eth.getCode.q(
        parseTransactionReceipt(transactionReceipt).addr
      ).should.eventually.equal(contracts.Simple.runtimeBytecode)
    })

    it('getCodeHash(addr) should be correct', () => {
      return multiprox.getCodeHash.q(
        parseTransactionReceipt(transactionReceipt).addr
      ).should.eventually.equal(contracts.Simple.codeHash)
    })
  })

  describe('createAndExecute', () => {

    const pseudoSimple = chaithereum.web3.eth.contract(contracts.Simple.abi).at(0)
    const calldatas = [
      pseudoSimple.setValue1.getData(1),
      pseudoSimple.setValue2.getData(2),
      pseudoSimple.setValue3.getData(3),
    ].map((calldata) => {
      return calldata.substr(2)
    })
    const lengths = calldatas.map((calldata) => {
      return Math.ceil(calldata.length / 2)
    })
    const calldatasConcated = '0x' + calldatas.join('')


    let transactionHash
    let transactionReceipt
    let simple

    it('should be fulfilled', () => {
      return multiprox.createAndExecute.q(
        contracts.Simple.codeHash,
        lengths,
        calldatasConcated,
        {
          gas: chaithereum.gasLimit
        }).then((_transactionHash) => {
          transactionHash = _transactionHash
        }).should.be.fulfilled
    })

    it('should get transaction receipt', () => {
      return chaithereum.web3.eth.getTransactionReceipt.q(transactionHash).then((_transactionReceipt) => {
        transactionReceipt = _transactionReceipt
        simple = chaithereum.web3.eth.contract(contracts.Simple.abi).at(
          parseTransactionReceipt(transactionReceipt).addr
        )
      })
    })

    it('transaction receipt should have right sender', () => {
      parseTransactionReceipt(transactionReceipt).sender.should.equal(
        chaithereum.account
      )
    })

    it('transaction receipt should have right code hash', () => {
      parseTransactionReceipt(transactionReceipt).codeHash.should.equal(
        chaithereum.web3.sha3(contracts.Simple.bytecode, { encoding: 'hex' })
      )
    })

    it('transaction receipt should have right code at addr', () => {
      return chaithereum.web3.eth.getCode.q(
        parseTransactionReceipt(transactionReceipt).addr
      ).should.eventually.equal(contracts.Simple.runtimeBytecode)
    })

    it('getCodeHash(addr) should be correct', () => {
      return multiprox.getCodeHash.q(
        parseTransactionReceipt(transactionReceipt).addr
      ).should.eventually.equal(contracts.Simple.codeHash)
    })

    describe('Simple', () => {
      it('should have value1 of 1', () => {
        return simple.value1.q().should.eventually.bignumber.equal(1)
      })

      it('should have value2 of 2', () => {
        return simple.value2.q().should.eventually.bignumber.equal(2)
      })

      it('should have value3 of 3', () => {
        return simple.value3.q().should.eventually.bignumber.equal(3)
      })
    })
  })

})
