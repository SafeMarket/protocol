function Contract(name, schemas) {
  this.name = name
  this.variables = schemas.filter((schema) => { return schema instanceof Variable })
  this.structArrays = schemas.filter((schema) => { return schema instanceof StructArray })
  this.uniqueArrays = schemas.filter((schema) => { return schema instanceof UniqueArray })
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

function Variable(type, name) {
  this.type = type
  this.name = name
  this.getMethodName = `${this.name}`
  this.getMethodAbi = `${this.getMethodName}()`
  this.setMethodName = `set_${this.name}`
  this.setMethodAbi = `${this.setMethodName}(${this.type})`
}

function UniqueArray(type, name) {
  this.type = type
  this.name = name
  this.mappingName = `${this.name}_map`
  this.arrayName = `${this.name}_array`
  this.getMethodName = `${this.arrayName}`
  this.getMethodAbi = `${this.getMethodName}(uint256)`
  this.addMethodName = `add_${this.name}`
  this.addMethodAbi = `${this.addMethodName}(${this.type})`
  this.removeMethodName = `remove_${this.name}`
  this.removeMethodAbi = `${this.removeMethodName}(uint26,${this.type})`
  this.getLengthMethodName = `get_${this.arrayName}_length`
  this.getLengthMethodAbi = `${this.getLengthMethodName}()`
}

const Store = new Contract('Store', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint256', 'bufferPicoperun'),
  new Variable('uint256', 'disputeSeconds'),
  new Variable('uint256', 'minProductsTeratotal'),
  new Variable('uint256', 'affiliateFeePicoperun'),
  new Variable('bytes', 'metaMultihash'),
  new StructArray('Product', [
    new Variable('bool', 'isArchived'),
    new Variable('uint256', 'teraprice'),
    new Variable('uint256', 'units')
  ]),
  new StructArray('Transport', [
    new Variable('bool', 'isArchived'),
    new Variable('uint256', 'teraprice')
  ]),
  new UniqueArray('bytes32', 'approvedArbitratorAlias')
])

const Arbitrator = new Contract('Arbitrator', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint256', 'feeTerabase'),
  new Variable('uint256', 'feePicoperun'),
  new Variable('bytes', 'metaMultihash'),
  new UniqueArray('bytes32', 'approvedStoreAlias')
])

module.exports = {
  Store,
  Arbitrator
}
