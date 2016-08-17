/*globals describe, it, before */

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')
const params = require('./testparams.js')

function toBytes32 (thing) {
  const hex = chaithereum.web3.toHex(thing)
  const hexWithout0x = hex.replace('0x', '')
  const missingZeros = '0'.repeat(66 - hex.length)
  return `0x${missingZeros}${hexWithout0x}`
}

before(() => {
  return chaithereum.promise
})

describe('order', () => {
  let tickerArgs = {}
  let storeArgs = {}
  let orderArgs = {}

  createStore(storeArgs)
  createTicker(tickerArgs)
  createOrder(orderArgs, storeArgs, tickerArgs)
  runOrderTest(orderArgs, storeArgs)
})

function createTicker (tickerArgs) {
  it('successfully creates a new Ticker', () => {
    return chaithereum.web3.eth.contract(contracts.Ticker.abi).new
    .q({ data: contracts.Ticker.bytecode })
    .should.eventually.be.contract.then((_ticker) => {
      tickerArgs.address = _ticker.address
      tickerArgs.contract = _ticker
    })
  })

  it('sets the ticker prices', () => {
    return chaithereum.web3.Q.all([
      tickerArgs.contract.setPrice.q(params.currency0, params.currencyPrice0),
      tickerArgs.contract.setPrice.q(params.currency1, params.currencyPrice1),
      tickerArgs.contract.setPrice.q(params.currency2, params.currencyPrice2),
      tickerArgs.contract.setPrice.q(params.currency3, params.currencyPrice3),
    ])
  })
}

function createStore (storeArgs) {
  let infosphere
  let aliasReg
  let orderReg
  let storeReg

  before(() => {
    return chaithereum.web3.Q.all([
      chaithereum.web3.eth.contract(contracts.Infosphere.abi).new.q({data: contracts.Infosphere.bytecode
      }).should.eventually.be.contract.then((_infosphere) => {
        infosphere = _infosphere
      }),
      chaithereum.web3.eth.contract(contracts.AliasReg.abi).new.q({data: contracts.AliasReg.bytecode
      }).should.eventually.be.contract.then((_aliasReg) => {
        aliasReg = _aliasReg
      }),
      chaithereum.web3.eth.contract(contracts.OrderReg.abi).new.q({data: contracts.OrderReg.bytecode
      }).should.eventually.be.contract.then((_orderReg) => {
        orderReg = _orderReg
      })
    ])
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.StoreReg.abi).new.q({ data: contracts.StoreReg.bytecode }).should.eventually.be.contract.then((_storeReg) => {
      storeReg = _storeReg
    })
  })

  it('should set infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      storeReg.setInfosphereAddr.q(infosphere.address).should.be.fulfilled,
      storeReg.setAliasRegAddr.q(aliasReg.address).should.be.fulfilled,
      storeReg.setOrderRegAddr.q(orderReg.address).should.be.fulfilled
    ])
  })

  it('should correctly retreive infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      storeReg.infosphereAddr.q().should.eventually.equal(infosphere.address),
      storeReg.aliasRegAddr.q().should.eventually.equal(aliasReg.address),
      storeReg.orderRegAddr.q().should.eventually.equal(orderReg.address)
    ])
  })

  it('successfully creates a new Store', () => {
    return storeReg.create.q(
      chaithereum.account,
      false,
      params.currency1,
      params.bufferCentiperun1,
      params.disputeSeconds1,
      params.minProductsTeratotal2,
      params.affiliateFeeCentiperun1,
      params.fileHash0,
      params.alias1,
      [false, params.teraprice1, params.units1, params.fileHash1, false, params.teraprice2, params.units2, params.fileHash2].map(toBytes32),
      [false, params.teraprice3, params.fileHash3, false, params.teraprice4, params.fileHash4].map(toBytes32),
      [params.alias1, params.alias2]
    ).should.be.fulfilled
  })

  it('should get the store address', () => {
    return chaithereum.web3.Q.all([
      storeReg.getStoreAddr.q().should.eventually.be.address,
      storeReg.getCreatedStoreAddr.q(chaithereum.account, 0).should.eventually.be.address,
    ])
  })

  it('should make the store address a contract', (done) => {
    return storeReg.getCreatedStoreAddr.q(chaithereum.account, 0).then((_storeAddr) => {
      storeArgs.address = _storeAddr
      storeArgs.contract = chaithereum.web3.eth.contract(contracts.Store.abi).at(_storeAddr)
      storeArgs.contract.should.be.contract
      done()
    })
  })
}

function createOrder (orderArgs, storeArgs, tickerArgs) {
  let order

  it('successfully instantiates', (done) => {
    return chaithereum.web3.eth.contract(contracts.Order.abi).new.q([], [], [], { data: contracts.Order.bytecode }).should.eventually.be.contract
    .then((_order) => {
      orderArgs.address = _order.address
      orderArgs.contract = _order
      order = _order
      done()
    }).should.eventually.be.fulfilled
  })
  describe('creation process', () => {
    before('makes the store available', () => {
      return chaithereum.web3.Q.all([
        storeArgs.contract.setBool.q('isOpen', true),
        storeArgs.contract.setProductIsActive.q(0, true),
        storeArgs.contract.setProductIsActive.q(1, true),
        storeArgs.contract.setTransportIsActive.q(0, true),
        storeArgs.contract.setTransportIsActive.q(1, true),
      ]).should.eventually.be.fulfilled
    })

    context('with a closed store', () => {
      before(() => {
        return storeArgs.contract.setBool.q('isOpen', false).should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          chaithereum.accounts[1],
          storeArgs.address,
          params.address0,
          params.address0,
          [params.index0, params.index1],
          [params.quantity1, params.quantity2],
          params.index1,
          tickerArgs.address,
          {data: contracts.Order.bytecode}
        ).should.eventually.be.rejected
      })

      after(() => {
        return storeArgs.contract.setBool.q('isOpen', true).should.eventually.be.fulfilled
      })
    })

    context('with inactive product', () => {
      before(() => {
        return storeArgs.contract.setProductIsActive.q(1, false).should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          chaithereum.accounts[1],
          storeArgs.address,
          params.address0,
          params.address0,
          [params.index0, params.index1],
          [params.quantity1, params.quantity2],
          params.index1,
          tickerArgs.address,
          {data: contracts.Order.bytecode}
        ).should.eventually.be.rejected
      })

      after(() => {
        return storeArgs.contract.setProductIsActive.q(1, true).should.eventually.be.fulfilled
      })
    })

    context('with a high minProductsTeratotal', () => {
      before(() => {
        return storeArgs.contract.setUint.q('minProductsTeratotal', params.minProductsTeratotal2)
        .should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          chaithereum.accounts[1],
          storeArgs.address,
          params.address0,
          params.address0,
          [params.index0, params.index1],
          [params.quantity1, params.quantity2],
          params.index1,
          tickerArgs.address,
          {data: contracts.Order.bytecode}
        ).should.eventually.be.rejected
      })

      after(() => {
        return storeArgs.contract.setUint.q('minProductsTeratotal', params.minProductsTeratotal1)
        .should.eventually.be.fulfilled
      })
    })

    context('with an inactive transport', () => {
      before(() => {
        return storeArgs.contract.setTransportIsActive.q(1, false).should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          chaithereum.accounts[1],
          storeArgs.address,
          params.address0,
          params.address0,
          [params.index0, params.index1],
          [params.quantity1, params.quantity2],
          params.index1,
          tickerArgs.address,
          {data: contracts.Order.bytecode}
        ).should.eventually.be.rejected
      })

      after(() => {
        return storeArgs.contract.setTransportIsActive.q(1, true).should.eventually.be.fulfilled
      })
    })

    context('with a valid store', () => {
      specify('creation succeeds', () => {
        return order.create.q(
          chaithereum.accounts[1],
          storeArgs.address,
          params.address0,
          params.address0,
          [params.index0, params.index1],
          [params.quantity1, params.quantity2],
          params.index1,
          tickerArgs.address,
          {data: contracts.Order.bytecode}
        ).should.eventually.be.fulfilled
      })
    })
  })
}

function runOrderTest (orderArgs, storeArgs) {
  let order;

  it('gets the order from the arguments', () => {
    order = orderArgs.contract
    store = storeArgs.contract
  })

  describe('state', () => {
    it('should have the correct products', () => {
      return chaithereum.web3.Q.all([
        order.getProductCount.q().should.eventually.be.bignumber.equal(2),
        order.getProductIndex.q(0).should.eventually.be.bignumber.equal(params.index0),
        order.getProductTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice1),
        order.getProductFileHash.q(0).should.eventually.be.ascii(params.fileHash1),
        order.getProductQuantity.q(0).should.eventually.be.bignumber.equal(params.quantity1),
        order.getProductIndex.q(1).should.eventually.be.bignumber.equal(params.index1),
        order.getProductTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice2),
        order.getProductFileHash.q(1).should.eventually.be.ascii(params.fileHash2),
        order.getProductQuantity.q(1).should.eventually.be.bignumber.equal(params.quantity2),
      ])
    })

    it('should have the initial status', () => {
      return order.status.q().should.eventually.be.bignumber.equal(0);
    })
  })

  describe('messages', () => {
    it('should add a message', () => {
      return chaithereum.web3.Q.all([
        store.addMessage.q(order.address, params.fileHash3, {from: chaithereum.accounts[0]}).should.eventually.be.fulfilled,
        order.addMessage.q(params.fileHash4, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
      ])
    })

    it('should reject unauthorized messages', () => {
      return order.addMessage.q(params.fileHash5, {from: chaithereum.accounts[4]}).should.eventually.be.rejected
    })
  })

  describe('processing', () => {
    let value;
    let balance;
    before((done) => {
      value = Math.pow(10, 8);
      chaithereum.web3.eth.sendTransaction
      .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000})
      .should.eventually.be.fulfilled.then(() => {
        chaithereum.web3.eth.getBalance.q(chaithereum.accounts[1]).then((_balance) => {
          balance = balance
          done()
        })
      })
    })

    it('should cancel the order', () => {
      //return order.cancel.q({from: chaithereum.accounts[1]}).should.eventually.be.fulfilled
    })

    it('should have returned the funds', () => {
      return chaithereum.web3.eth.getBalance.q(chaithereum.accounts[1]).should.eventually.be.bignumber
      .then((_balance) =>{
        //TODO: shift by a few places to ignore gas costs
        //chaithereum.assert.isEqual(_balance, balance)
      })
    })
  })
}
