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

function createTicker (tickerArgs) {
  it('successfully creates a new Ticker', () => {
    return chaithereum.web3.eth.contract(contracts.Ticker.abi).new
    .q({data: contracts.Ticker.bytecode, from: chaithereum.accounts[3]})
    .should.eventually.be.contract.then((_ticker) => {
      tickerArgs.address = _ticker.address
      tickerArgs.contract = _ticker
    })
  })

  it('sets the ticker prices', () => {
    return chaithereum.web3.Q.all([
      tickerArgs.contract.setPrice.q(params.currency0, params.currencyInWei0,
        {from: chaithereum.accounts[3]}),
      tickerArgs.contract.setPrice.q(params.currency1, params.currencyInWei1,
        {from: chaithereum.accounts[3]}),
      tickerArgs.contract.setPrice.q(params.currency2, params.currencyInWei2,
        {from: chaithereum.accounts[3]}),
      tickerArgs.contract.setPrice.q(params.currency3, params.currencyInWei3,
        {from: chaithereum.accounts[3]}),
    ]).should.eventually.be.fulfilled
  })
}

function createSubmarket (submarketArgs) {
  let infosphere
  let aliasReg
  let orderReg
  let submarketReg
  let submarket

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
    return chaithereum.web3.eth.contract(contracts.SubmarketReg.abi).new.q({ data: contracts.SubmarketReg.bytecode }).should.eventually.be.contract.then((_submarketReg) => {
      submarketReg = _submarketReg
    }).should.eventually.be.fulfilled
  })

  it('should set infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      submarketReg.setInfosphereAddr.q(infosphere.address).should.be.fulfilled,
      submarketReg.setAliasRegAddr.q(aliasReg.address).should.be.fulfilled
    ])
  })

  it('should create a submarket', () => {
    return submarketReg.create.q(
      chaithereum.accounts[2],
      true,
      params.currency1,
      params.escrowFeeTerabase1,
      params.escrowFeeCentiperun1,
      params.fileHash1,
      params.alias2,
      {from: chaithereum.accounts[2]}
    ).should.eventually.be.fulfilled
  })

  it('should make the submarket address a contract', (done) => {
    return submarketReg.getCreatedSubmarketAddr.q(chaithereum.accounts[2], 0)
    .then((_submarketAddr) => {
      submarketArgs.address = _submarketAddr
      submarketArgs.contract = chaithereum.web3.eth
      .contract(contracts.Submarket.abi).at(_submarketAddr)
      submarket = submarketArgs.contract
      submarketArgs.contract.should.be.contract
      done()
    })
  })
}

function createStore (storeArgs) {
  let infosphere
  let aliasReg
  let orderReg
  let storeReg

  before(() => {
    return chaithereum.web3.Q.all([
      chaithereum.web3.eth.contract(contracts.Infosphere.abi).new
      .q({data: contracts.Infosphere.bytecode}).should.eventually.be.contract
      .then((_infosphere) => {
        infosphere = _infosphere
      }),
      chaithereum.web3.eth.contract(contracts.AliasReg.abi).new
      .q({data: contracts.AliasReg.bytecode}).should.eventually.be.contract
      .then((_aliasReg) => {
        aliasReg = _aliasReg
      }),
      chaithereum.web3.eth.contract(contracts.OrderReg.abi).new
      .q({data: contracts.OrderReg.bytecode}).should.eventually.be.contract
      .then((_orderReg) => {
        orderReg = _orderReg
      }),
    ])
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.StoreReg.abi).new
    .q({ data: contracts.StoreReg.bytecode }).should.eventually.be.contract
    .then((_storeReg) => {
      storeReg = _storeReg
    })
  })

  it('should set infosphere, alias reg, and order reg addr', () => {
    return chaithereum.web3.Q.all([
      storeReg.setInfosphereAddr.q(infosphere.address).should.be.fulfilled,
      storeReg.setAliasRegAddr.q(aliasReg.address).should.be.fulfilled,
      storeReg.setOrderRegAddr.q(orderReg.address).should.be.fulfilled,
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
      [false, params.teraprice1, params.units1, params.fileHash1,
        false, params.teraprice2, params.units2, params.fileHash2].map(toBytes32),
      [false, params.teraprice3, params.fileHash3,
        false, params.teraprice4, params.fileHash4].map(toBytes32),
      [params.alias1, params.alias2]
    ).should.be.fulfilled
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

function createOrder (orderArgs, storeArgs, submarketArgs, tickerArgs) {
  describe('reseting the order to initial state', () => {
    let order

    it('successfully instantiates', (done) => {
      return chaithereum.web3.eth.contract(contracts.Order.abi).new
      .q([], [], [], { data: contracts.Order.bytecode }).should.eventually.be.contract
      .then((_order) => {
        orderArgs.address = _order.address
        orderArgs.contract = _order
        order = _order
        done()
      }).should.eventually.be.fulfilled
    })

    before('makes the store available', () => {
      return chaithereum.web3.Q.all([
        storeArgs.contract.setBool.q('isOpen', true),
        storeArgs.contract.setProductIsActive.q(0, true),
        storeArgs.contract.setProductIsActive.q(1, true),
        storeArgs.contract.setUint.q('minProductsTeratotal', params.minProductsTeratotal1),
        storeArgs.contract.setTransportIsActive.q(0, true),
        storeArgs.contract.setTransportIsActive.q(1, true),
      ]).should.eventually.be.fulfilled
    })

    after('creation succeeds', () => {
      return order.create.q(
        chaithereum.accounts[1],
        storeArgs.address,
        submarketArgs.address,
        params.address0,
        params.bounty1,
        [params.index0, params.index1],
        [params.quantity1, params.quantity2],
        params.index1,
        tickerArgs.address,
        {data: contracts.Order.bytecode}
      ).should.eventually.be.fulfilled
    })
  })
}

function runCreateOrderTests (orderArgs, storeArgs, submarketArgs, tickerArgs) {
  let order

  it('successfully instantiates', (done) => {
    return chaithereum.web3.eth.contract(contracts.Order.abi).new
    .q([], [], [], { data: contracts.Order.bytecode }).should.eventually.be.contract
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
          params.bounty1,
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
          params.bounty1,
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
          params.bounty1,
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
          params.bounty1,
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
          params.bounty1,
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

function runOrderTests (orderArgs, storeArgs, submarketArgs, tickerArgs) {
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
        store.addMessage.q(order.address, params.fileHash3, {from: chaithereum.accounts[0]}),
        order.addMessage.q(params.fileHash4, {from: chaithereum.accounts[1]}),
      ]).should.eventually.be.fulfilled
    })

    it('should reject unauthorized messages', () => {
      return order.addMessage.q(params.fileHash5, {from: chaithereum.accounts[4]})
      .should.eventually.be.rejected
    })
  })

  describe('processing', () => {

    createOrder(orderArgs, storeArgs, submarketArgs, tickerArgs)
    context('when the order gets canceled', () =>{
      let order
      let value = Math.pow(10, 10);
      let balance;
      before((done) => {
        order = orderArgs.contract
        chaithereum.web3.eth.sendTransaction
        .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000})
        .should.eventually.be.fulfilled.then(() => {
          chaithereum.web3.eth.getBalance.q(chaithereum.accounts[1]).then((_balance) => {
            balance = _balance
            done()
          })
        })
      })

      specify('randos cannot cancel the order', () => {
        return order.cancel.q({from: chaithereum.accounts[3]}).should.eventually.be.rejected
      })

      specify('the store owner can cancel the order', () => {
        return order.cancel.q({from: chaithereum.accounts[1]}).should.eventually.be.fulfilled
      })

      it('should have returned the funds', () => {
        return chaithereum.web3.eth.getBalance.q(chaithereum.accounts[1])
        .should.eventually.be.bignumber.then((_balance) =>{
          let sigpow = Math.pow(10, 7)
          _balance.div(sigpow).toFixed(0).should.equal(balance.plus(value).div(sigpow).toFixed(0))
        })
      })
    })

    let noSubmarketArgs = {}
    noSubmarketArgs.address = params.address0
    createOrder(orderArgs, storeArgs, noSubmarketArgs, tickerArgs)
    context('when the order gets shipped then finalized', () =>{
      let order;
      let outstandingBalance;
      before(() => {
        order = orderArgs.contract
      })

      specify('non store cannot ship the order', () => {
        return chaithereum.web3.Q.all([
          order.markAsShipped.q({from: chaithereum.accounts[0]}),
          order.markAsShipped.q({from: chaithereum.accounts[1]}),
          order.markAsShipped.q({from: chaithereum.accounts[4]}),
        ]).should.eventually.be.rejected
      })

      specify('the store cannot ship if payment is low', () => {
        return store.markAsShipped.q(order.address, {from: chaithereum.accounts[0]})
        .should.eventually.be.rejected
      })

      specify('the buyer can get how much they owe', (done) => {
        return order.getTotalTotal.q().should.eventually.be.bignumber.then((value) => {
          outstandingBalance = value;
          done();
        })
      })

      specify('the buyer can make payments', () => {
        let value = outstandingBalance.div(5);
        return chaithereum.web3.Q.all([
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
        ]).should.eventually.be.fulfilled
      })

      specify('the contract should have the full payment', () => {
        return chaithereum.web3.eth.getBalance.q(order.address)
        .should.eventually.be.bignumber.equal(outstandingBalance)
      })

      specify('the buyer cannnot finalize early', () => {
        return order.finalize.q({from: chaithereum.accounts[1]})
        .should.eventually.be.rejected
      })

      specify('the store can ship the order', () => {
        return store.markAsShipped.q(order.address, {from: chaithereum.accounts[0]})
        .should.eventually.be.fulfilled
      })

      specify('no one can cancel the order', () => {
        return chaithereum.web3.Q.all([
          order.cancel.q({from: chaithereum.accounts[0]}),
          order.cancel.q({from: chaithereum.accounts[1]}),
        ]).should.eventually.be.rejected
      })

      it('jacks the ticker prices', () => {
        tickerArgs.contract.setPrice.q(params.currency1, params.currencyInWei2,
          {from: chaithereum.accounts[3]})
        .should.eventually.be.fulfilled
      })

      specify('anyone can compute the payouts', () => {
        return order.computePayouts.q({from: chaithereum.accounts[4]})
        .should.eventually.be.fulfilled
      })

      specify('the buyer did not send enough money', (done) => {
        return order.getTotalPayout.q().should.eventually.be.bignumber.then((totalPayout) => {
          outstandingBalance = totalPayout.minus(outstandingBalance)
          outstandingBalance.should.be.above(0)
          done();
        })
      })

      specify('the buyer cannot finalize if they haven\'t sent enough money ', () => {
        return order.finalize.q({from: chaithereum.accounts[1]}).should.eventually.be.rejected
      })

      specify('anyone can deposit money', () => {
        return chaithereum.web3.eth.sendTransaction.q({
          from:  chaithereum.accounts[5],
          to:    order.address,
          value: outstandingBalance,
          gas:   500000,
        }).should.eventually.be.fulfilled
      })

      specify('non buyers cannot finalize the order', () => {
        return chaithereum.web3.Q.all([
          order.finalize.q({from: chaithereum.accounts[0]}),
          order.finalize.q({from: chaithereum.accounts[2]}),
          order.finalize.q({from: chaithereum.accounts[4]}),
        ]).should.eventually.be.rejected
      })

      specify('the buyer can finalize', () => {
        return order.finalize.q({from: chaithereum.accounts[1]}).should.eventually.be.fulfilled
      })

      specify('the contract won\'t release buyer funds yet', () => {
        return order.releaseBuyerPayout.q().should.eventually.be.rejected
      })

      specify('the contract should release everyone else\'s', () => {
        return chaithereum.web3.Q.all([
          order.releaseStorePayout.q(),
          order.releaseEscrowAPayout.q(),
          order.releaseAffiliatePayout.q(),
        ]).should.eventually.be.fulfilled
      })

      specify('the contract releases buyer funds', () => {
        return order.releaseBuyerPayout.q().should.eventually.be.fulfilled
      })

      specify('the contract should have nothing', () => {
        return chaithereum.web3.eth.getBalance.q(order.address)
        .should.eventually.be.bignumber.equal(0)
      })

    })

    createOrder(orderArgs, storeArgs, submarketArgs, tickerArgs)
    context('when the order gets shipped then gets disputed and resolved', () =>{
      let order;
      let outstandingBalance;
      before(() => {
        order = orderArgs.contract
      })

      specify('non store cannot ship the order', () => {
        return chaithereum.web3.Q.all([
          order.markAsShipped.q({from: chaithereum.accounts[0]}),
          order.markAsShipped.q({from: chaithereum.accounts[1]}),
          order.markAsShipped.q({from: chaithereum.accounts[4]}),
        ]).should.eventually.be.rejected
      })

      specify('the store cannot ship if payment is low', () => {
        return store.markAsShipped.q(order.address, {from: chaithereum.accounts[0]})
        .should.eventually.be.rejected
      })

      specify('the buyer can get how much they owe', (done) => {
        return order.getTotalTotal.q().should.eventually.be.bignumber.then((value) => {
          outstandingBalance = value;
          done();
        })
      })

      specify('the buyer can make payments', () => {
        let value = outstandingBalance.div(5);
        return chaithereum.web3.Q.all([
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
          chaithereum.web3.eth.sendTransaction
          .q({from: chaithereum.accounts[1], to: order.address, value: value, gas: 500000}),
        ]).should.eventually.be.fulfilled
      })

      specify('the contract should have the full payment', () => {
        return chaithereum.web3.eth.getBalance.q(order.address)
        .should.eventually.be.bignumber.equal(outstandingBalance)
      })

      specify('the buyer cannnot finalize early', () => {
        return order.finalize.q({from: chaithereum.accounts[1]})
        .should.eventually.be.rejected
      })

      specify('the store can ship the order', () => {
        return store.markAsShipped.q(order.address, {from: chaithereum.accounts[0]})
        .should.eventually.be.fulfilled
      })

      specify('no one can cancel the order', () => {
        return chaithereum.web3.Q.all([
          order.cancel.q({from: chaithereum.accounts[0]}),
          order.cancel.q({from: chaithereum.accounts[1]}),
        ]).should.eventually.be.rejected
      })

      specify('non buyers cannot dispute the order', () => {
        return chaithereum.web3.Q.all([
          order.dispute.q({from: chaithereum.accounts[0]}),
          order.dispute.q({from: chaithereum.accounts[2]}),
          order.dispute.q({from: chaithereum.accounts[4]}),
        ]).should.eventually.be.rejected
      })

      specify('the buyer can dispute', () => {
        return order.dispute.q({from: chaithereum.accounts[1]}).should.eventually.be.fulfilled
      })

      specify('those that aren\'t the submarket can\'t resolve the order', () => {
        return chaithereum.web3.Q.all([
          order.resolve.q(0, {from: chaithereum.accounts[0]}),
          // order.resolve.q(1, {from: chaithereum.accounts[1]}),
          // order.resolve.q(1, {from: chaithereum.accounts[2]}),
          // order.resolve.q(0.5, {from: chaithereum.accounts[4]}),
        ]).should.eventually.be.rejected
      })

      specify('the buyer cannot finalize yet', () => {
        return order.finalize.q({from: chaithereum.accounts[1]}).should.eventually.be.rejected
      })

      specify('those submarket should resolve the order', () => {
        return submarketArgs.contract.resolve
        .q(order.address, 5, {from: chaithereum.accounts[2]})
        .should.eventually.be.fulfilled
      })

      specify('the buyer can finalize', () => {
        return order.finalize.q({from: chaithereum.accounts[1]}).should.eventually.be.fulfilled
      })

      specify('the contract won\'t release buyer funds yet', () => {
        return order.releaseBuyerPayout.q().should.eventually.be.rejected
      })

      specify('the contract should release everyone else\'s', () => {
        return chaithereum.web3.Q.all([
          order.releaseStorePayout.q(),
          order.releaseEscrowAPayout.q(),
          order.releaseAffiliatePayout.q(),
        ]).should.eventually.be.fulfilled
      })

      specify('the contract releases buyer funds', () => {
        return order.releaseBuyerPayout.q().should.eventually.be.fulfilled
      })

      specify('the contract should have nothing', () => {
        return chaithereum.web3.eth.getBalance.q(order.address)
        .should.eventually.be.bignumber.equal(0)
      })

    })

    createOrder(orderArgs, storeArgs, submarketArgs, tickerArgs)
    context('when the order gets shipped then the buyer times out', () =>{
      let order;
      let outstandingBalance;
      before(() => {
        order = orderArgs.contract
      })

      specify('the buyer can get how much they owe', (done) => {
        return order.getTotalTotal.q().should.eventually.be.bignumber.then((value) => {
          outstandingBalance = value;
          done();
        })
      })

      specify('the buyer can make payments', () => {
        return chaithereum.web3.eth.sendTransaction.q({
          from:  chaithereum.accounts[1],
          to:    order.address,
          value: outstandingBalance,
          gas:   500000,
        }).should.eventually.be.fulfilled
      })

      specify('the contract should have the full payment', () => {
        return chaithereum.web3.eth.getBalance.q(order.address)
        .should.eventually.be.bignumber.equal(outstandingBalance)
      })

      specify('the buyer cannnot finalize early', () => {
        return order.finalize.q({from: chaithereum.accounts[1]})
        .should.eventually.be.rejected
      })

      specify('the store can ship the order', () => {
        return store.markAsShipped.q(order.address, {from: chaithereum.accounts[0]})
        .should.eventually.be.fulfilled
      })

      it('waits for the dispute timeout', function (done) {
        this.timeout((params.disputeSeconds1 + 1) * 1001)
        setTimeout(done, (params.disputeSeconds1 + 1) * 1000);
      });

      specify('anyone can finalize', () => {
        return order.finalize.q({from: chaithereum.accounts[4]}).should.eventually.be.fulfilled
      })

      specify('the contract won\'t release buyer funds yet', () => {
        return order.releaseBuyerPayout.q().should.eventually.be.rejected
      })

      specify('the contract should release everyone else\'s', () => {
        return chaithereum.web3.Q.all([
          order.releaseStorePayout.q(),
          // order.releaseEscrowAPayout.q(),
          // order.releaseAffiliatePayout.q(),
        ]).should.eventually.be.fulfilled
      })

      specify('the contract releases buyer funds', () => {
        return order.releaseBuyerPayout.q().should.eventually.be.fulfilled
      })

      specify('the contract should have nothing', () => {
        return chaithereum.web3.eth.getBalance.q(order.address)
        .should.eventually.be.bignumber.equal(0)
      })

    })
  })
}

describe('order', () => {
  let tickerArgs = {}
  let storeArgs = {}
  let submarketArgs = {}
  let orderArgs = {}

  createStore(storeArgs)
  createSubmarket(submarketArgs)
  createTicker(tickerArgs)
  runCreateOrderTests(orderArgs, storeArgs, submarketArgs, tickerArgs)
  runOrderTests(orderArgs, storeArgs, submarketArgs, tickerArgs)
})
