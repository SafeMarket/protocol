function Contract(name, variables, mappings, arrays) {
  this.name
  this.variables = variables || []
  this.mappings = mappings || []
  this.arrays = arrays || []
  this.structs = {}
  this.structArrays = {}
}

Contract.prototype.addStruct = function(struct) {
  this.structs[struct.name] = struct
}

Contract.prototype.addStructArray = function(struct) {
  this.structArrays[struct.name] = struct
}

Contract.prototype.addVar = function(variable) {
  this.variables[variable.name] = variable
}

function Array(args) {
  this.type = args.type
  this.name = args.name
}

function Struct(name, variables, skipAdd) {
  this.name = name
  this.variables = variables || []
  this.skipAdd = skipAdd
}

function Variable(args) {
  this.type = args.type
  this.name = args.name
  this.isConstant = args.isConstant
  this.value = args.value
  this.generated = args.generated
}

function Mapping(key, value, name) {
  this.key = key;
  this.value = value;
  this.name = name;
}

var Store = new Contract('Store', [
  new Variable({type: 'bool', name: 'isOpen'}),
  new Variable({type: 'bytes4', name: 'currency'}),
  new Variable({type: 'uint', name: 'bufferCentiperun'}),
  new Variable({type: 'uint', name: 'disputeSeconds'}),
  new Variable({type: 'uint', name: 'minProductsTeratotal'}),
  new Variable({type: 'uint', name: 'affiliateFeeCentiperun'}),
  new Variable({type: 'bytes32', name: 'fileHash'}),
], [
  new Mapping('address', 'bool', 'verifiedBuyer'),
  new Mapping('address', 'uint', 'reviewIndice'),
])

Store.addStructArray(new Struct('Product', [
  new Variable({type: 'bool', name: 'isActive'}),
  new Variable({type: 'uint', name: 'teraprice'}),
  new Variable({type: 'uint', name: 'units'}),
  new Variable({type: 'bytes32', name: 'fileHash'})
]))

Store.addStructArray(new Struct('Transport', [
  new Variable({type: 'bool', name: 'isActive'}),
  new Variable({type: 'uint', name: 'teraprice'}),
  new Variable({type: 'bytes32', name: 'fileHash'})
]))

Store.addStructArray(new Struct('Review', [
  new Variable({type: 'uint', name: 'blockNumber'}),
  new Variable({type: 'uint8', name: 'score'}),
  new Variable({type: 'address', name: 'sender'}),
  new Variable({type: 'bytes32', name: 'fileHash'}),
], true))

var Submarket = new Contract('submarket', [
  new Variable({type: 'bool', name: 'isOpen'}),
  new Variable({type: 'bytes4', name: 'currency'}),
  new Variable({type: 'uint', name: 'escrowFeeTerabase'}),
  new Variable({type: 'uint', name: 'escrowFeeCentiperun'}),
  new Variable({type: 'bytes32', name: 'fileHash'}),
], [
  new Mapping('address', 'bool', 'verifiedBuyer'),
  new Mapping('address', 'uint', 'reviewIndice'),
])

var StoreReg = new Contract('StoreReg', [
  new Variable({type: 'address', name: 'aliasRegAddr'}),
], [
  new Mapping('address', 'address[]', 'createdAddr'),
  new Mapping('address', 'bool', 'registeredAddr'),
], [
  new Array({type: 'address', name: 'registeredAddrsArray'}),
])

Submarket.addStructArray(new Struct('Review', [
  new Variable({type: 'uint', name: 'blockNumber', generated: true}),
  new Variable({type: 'uint8', name: 'score'}),
  new Variable({type: 'address', name: 'sender', generated: true}),
  new Variable({type: 'bytes32', name: 'fileHash'}),
], true))

var SubmarketReg = new Contract('SubmarketReg', [
  new Variable({type: 'address', name: 'aliasRegAddr'}),
], [
  new Mapping('address', 'address[]', 'createdAddr'),
  new Mapping('address', 'bool', 'registeredAddr'),
], [
  new Array({type: 'address', name: 'registeredAddrsArray'}),
])

var Order = new Contract('Order', [
  new Variable({type: 'Ticker', name: 'ticker'}),
  new Variable({type: 'bool', name: 'isCreated'}),
  new Variable({type: 'address', name: 'buyer'}),
  new Variable({type: 'address', name: 'storeAddr'}),
  new Variable({type: 'bytes4', name: 'storeCurrency'}),
  new Variable({type: 'address', name: 'submarketAddr'}),
  new Variable({type: 'bytes4', name: 'submarketCurrency'}),
  new Variable({type: 'address', name: 'affiliate'}),
  new Variable({type: 'uint', name: 'TERABASE', isConstant: true, value: 1000000000000}),
  new Variable({type: 'uint', name: 'CENTIBASE', isConstant: true, value: 100}),
  new Variable({type: 'uint', name: 'transportTeraprice'}),
  new Variable({type: 'bytes32', name: 'transportFileHash'}),
  new Variable({type: 'uint', name: 'buyerAmountCentiperun'}),
  new Variable({type: 'uint', name: 'escrowFeeTerabase'}),
  new Variable({type: 'uint', name: 'escrowFeeCentiperun'}),
  new Variable({type: 'uint', name: 'affiliateFeeCentiperun'}),
  new Variable({type: 'uint', name: 'bufferCentiperun'}),
  new Variable({type: 'uint', name: 'safemarketFee'}),
  new Variable({type: 'uint', name: 'escrowFeeTeramount'}),
  new Variable({type: 'uint', name: 'bufferTeramount'}),
  new Variable({type: 'uint', name: 'productsTeratotal'}),
  new Variable({type: 'uint', name: 'storeTeratotal'}),
  new Variable({type: 'uint', name: 'total'}),
  new Variable({type: 'uint', name: 'bounty'}),
  new Variable({type: 'bool', name: 'isStoreAmountReleased'}),
  new Variable({type: 'bool', name: 'isEscrowAmountReleased'}),
  new Variable({type: 'bool', name: 'isAffiliateAmountReleased'}),
  new Variable({type: 'uint', name: 'disputeSeconds'}),
  new Variable({type: 'uint', name: 'status'}),
  new Variable({type: 'uint', name: 'received'}),
  new Variable({type: 'uint', name: 'shippedAt'}),
  new Variable({type: 'uint', name: 'disputedAt'}),
  new Variable({type: 'uint', name: 'blockNumber'}),
  new Variable({type: 'uint', name: 'INITIALIZED', isConstant: true, value: 0}),
  new Variable({type: 'uint', name: 'SHIPPED', isConstant: true, value: 1}),
  new Variable({type: 'uint', name: 'DISPUTED', isConstant: true, value: 2}),
  new Variable({type: 'uint', name: 'RESOLVED', isConstant: true, value: 3}),
  new Variable({type: 'uint', name: 'FINALIZED', isConstant: true, value: 4}),
], [])

Order.addStructArray(new Struct('Product', [
  new Variable({type: 'uint', name: 'index'}),
  new Variable({type: 'uint', name: 'teraprice'}),
  new Variable({type: 'bytes32', name: 'fileHash'}),
  new Variable({type: 'uint', name: 'quantity'}),
]))

Order.addStruct(new Struct('Totals', [
  new Variable({type: 'uint', name: 'store'}),
  new Variable({type: 'uint', name: 'escrowBase'}),
  new Variable({type: 'uint', name: 'escrowFee'}),
  new Variable({type: 'uint', name: 'affiliate'}),
  new Variable({type: 'uint', name: 'buffer'}),
  new Variable({type: 'uint', name: 'total'}),
]))

Order.addStruct(new Struct('Payouts', [
  new Variable({type: 'uint', name: 'store'}),
  new Variable({type: 'uint', name: 'escrow'}),
  new Variable({type: 'uint', name: 'affiliate'}),
  new Variable({type: 'uint', name: 'total'}),
]))

Order.addStructArray(new Struct('Message', [
  new Variable({type: 'uint', name: 'blockNumber'}),
  new Variable({type: 'address', name: 'sender'}),
  new Variable({type: 'bytes32', name: 'fileHash'}),
]))

Order.addStructArray(new Struct('Update', [
  new Variable({type: 'uint', name: 'blockNumber'}),
  new Variable({type: 'address', name: 'sender'}),
  new Variable({type: 'uint', name: 'status'}),
]))

module.exports = {
  Store,
  StoreReg,
  Submarket,
  SubmarketReg,
  Order,
}