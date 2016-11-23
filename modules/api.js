const contracts = require('./modules/contracts')
const api = {}

function createContractWrapper(contract){

  function ContractWrapper(){

  }

  return ContractWrapper

}

Object.keys(contracts).forEach((contractName) => {
  api[contractName] = createContractWrapper(contract)
})

function Contract() {
}

function Store() {
  console.log(this)

  this.addr = utils.isAddr(addrOrAlias) ? addrOrAlias : AliasReg.getAddr(addrOrAlias)
  this.alias = utils.getAlias(this.addr)
  this.contract = this.contractFactory.at(this.addr)
  this.infosphered = new Infosphered(this.contract, {
    isOpen: 'bool',
    currency: 'bytes32',
    bufferCentiperun: 'uint',
    disputeSeconds: 'uint',
    minProductsTeratotal: 'uint',
    affiliateFeeCentiperun: 'uint',
    fileHash: 'bytes32'
  })
  this.update()
}

Store.prototype = ApprovesAliases.prototype

Store.prototype.bytecode = Store.bytecode = contracts.Store.bytecode
Store.prototype.runtimeBytecode = Store.runtimeBytecode = utils.runtimeBytecodes.Store
Store.prototype.abi = Store.abi = contracts.Store.abi
Store.prototype.contractFactory = Store.contractFactory = web3.eth.contract(Store.abi)

Store.create = function createStore(
  owner,
  isOpen,
  currency,
  bufferCentiperun,
  disputeSeconds,
  minProductsTeratotal,
  affiliateFeeCentiperun,
  meta,
  alias,
  productsData,
  transportsData,
  approvedAliases
) {

  const file = utils.convertObjectToHex(meta)
  const aliasHex = web3.toHex(alias)
  const fileHash = utils.sha3(file, { encoding: 'hex' })
  const deferred = $q.defer()

  const filestoreCalls = filestore.getMartyrCalls([file])
  const productsFilestoreCalls = []
  const transportsFilestoreCalls = []

  const productParams = []
  const transportParams = []

  productsData.forEach((productData) => {
    const productFile = Store.getProductFile(productData)
    const productFileHash = utils.sha3(productFile)
    productsFilestoreCalls.push.apply(productsFilestoreCalls, filestore.getMartyrCalls([productFile]))
    productParams.push(
      productData.isActive,
      utils.toBytes32(productData.price.in(currency).times(constants.tera)),
      utils.toBytes32(productData.units),
      productFileHash
    )
  })

  transportsData.forEach((transportData) => {
    const transportFile = Store.getTransportFile(transportData)
    const transportFileHash = utils.sha3(transportFile)
    transportsFilestoreCalls.push.apply(transportsFilestoreCalls, filestore.getMartyrCalls([transportFile]))
    transportParams.push(
      transportData.isActive,
      utils.toBytes32(transportData.price.in(currency).times(constants.tera)),
      transportFileHash
    )
  })

  const calls = filestoreCalls
    .concat(productsFilestoreCalls)
    .concat(transportsFilestoreCalls)
    .concat([{
      address: StoreReg.address,
      data: StoreReg.create.getData(
        owner,
        isOpen,
        currency,
        bufferCentiperun,
        disputeSeconds,
        minProductsTeratotal,
        affiliateFeeCentiperun,
        fileHash,
        aliasHex,
        productParams,
        transportParams,
        approvedAliases
      )
    }])

  utils.fetchMartyrData(calls).then((martyrData) => {
    txMonitor.propose(
      'Create a New Store',
      web3.eth.sendTransaction,
      [{ data: martyrData }]
    ).then((txReciept) => {
      const contractAddress = utils.getContractAddressFromTxReceipt(txReciept)
      deferred.resolve(new Store(contractAddress))
    })
  }, (err) => {
    deferred.reject(err)
  })

  return deferred.promise

}

Store.prototype.set = function setStore(infospheredData, meta, productsData, transportsData) {

  const metaCalls = []
  const file = utils.convertObjectToHex(meta)
  const fileHash = utils.sha3(file)

  infospheredData.fileHash = fileHash

  const infospheredCalls = this.infosphered.getMartyrCalls(infospheredData)

  if (this.infosphered.data.fileHash !== fileHash) {
    metaCalls.push.apply(metaCalls, filestore.getMartyrCalls([file]))
  }

  const productCalls = this.getProductMartyrCalls(productsData)
  const transportCalls = this.getTransportMartyrCalls(transportsData)
  const allCalls = infospheredCalls.concat(metaCalls).concat(productCalls).concat(transportCalls)

  return utils.fetchMartyrData(allCalls).then((martyrData) => {
    return txMonitor.propose('Update Store', web3.eth.sendTransaction, [{
      data: martyrData,
      gas: web3.eth.estimateGas({ data: martyrData }) * 4
    }])
  })

}

Store.check = function checkStore(alias, meta) {

  utils.check({ alias: alias }, {
    alias: {
      presence: true,
      type: 'alias'
    }
  })

  utils.check(meta, {
    name: {
      presence: true,
      type: 'string'
    },
    base: {
      presence: true,
      type: 'string'
    },
    info: {
      type: 'string'
    }
  })

}

Store.estimateCreationGas = function estimateStoreCreationGas(alias, meta) {
  meta = typeof meta === 'string' ? meta : utils.convertObjectToHex(meta)

  return this.contractFactory.estimateGas(alias, meta, AliasReg.address, {
    data: Store.bytecode
  }) + AliasReg.claimAlias.estimateGas(alias)
}


Store.prototype.update = function update() {

  const deferred = $q.defer()
  const store = this
  const promises = []

  this.updatePromise = deferred.promise

  this.owner = this.contract.owner()
  this.key = new Key(this.owner)

  this.infosphered.update()
  this.currency = utils.toAscii(this.infosphered.data.currency)
  this.minProductsTotal = new Coinage(this.infosphered.data.minProductsTeratotal.div(constants.tera), this.currency)

  this.products = this.getProducts()
  this.transports = this.getTransports()
  this.approvedAliases = this.getApprovedAliases()
  this.submarkets = []

  const filestorePromise = filestore.fetchFile(this.infosphered.data.fileHash).then((file) => {
    this.file = file
    this.meta = utils.convertHexToObject(file)
    store.info = utils.sanitize(this.meta.info || '')
  })

  promises.push(filestorePromise)
  this.products.forEach((product) => {
    promises.push(product.updatePromise)
  })

  $q.all(promises).then(() => {
    deferred.resolve(store)
  }, (err) => {
    deferred.reject(err)
  })

  return deferred.promise
}

Store.prototype.getProducts = function getStoreProducts() {

  const products = []
  const productsLength = this.contract.getProductsLength()

  for (let i = 0; i < productsLength; i++) {
    products.push(new Product(this, i))
  }

  return products
}

Store.prototype.getProductMartyrCalls = function getProductMartyrCalls(productsData) {

  const calls = []

  productsData.forEach((productData) => {

    if (productData.index === undefined) {
      calls.push.apply(calls, this.getAddProductMartyrCalls(productData))
    } else {
      calls.push.apply(calls, this.getSetProductMartyrCalls(productData))
    }
  })

  return calls
}

Store.prototype.getAddProductMartyrCalls = function getAddProductMartyrCalls(productData) {

  const teraprice = productData.price.in(this.currency).times(constants.tera)
  const file = Store.getProductFile(productData)
  const fileHash = utils.sha3(file)

  return filestore.getMartyrCalls([file]).concat([{
    address: this.contract.address,
    data: this.contract.addProduct.getData(teraprice, productData.units, fileHash)
  }])

}

Store.prototype.getSetProductMartyrCalls = function getSetProductMartyrCalls(productData) {

  const product = new Product(this, productData.index)
  const teraprice = productData.price.in(this.currency).times(constants.tera)
  const file = Store.getProductFile(productData)
  const fileHash = utils.sha3(file)

  const calls = []

  if (product.isActive !== productData.isActive) {
    calls.push({
      address: this.contract.address,
      data: this.contract.setProductIsActive.getData(productData.index, productData.isActive)
    })
  }

  if (!product.teraprice.equals(teraprice)) {
    calls.push({
      address: this.contract.address,
      data: this.contract.setProductTeraprice.getData(productData.index, teraprice)
    })
  }

  if (!product.units.equals(productData.units)) {
    calls.push({
      address: this.contract.address,
      data: this.contract.setProductUnits.getData(productData.index, productData.units)
    })
  }

  if (product.fileHash !== fileHash) {
    calls.push({
      address: this.contract.address,
      data: this.contract.setProductFileHash.getData(productData.index, fileHash)
    })
    calls.push.apply(calls, filestore.getMartyrCalls([file]))
  }

  return calls

}

Store.getProductFile = function getProductFile(productData) {
  return utils.convertObjectToHex({
    name: productData.name,
    info: productData.info,
    img: productData.img
  })
}

Store.prototype.getTransports = function getStoreTransports() {

  const transports = []
  const transportsLength = this.contract.getTransportsLength()

  for (let i = 0; i < transportsLength; i++) {
    transports.push(new Transport(this, i))
  }

  return transports
}

Store.prototype.getTransportMartyrCalls = function getTransportMartyrCalls(transportsData) {

  const calls = []

  transportsData.forEach((transportData) => {

    if (transportData.index === undefined) {
      calls.push.apply(calls, this.getAddTransportMartyrCalls(transportData))
    } else {
      calls.push.apply(calls, this.getSetTransportMartyrCalls(transportData))
    }
  })

  return calls
}

Store.prototype.getAddTransportMartyrCalls = function getAddTransportMartyrCalls(transportData) {

  const teraprice = transportData.price.in(this.currency).times(constants.tera)
  const file = Store.getTransportFile(transportData)
  const fileHash = utils.sha3(file)

  return filestore.getMartyrCalls([file]).concat([{
    address: this.contract.address,
    data: this.contract.addTransport.getData(teraprice, fileHash)
  }])

}

Store.prototype.getSetTransportMartyrCalls = function getSetTransportMartyrCalls(transportData) {

  const transport = new Transport(this, transportData.index)
  const teraprice = transportData.price.in(this.currency).times(constants.tera)
  const file = Store.getTransportFile(transportData)
  const fileHash = utils.sha3(file)

  const calls = []

  if (transport.isActive !== transportData.isActive) {
    calls.push({
      address: this.contract.address,
      data: this.contract.setTransportIsActive.getData(transportData.index, transportData.isActive)
    })
  }

  if (!transport.teraprice.equals(teraprice)) {
    calls.push({
      address: this.contract.address,
      data: this.contract.setTransportTeraprice.getData(transportData.index, teraprice)
    })
  }

  if (transport.fileHash !== fileHash) {
    calls.push({
      address: this.contract.address,
      data: this.contract.setTransportFileHash.getData(transportData.index, fileHash)
    })
    calls.push.apply(calls, filestore.getMartyrCalls([file]))
  }

  return calls

}

Store.getTransportFile = function getTransportFile(transportData) {
  return utils.convertObjectToHex({
    name: transportData.name,
    to: transportData.isGlobal ? null : transportData.to
  })
}

Store.prototype.getOrders = function getOrders() {
  const orders = []

}

function Review(result, store) {
  this.data = utils.convertHexToObject(result.args.data)
  this.orderAddr = result.args.orderAddr

  const reviewData = store.contract.getReview(result.args.orderAddr)
  this.score = reviewData[0].toNumber()
  this.timestamp = reviewData[1].toNumber()
}

function Product(store, index) {
  this.store = store
  this.index = index
  this.update()
  this.quantity = 0
}

Product.prototype.update = function update() {
  const deferred = $q.defer()
  this.updatePromise = deferred.promise
  this.isActive = this.store.contract.getProductIsActive(this.index)
  this.teraprice = this.store.contract.getProductTeraprice(this.index)
  this.units = this.store.contract.getProductUnits(this.index)
  this.price = new Coinage(this.teraprice.div(constants.tera), this.store.currency)
  this.fileHash = this.store.contract.getProductFileHash(this.index)
  filestore.fetchFile(this.fileHash).then((file) => {
    this.file = file
    const data = utils.convertHexToObject(file)
    this.name = data.name
    this.info = data.info
    this.img = data.img
    deferred.resolve(this)
  })
  return deferred.promise
}

function Transport(store, index) {
  this.store = store
  this.index = index
  this.update()
  this.quantity = 0
}

Transport.prototype.update = function update() {
  const deferred = $q.defer()
  this.updatePromise = deferred.promise
  this.isActive = this.store.contract.getTransportIsActive(this.index)
  this.teraprice = this.store.contract.getTransportTeraprice(this.index)
  this.price = new Coinage(this.teraprice.div(constants.tera), this.store.currency)
  this.fileHash = this.store.contract.getTransportFileHash(this.index)
  filestore.fetchFile(this.fileHash).then((file) => {
    this.file = file
    const data = utils.convertHexToObject(file)
    this.name = data.name
    this.to = data.to
    this.isGlobal = !data.to
    deferred.resolve(this)
  })
  return this.updatePromise
}

module.exports = Store