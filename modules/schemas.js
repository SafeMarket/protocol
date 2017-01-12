function Contract(name, variables, mappings) {
  this.name = name
  this.variables = variables || []
  this.structArrays = {}
  this.mappings = mappings || []
}

Contract.prototype.addStructArray = function addStructArray(struct) {
  this.structArrays[struct.name] = struct
}
Contract.prototype.addVar = function addVar(variable) {
  this.variables[variable.name] = variable
}

function Struct(name, variables, skipAdd) {
  this.name = name
  this.variables = variables || []
  this.skipAdd = skipAdd
}

function Variable(type, name, generated) {
  this.type = type
  this.name = name
  this.generated = generated
}

function Mapping(key, value, name) {
  this.key = key
  this.value = value
  this.name = name
}

const Store = new Contract('Store', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint', 'bufferCentiperun'),
  new Variable('uint', 'disputeSeconds'),
  new Variable('uint', 'minProductsTeratotal'),
  new Variable('uint', 'affiliateFeeCentiperun'),
  new Variable('bytes', 'metaMultihash')
], [
  new Mapping('address', 'bool', 'verifiedBuyer'),
  new Mapping('address', 'uint', 'reviewIndice')
])

Store.addStructArray(new Struct('Product', [
  new Variable('bool', 'isActive'),
  new Variable('uint', 'teraprice'),
  new Variable('uint', 'units')
]))

Store.addStructArray(new Struct('Transport', [
  new Variable('bool', 'isActive'),
  new Variable('uint', 'teraprice')
]))

const Submarket = new Contract('submarket', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint', 'escrowFeeTerabase'),
  new Variable('uint', 'escrowFeeCentiperun'),
  new Variable('bytes', 'metaMultihash')
], [
  new Mapping('address', 'bool', 'verifiedBuyer'),
  new Mapping('address', 'uint', 'reviewIndice')
])

module.exports = {
  Store,
  Submarket
}
