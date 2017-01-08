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
    .q({data: contracts.Ticker.bytecode, from: params.tickerAcc})
    .should.eventually.be.contract.then((_ticker) => {
      tickerArgs.address = _ticker.address
      tickerArgs.contract = _ticker
    })
  })

  it('sets the ticker prices', () => {
    return chaithereum.web3.Q.all([
      tickerArgs.contract.setPrice.q(params.currency0, params.currencyInWei0,
        {from: params.tickerAcc}),
      tickerArgs.contract.setPrice.q(params.currency1, params.currencyInWei1,
        {from: params.tickerAcc}),
      tickerArgs.contract.setPrice.q(params.currency2, params.currencyInWei2,
        {from: params.tickerAcc}),
      tickerArgs.contract.setPrice.q(params.currency3, params.currencyInWei3,
        {from: params.tickerAcc}),
    ]).should.eventually.be.fulfilled
  })
}

function createSubmarket (submarketArgs) {
  let aliasReg
  let submarketReg

  before(() => {
    return chaithereum.web3.Q.all([
      chaithereum.web3.eth.contract(contracts.AliasReg.abi).new.q({
        data: contracts.AliasReg.bytecode,
      }).should.eventually.be.contract.then((_aliasReg) => {
        aliasReg = _aliasReg
      }),
      chaithereum.web3.eth.contract(contracts.OrderReg.abi).new.q({
        data: contracts.OrderReg.bytecode,
      }).should.eventually.be.contract.then((_orderReg) => {
        orderReg = _orderReg
      }),
    ])
  })

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.SubmarketReg.abi).new.q(
      aliasReg.address,
      { data: contracts.SubmarketReg.bytecode }
    ).should.eventually.be.contract.then((_submarketReg) => {
      submarketReg = _submarketReg
    }).should.eventually.be.fulfilled
  })

  it('should create a submarket', () => {
    const pseudoSubmarket = chaithereum.web3.eth.contract(contracts.Submarket.abi).at(0)
    const calldatas = [
      pseudoSubmarket.setIsOpen.getData(true),
      pseudoSubmarket.setCurrency.getData(params.currency1),
      pseudoSubmarket.setEscrowFeeTerabase.getData(params.escrowFeeTerabase1),
      pseudoSubmarket.setEscrowFeeCentiperun.getData(params.escrowFeeCentiperun1),
      pseudoSubmarket.setFileHash.getData(params.fileHash1),
      pseudoSubmarket.setAlias.getData(params.alias2),
    ].map((calldata) => {
      return calldata.replace('0x', '')
    })
    const lengths = calldatas.map((calldata) => { return Math.ceil(calldata.length / 2) })

    return submarketReg.create.q(
      lengths,
      `0x${calldatas.join('')}`,
      { from: params.submarketAcc }
    ).should.eventually.be.fulfilled
  })

  it('should make the submarket address a contract', (done) => {
    return submarketReg.getCreatedSubmarketAddr.q(params.submarketAcc, 0)
    .then((_submarketAddr) => {
      submarketArgs.address = _submarketAddr
      submarketArgs.contract = chaithereum.web3.eth
      .contract(contracts.Submarket.abi).at(_submarketAddr)
      submarket = submarketArgs.contract
      submarketArgs.contract.should.be.contract
      done();
    })
  })
}

function createStore (storeArgs) {
  let aliasReg
  let orderReg
  let storeReg

  before(() => {
    return chaithereum.web3.Q.all([
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
    return chaithereum.web3.eth.contract(contracts.StoreReg.abi).new.q(
      aliasReg.address,
      { data: contracts.StoreReg.bytecode }
    ).should.eventually.be.contract.then((_storeReg) => {
      storeReg = _storeReg
    }).should.be.fulfilled
  })

  it('successfully creates a new Store', () => {
    const pseudoStore = chaithereum.web3.eth.contract(contracts.Store.abi).at(0)
    const calldatas = [
      pseudoStore.setCurrency.getData(params.currency1),
      pseudoStore.setBufferCentiperun.getData(params.bufferCentiperun1),
      pseudoStore.setDisputeSeconds.getData(params.disputeSeconds1),
      pseudoStore.setMinProductsTeratotal.getData(params.minProductsTeratotal1),
      pseudoStore.setAffiliateFeeCentiperun.getData(params.affiliateFeeCentiperun1),
      pseudoStore.setFileHash.getData(params.fileHash0),
      pseudoStore.setAlias.getData(params.alias1),
      pseudoStore.addProduct.getData(true, params.teraprice1, params.units1, params.fileHash1),
      pseudoStore.addProduct.getData(false, params.teraprice2, params.units2, params.fileHash2),
      pseudoStore.addTransport.getData(true, params.teraprice3, params.fileHash3),
      pseudoStore.addTransport.getData(false, params.teraprice4, params.fileHash4),
      pseudoStore.approveAlias.getData(params.alias1),
      pseudoStore.approveAlias.getData(params.alias2),
    ].map((calldata) => {
      return calldata.replace('0x', '')
    })
    const lengths = calldatas.map((calldata) => { return Math.ceil(calldata.length / 2) })

    return storeReg.create.q(lengths, `0x${calldatas.join('')}`).should.be.fulfilled
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
        storeArgs.contract.setIsOpen.q(true).should.eventually.be.fulfilled,
        storeArgs.contract.setProductIsActive.q(0, true).should.eventually.be.fulfilled,
        storeArgs.contract.setProductIsActive.q(1, true).should.eventually.be.fulfilled,
        storeArgs.contract.setMinProductsTeratotal.q(params.minProductsTeratotal1)
        .should.eventually.be.fulfilled,
        storeArgs.contract.setTransportIsActive.q(0, true).should.eventually.be.fulfilled,
        storeArgs.contract.setTransportIsActive.q(1, true).should.eventually.be.fulfilled,
      ])
    })

    after('creation succeeds', () => {
      return order.create.q(
        params.buyerAcc,
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
        storeArgs.contract.setIsOpen.q(true).should.eventually.be.fulfilled,
        storeArgs.contract.setProductIsActive.q(0, true).should.eventually.be.fulfilled,
        storeArgs.contract.setProductIsActive.q(1, true).should.eventually.be.fulfilled,
        storeArgs.contract.setTransportIsActive.q(0, true).should.eventually.be.fulfilled,
        storeArgs.contract.setTransportIsActive.q(1, true).should.eventually.be.fulfilled,
      ])
    })

    context('with a closed store', () => {
      before(() => {
        return storeArgs.contract.setIsOpen.q(false).should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          params.buyerAcc,
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
        return storeArgs.contract.setIsOpen.q(true).should.eventually.be.fulfilled
      })
    })

    context('with inactive product', () => {
      before(() => {
        return storeArgs.contract.setProductIsActive.q(1, false).should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          params.buyerAcc,
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
        return storeArgs.contract.setMinProductsTeratotal.q(params.minProductsTeratotal2)
        .should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          params.buyerAcc,
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
        return storeArgs.contract.setMinProductsTeratotal.q(params.minProductsTeratotal1)
        .should.eventually.be.fulfilled
      })
    })

    context('with an inactive transport', () => {
      before(() => {
        return storeArgs.contract.setTransportIsActive.q(1, false).should.eventually.be.fulfilled
      })

      specify('creation fails', () => {
        return order.create.q(
          params.buyerAcc,
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
          params.buyerAcc,
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
  let order
  let store
  let submarket

  it('gets the order from the arguments', () => {
    order = orderArgs.contract
    store = storeArgs.contract
    submarket = submarketArgs.contract
  })

  describe('state', () => {
    it('should have the correct products', () => {
      return chaithereum.web3.Q.all([
        order.getProductsLength.q().should.eventually.be.bignumber.equal(2),
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
      return order.status.q().should.eventually.be.bignumber.equal(params.status.initialized);
    })
  })

  describe('processing and status updates', () => {
    createOrder(orderArgs, storeArgs, submarketArgs, tickerArgs)
    context('when the order gets canceled', () =>{
      let order
      let value = Math.pow(10, 10);
      let balance;
      before((done) => {
        order = orderArgs.contract
        chaithereum.web3.eth.sendTransaction
        .q({from: params.buyerAcc, to: order.address, value: value, gas: 500000})
        .should.eventually.be.fulfilled.then(() => {
          chaithereum.web3.eth.getBalance.q(params.buyerAcc).then((_balance) => {
            balance = _balance
            done()
          })
        })
      })

      specify('randos cannot cancel the order', () => {
        return order.cancel.q({from: params.tickerAcc}).should.eventually.be.rejected
      })

      specify('the store owner can cancel the order', () => {
        return order.cancel.q({from: params.buyerAcc}).should.eventually.be.fulfilled
      })

      it('should have returned the funds', () => {
        return chaithereum.web3.eth.getBalance.q(params.buyerAcc)
        .should.eventually.be.bignumber.then((_balance) =>{
          let sigpow = Math.pow(10, 7)
          _balance.div(sigpow).toFixed(0).should.equal(balance.plus(value).div(sigpow).toFixed(0))
        })
      })

      it('should have destroyed the contract', () => {
        //TODO: check that the contract does not exist
      })
    })

    context('when the order gets shipped', () =>{
      let order;
      let outstandingBalance;

      function runOrderShippingTests () {
        createOrder(orderArgs, storeArgs, submarketArgs, tickerArgs)
        describe('it gets shipped alright', () => {
          let blockNumber1;
          before(() => {
            order = orderArgs.contract
          })

          specify('non store cannot ship the order', () => {
            return chaithereum.web3.Q.all([
              order.markAsShipped.q({from: params.masterAcc}),
              order.markAsShipped.q({from: params.buyerAcc}),
              order.markAsShipped.q({from: params.randomAcc1}),
            ]).should.eventually.be.rejected
          })

          specify('the store cannot ship if payment is low', () => {
            return store.markAsShipped.q(order.address, {from: params.masterAcc})
            .should.eventually.be.rejected
          })

          specify('the buyer can get how much they owe', (done) => {
            return order.getTotalTotal.q().should.eventually.be.bignumber.then((value) => {
              outstandingBalance = value;
              done();
            })
          })

          specify('the buyer can make payments', () => {
            let value = outstandingBalance.div(4).toFixed(0);
            remainderValue = outstandingBalance.minus(value * 4)

            return chaithereum.web3.Q.all([
              chaithereum.web3.eth.sendTransaction
              .q({from: params.buyerAcc, to: order.address, value: value, gas: 500000}),
              chaithereum.web3.eth.sendTransaction
              .q({from: params.buyerAcc, to: order.address, value: value, gas: 500000}),
              chaithereum.web3.eth.sendTransaction
              .q({from: params.buyerAcc, to: order.address, value: value, gas: 500000}),
              chaithereum.web3.eth.sendTransaction
              .q({from: params.buyerAcc, to: order.address, value: value, gas: 500000}),
              chaithereum.web3.eth.sendTransaction
              .q({from: params.buyerAcc, to: order.address, value: remainderValue, gas: 500000}),
            ]).should.eventually.be.fulfilled
          })

          specify('the contract should have the full payment', () => {
            return chaithereum.web3.eth.getBalance.q(order.address)
            .should.eventually.be.bignumber.equal(outstandingBalance)
          })

          specify('the buyer cannnot finalize early', () => {
            return order.finalize.q({from: params.buyerAcc})
            .should.eventually.be.rejected
          })

          specify('the store can ship the order', () => {
            return store.markAsShipped.q(order.address, {from: params.masterAcc})
            .should.eventually.be.fulfilled
            .then(() => {
              chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
                blockNumber1 = _blockNumber
              })
            })
          })

          it('should have updated the status correctly', () => {
            chaithereum.web3.Q.all([
              order.getUpdatesLength.q().should.eventually.be.bignumber.equal(1),
              order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber1),
              order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
              order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.shipped),
            ])
          })

          specify('no one can cancel the order', () => {
            return chaithereum.web3.Q.all([
              order.cancel.q({from: params.masterAcc}),
              order.cancel.q({from: params.buyerAcc}),
            ]).should.eventually.be.rejected
          })

          specify('randos cannot finalize the order', () => {
            return chaithereum.web3.Q.all([
              order.finalize.q({from: params.masterAcc}).should.eventually.be.rejected,
              order.finalize.q({from: params.submarketAcc}).should.eventually.be.rejected,
              order.finalize.q({from: params.tickerAcc}).should.eventually.be.rejected,
              order.finalize.q({from: params.randomAcc1}).should.eventually.be.rejected,
            ])
          })
        })
      }

      function runOrderCloseTests () {
        describe('it lets anyone close up', () => {

          specify('no releasees yet', () => {
            return order.isStoreAmountReleased.q().should.eventually.be.false
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

          //TODO: make sure the contract has been suicided
        })
      }

      runOrderShippingTests()
      context('then nothing fancy happens', () => {
        let blockNumber2;
        specify('the buyer can finalize', () => {
          return order.finalize.q({from: params.buyerAcc}).should.eventually.be.fulfilled
          .then(() => {
            chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
              blockNumber2 = _blockNumber
            })
          })
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(2),
            order.getUpdateBlockNumber.q(1).should.eventually.be.bignumber.equal(blockNumber2),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.finalized),
          ])
        })
      })
      runOrderCloseTests()

      runOrderShippingTests()
      context('then the buyer times out', () =>{
        let blockNumber2;

        it('waits for the dispute timeout', function () {
          return chaithereum.increaseTime(params.disputeSeconds1 + 1)
        })

        specify('anyone can finalize', () => {
          return order.finalize.q({from: params.randomAcc1}).should.eventually.be.fulfilled
          .then(() => {
            chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
              blockNumber2 = _blockNumber
            })
          })
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(2),
            order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber2),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.finalized),
          ])
        })
      })
      runOrderCloseTests()

      runOrderShippingTests()
      context('then finalized', () => {
        let blockNumber2;
        it('jacks the ticker prices', () => {
          tickerArgs.contract.setPrice.q(params.currency1, params.currencyInWei2,{
            from: params.tickerAcc
          }).should.eventually.be.fulfilled
        })

        specify('anyone can compute the payouts', () => {
          return order.computePayouts.q({from: params.randomAcc1})
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
          return order.finalize.q({from: params.buyerAcc}).should.eventually.be.rejected
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
            order.finalize.q({from: params.masterAcc}),
            order.finalize.q({from: params.submarketAcc}),
            order.finalize.q({from: params.randomAcc1}),
          ]).should.eventually.be.rejected
        })

        specify('the buyer can finalize', () => {
          return order.finalize.q({from: params.buyerAcc}).should.eventually.be.fulfilled
          .then(() => {
            chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
              blockNumber1 = _blockNumber
            })
          })
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(2),
            order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber2),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.finalized),
          ])
        })
      })
      runOrderCloseTests()

      runOrderShippingTests()
      context('then gets disputed and resolved', () =>{
        let blockNumber2;
        let blockNumber3;
        let blockNumber4;

        specify('non buyers cannot dispute the order', () => {
          return chaithereum.web3.Q.all([
            order.dispute.q({from: params.masterAcc}),
            order.dispute.q({from: params.submarketAcc}),
            order.dispute.q({from: params.randomAcc1}),
          ]).should.eventually.be.rejected
        })

        specify('the buyer can dispute', () => {
          return order.dispute.q({from: params.buyerAcc}).should.eventually.be.fulfilled
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(2),
            order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber2),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.disputed),
          ])
        })

        specify('those that aren\'t the submarket can\'t resolve the order', () => {
          return chaithereum.web3.Q.all([
            order.resolve.q(0, {from: params.masterAcc}),
            order.resolve.q(1, {from: params.buyerAcc}),
            order.resolve.q(1, {from: params.submarketAcc}),
            order.resolve.q(0.5, {from: params.randomAcc1}),
          ]).should.eventually.be.rejected
        })

        specify('the buyer cannot finalize yet', () => {
          return order.finalize.q({from: params.buyerAcc}).should.eventually.be.rejected
        })

        specify('those submarket should resolve the order', () => {
          return submarketArgs.contract.resolve
          .q(order.address, 5, {from: params.submarketAcc})
          .should.eventually.be.fulfilled
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(3),
            order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber3),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.resolved),
          ])
        })

        specify('the buyer can finalize', () => {
          return order.finalize.q({from: params.buyerAcc}).should.eventually.be.fulfilled
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(4),
            order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber4),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.finalized),
          ])
        })
      })
      runOrderCloseTests()

      runOrderShippingTests()
      context('disputed then the buyer times out', () =>{
        let blockNumber2;
        let blockNumber3;
        specify('non buyers cannot dispute the order', () => {
          return chaithereum.web3.Q.all([
            order.dispute.q({from: params.masterAcc}),
            order.dispute.q({from: params.submarketAcc}),
            order.dispute.q({from: params.randomAcc1}),
          ]).should.eventually.be.rejected
        })

        specify('the buyer can dispute', () => {
          return order.dispute.q({from: params.buyerAcc}).should.eventually.be.fulfilled
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(2),
            order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber2),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.disputed),
          ])
        })

        specify('those that aren\'t the submarket can\'t resolve the order', () => {
          return chaithereum.web3.Q.all([
            order.resolve.q(0, {from: params.masterAcc}),
            order.resolve.q(1, {from: params.buyerAcc}),
            order.resolve.q(1, {from: params.submarketAcc}),
            order.resolve.q(0.5, {from: params.randomAcc1}),
          ]).should.eventually.be.rejected
        })

        it('waits for the dispute timeout', function () {
          return chaithereum.increaseTime(params.disputeSeconds1 + 1)
        });

        specify('anyone can finalize', () => {
          return order.finalize.q({from: params.randomAcc1}).should.eventually.be.fulfilled
        })

        it('should have updated the status correctly', () => {
          chaithereum.web3.Q.all([
            order.getUpdatesLength.q().should.eventually.be.bignumber.equal(3),
            order.getUpdateBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber3),
            order.getUpdateSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
            order.getUpdateStatus.q(0).should.eventually.be.bignumber.equal(params.status.finalized),
          ])
        })
      })
      runOrderCloseTests()
    })
  })

  describe('messages', () => {
    let blockNumber1;
    let blockNumber2;
    it('should add a message', () => {
      return chaithereum.web3.Q.all([
        store.addMessage.q(order.address, params.fileHash3, {from: params.masterAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
        order.addMessage.q(params.fileHash4, {from: params.buyerAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber2 = _blockNumber
          })
        }),
      ])
    })

    it('should reject unauthorized messages', () => {
      return order.addMessage.q(params.fileHash5, {from: params.randomAcc1})
      .should.eventually.be.rejected
    })

    it('should have added the messages correctly', () => {
      chaithereum.web3.Q.all([
        order.getMessagesLength.q().should.eventually.be.bignumber.equal(2),
        order.getMessageBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber1),
        order.getMessageBlockNumber.q(1).should.eventually.be.bignumber.equal(blockNumber2),
        order.getMessageSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
        order.getMessageSender.q(1).should.eventually.be.bignumber.equal(params.buyerAcc),
        order.getMessageFileHash.q(0).should.eventually.be.bignumber.equal(params.fileHash3),
        order.getMessageFileHash.q(1).should.eventually.be.bignumber.equal(params.fileHash4),
      ])
    })
  })

  describe('leaving store reivews', () => {
    let blockNumber1;
    let blockNumber2;
    it('should add reviews', () => {
      return chaithereum.web3.Q.all([
        store.addReview.q(params.score1, params.fileHash3, {from: params.masterAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
        store.addReview.q(params.score2, params.fileHash4, {from: params.masterAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
      ])
    })

    it('fails from an unauthorized buyer', () => {
      return store.addReview.q(params.score1, params.fileHash4, {from: params.buyerAcc})
      .should.eventually.be.fulfilled
      .then(() => {
        chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
          blockNumber1 = _blockNumber
        })
      })
    })

    it('fails with an out of bounds score', () => {
      return chaithereum.web3.Q.all([
        store.addReview.q(params.score0, params.fileHash3, {from: params.masterAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
        store.addReview.q(params.score6, params.fileHash4, {from: params.masterAcc})
        .should.eventually.be.rejected
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
      ])
    })

    it('should have added the reviews correctly', () => {
      chaithereum.web3.Q.all([
        store.getReviewsLength.q().should.eventually.be.bignumber.equal(2),
        store.getReviewBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber1),
        store.getReviewBlockNumber.q(1).should.eventually.be.bignumber.equal(blockNumber2),
        store.getReviewScore.q(0).should.eventually.be.bignumber.equal(params.score1),
        store.getReviewScore.q(1).should.eventually.be.bignumber.equal(params.score2),
        store.getReviewSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
        store.getReviewSender.q(1).should.eventually.be.bignumber.equal(params.masterAcc),
        store.getReviewFileHash.q(0).should.eventually.be.ascii(params.fileHash3),
        store.getReviewFileHash.q(1).should.eventually.be.ascii(params.fileHash4),
      ])
    })
  })

  describe('leaving submarket reivews', () => {
    let blockNumber1;
    let blockNumber2;
    it('should add reviews', () => {
      return chaithereum.web3.Q.all([
        submarket.addReview.q(params.score1, params.fileHash3, {from: params.masterAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
        submarket.addReview.q(params.score2, params.fileHash4, {from: params.masterAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
      ])
    })

    it('fails from an unauthorized buyer', () => {
      return submarket.addReview.q(params.score1, params.fileHash4, {from: params.buyerAcc})
      .should.eventually.be.fulfilled
      .then(() => {
        chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
          blockNumber1 = _blockNumber
        })
      })
    })

    it('fails with an out of bounds score', () => {
      return chaithereum.web3.Q.all([
        submarket.addReview.q(params.score0, params.fileHash3, {from: params.masterAcc})
        .should.eventually.be.fulfilled
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
        submarket.addReview.q(params.score6, params.fileHash4, {from: params.masterAcc})
        .should.eventually.be.rejected
        .then(() => {
          chaithereum.web3.eth.getBlockNumber.q().then((_blockNumber) => {
            blockNumber1 = _blockNumber
          })
        }),
      ])
    })

    it('should have added the reviews correctly', () => {
      chaithereum.web3.Q.all([
        submarket.getReviewsLength.q().should.eventually.be.bignumber.equal(2),
        submarket.getReviewBlockNumber.q(0).should.eventually.be.bignumber.equal(blockNumber1),
        submarket.getReviewBlockNumber.q(1).should.eventually.be.bignumber.equal(blockNumber2),
        submarket.getReviewScore.q(0).should.eventually.be.bignumber.equal(params.score1),
        submarket.getReviewScore.q(1).should.eventually.be.bignumber.equal(params.score2),
        submarket.getReviewSender.q(0).should.eventually.be.bignumber.equal(params.masterAcc),
        submarket.getReviewSender.q(1).should.eventually.be.bignumber.equal(params.masterAcc),
        submarket.getReviewFileHash.q(0).should.eventually.be.ascii(params.fileHash3),
        submarket.getReviewFileHash.q(1).should.eventually.be.ascii(params.fileHash4),
      ])
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