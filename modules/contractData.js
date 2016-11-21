function Contract(name, variables) {
    this.name
    this.variables = variables || []
    this.structArrays = {}
  }

  Contract.prototype.addStructArray = function(struct) {
    this.structArrays[struct.name] = struct
  }
  Contract.prototype.addVar = function(variable) {
    this.variables[variable.name] = variable
  }

  function Struct(name, variables) {
    this.name = name
    this.variables = variables || []
  }

  function Variable(type, name) {
    this.type = type
    this.name = name
  }

  store = new Contract('Store', [
    new Variable('bool', 'isOpen'),
    new Variable('bytes4', 'currency'),
    new Variable('uint', 'bufferCentiperun'),
    new Variable('uint', 'disputeSeconds'),
    new Variable('uint', 'minProductsTeratotal'),
    new Variable('uint', 'affiliateFeeCentiperun'),
    new Variable('bytes32', 'fileHash')
  ])

  store.addStructArray(new Struct('Product', [
    new Variable('bool', 'isActive'),
    new Variable('uint', 'teraprice'),
    new Variable('uint', 'units'),
    new Variable('bytes32', 'fileHash')
  ]))
  store.addStructArray(new Struct('Transport', [
    new Variable('bool', 'isActive'),
    new Variable('uint', 'teraprice'),
    new Variable('bytes32', 'fileHash')
  ]))

  submarket = new Contract('submarket', [
    new Variable('bool', 'isOpen'),
    new Variable('bytes4', 'currency'),
    new Variable('uint', 'escrowFeeTerabase'),
    new Variable('uint', 'escrowFeeCentiperun'),
    new Variable('bytes32', 'fileHash')
  ])

  module.exports = {
    store,
    submarket
  }