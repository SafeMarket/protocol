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
  this.getMethodAbi = `${this.arrayName}(uint256)`
  this.addMethodName = `add_${this.name}`
  this.addMethodAbi = `${this.addMethodName}(${variableTypes.join(',')})`
  this.getLengthMethodName = `get_${this.arrayName}_length`
  this.getLengthMethodAbi = `${this.getLengthMethodName}()`

  this.variables.forEach((variable) => {
    variable.getMethodName = `get_${this.name}_${variable.name}`
    variable.getMethodAbi = `${variable.getMethodName}(uint256)`
    variable.setMethodName = `set_${this.name}_${variable.name}`
    variable.setMethodAbi = `${variable.setMethodName}(uint256,${variable.type})`
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
  new Variable('uint256', 'bufferPicoperun'),
  new Variable('uint256', 'disputeSeconds'),
  new Variable('uint256', 'minProductsTeratotal'),
  new Variable('uint256', 'affiliateFeePicoperun'),
  new Variable('bytes', 'metaMultihash')
], [
  new StructArray('Product', [
    new Variable('bool', 'isArchived'),
    new Variable('uint256', 'teraprice'),
    new Variable('uint256', 'units')
  ]),
  new StructArray('Transport', [
    new Variable('bool', 'isArchived'),
    new Variable('uint256', 'teraprice')
  ])
])

const Submarket = new Contract('submarket', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint256', 'escrowFeeTerabase'),
  new Variable('uint256', 'escrowFeePicoperun'),
  new Variable('bytes', 'metaMultihash')
])

module.exports = {
  Store,
  Submarket
}
