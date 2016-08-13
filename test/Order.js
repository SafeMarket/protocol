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
  runOrderTest(orderArgs)
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
      tickerArgs.contract.setPrice.q(params.currency1, params.price1),
      tickerArgs.contract.setPrice.q(params.currency2, params.price2),
      tickerArgs.contract.setPrice.q(params.currency3, params.price3),
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
      chaithereum.web3.eth.contract(contracts.Infosphere.abi).new.q({
        data: contracts.Infosphere.bytecode
      }).should.eventually.be.contract.then((_infosphere) => {
        infosphere = _infosphere
      }),
      chaithereum.web3.eth.contract(contracts.AliasReg.abi).new.q({
        data: contracts.AliasReg.bytecode
      }).should.eventually.be.contract.then((_aliasReg) => {
        aliasReg = _aliasReg
      }),
      chaithereum.web3.eth.contract(contracts.OrderReg.abi).new.q({
        data: contracts.OrderReg.bytecode
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
      params.minProductsTeratotal1,
      params.affiliateFeeCentiperun1,
      params.fileHash0,
      params.alias1,
      [params.teraprice1, params.units1, params.fileHash1, params.teraprice2, params.units2, params.fileHash2].map(toBytes32),
      [params.teraprice3, params.fileHash3, params.teraprice4, params.fileHash4].map(toBytes32),
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

  it('fails to create order with a closed store', () => {
    console.log(order.create);
    return order.create.q(
      chaithereum.address,
      storeArgs.address,
      params.address0,
      params.address0,
      [params.index1, params.index2],
      [params.quantity1, params.quantity2],
      params.index1,
      tickerArgs.address,
      {
        from: chaithereum.accounts[1],
        data: contracts.Order.bytecode,
      }
    ).should.eventually.be.rejected
  })

  it('successfully instantiates with valid params', () => {
    //TODO: set store to be open
    return order.create.q(
      chaithereum.address,
      storeArgs.address,
      params.address0,
      params.address0,
      [params.index1, params.index2],
      [params.quantity1, params.quantity2],
      params.index1,
      tickerArgs.address,
      {
        from: chaithereum.accounts[1],
        data: contracts.Order.bytecode,
      }
    ).should.eventually.be.fulfilled
  })
}

function runOrderTest (args) {
  let order;

  it('gets the order from the arguments', () => {
    order = args.contract
  })

  it('should get the product correctly', () => {
    return chaithereum.web3.Q.all([
      order.getProductCount.q().should.eventually.be.bignumber.equal(2),
      order.getProductIndex.q(0).should.eventually.be.bignumber.equal(params.index1),
      order.getProductTeraprice.q(0).should.eventually.be.bignumber.equal(params.teraprice1),
      order.getProductFileHash.q(0).should.eventually.be.bignumber.equal(params.fileHash1),
      order.getProductQuantity.q(0).should.eventually.be.bignumber.equal(params.quantity1),
      order.getProductIndex.q(1).should.eventually.be.bignumber.equal(params.index2),
      order.getProductTeraprice.q(1).should.eventually.be.bignumber.equal(params.teraprice2),
      order.getProductFileHash.q(1).should.eventually.be.bignumber.equal(params.fileHash2),
      order.getProductQuantity.q(1).should.eventually.be.bignumber.equal(params.quantity2),
    ])
  })

  it('should list itself as not complete', () => {
    return order.isComplete.q().should.eventually.be.false
  })

  it('should add a message', () => {
    return chaithereum.web3.Q.all([
      order.addMessage.q(params.fileHash3, {from: chaithereum.accounts[0]}).should.eventually.be.fulfilled,
      order.addMessage.q(params.fileHash4, {from: chaithereum.accounts[1]}).should.eventually.be.fulfilled,
    ])
  })

  it('should reject unauthorized messages', () => {
    return order.addMessage.q(params.fileHash5, {from: chaithereum.accounts[4]}).should.eventually.be.rejected
  })

  it('should cancel the order', () => {

  })

}
