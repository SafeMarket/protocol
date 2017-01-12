function Contract(name, variables, structArrays) {
  this.name = name
  this.variables = variables || []
  this.structArrays = structArrays || []
}

function StructArray(name, variables) {
  this.name = name
  this.variables = variables || []
  const variableTypes = variables.map((variable) => { return variable.type })

  this.arrayName = `${this.name}_array`
  this.addMethodName = `add_${this.name}`
  this.addMethodAbi = `${this.addMethodName}(${variableTypes.join(',')})`
  this.getLengthMethodName = `get_${this.arrayName}_length`
  this.getLengthMethodAbi = `${this.getLengthMethodName}()`

  this.variables.forEach((variable) => {
    variable.getMethodName = `get_${this.name}_${variable.name}`
    variable.getMethodAbi = `${variable.getMethodName}(uint)`
    variable.setMethodName = `set_${this.name}_${variable.name}`
    variable.setMethodAbi = `${variable.setMethodName}(uint,${variable.type})`
  })
}

function Variable(type, name, generated) {
  this.type = type
  this.name = name
  this.getMethodName = `${this.name}`
  this.getMethodAbi = `${this.getMethodName}()`
  this.setMethodName = `set_${this.name}`
  this.setMethodAbi = `${this.setMethodName}(${this.type})`
  this.generated = generated
}

const Store = new Contract('Store', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint', 'bufferTeraperun'),
  new Variable('uint', 'disputeSeconds'),
  new Variable('uint', 'minProductsTeratotal'),
  new Variable('uint', 'affiliateFeeTeraperun'),
  new Variable('bytes', 'metaMultihash')
], [
  new StructArray('Product', [
    new Variable('bool', 'isArchived'),
    new Variable('uint', 'teraprice'),
    new Variable('uint', 'units')
  ]),
  new StructArray('Transport', [
    new Variable('bool', 'isArchived'),
    new Variable('uint', 'teraprice')
  ])
])

const Submarket = new Contract('submarket', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint', 'escrowFeeTerabase'),
  new Variable('uint', 'escrowFeeTeraperun'),
  new Variable('bytes', 'metaMultihash')
])

module.exports = {
  Store,
  Submarket
}
