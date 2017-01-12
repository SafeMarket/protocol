function Contract(name, variables, structs) {
  this.name = name
  this.variables = variables || []
  this.structs = structs || []
}

function Struct(name, variables) {
  this.name = name
  this.variables = variables || []
  const variableTypes = variables.map((variable) => { return variable.type })

  this.arrayName = `${this.name}_array`
  this.addName = `add_${this.name}`
  this.addAbi = `${this.addName}(${variableTypes.join(',')})`
  this.getLengthName = `get_${this.arrayName}_length`
  this.getLengthAbi = `${this.getLengthName}()`

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
  new Variable('uint', 'bufferCentiperun'),
  new Variable('uint', 'disputeSeconds'),
  new Variable('uint', 'minProductsTeratotal'),
  new Variable('uint', 'affiliateFeeCentiperun'),
  new Variable('bytes', 'metaMultihash')
], [
  new Struct('Product', [
    new Variable('bool', 'isActive'),
    new Variable('uint', 'teraprice'),
    new Variable('uint', 'units')
  ]),
  new Struct('Transport', [
    new Variable('bool', 'isActive'),
    new Variable('uint', 'teraprice')
  ])
])

const Submarket = new Contract('submarket', [
  new Variable('bool', 'isOpen'),
  new Variable('bytes4', 'currency'),
  new Variable('uint', 'escrowFeeTerabase'),
  new Variable('uint', 'escrowFeeCentiperun'),
  new Variable('bytes', 'metaMultihash')
])

module.exports = {
  Store,
  Submarket
}
