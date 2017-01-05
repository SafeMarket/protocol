const fs = require('fs')
const contractsJson = fs.readFileSync('generated/contracts.json')
const contracts = JSON.parse(contractsJson).contracts

Object.keys(contracts).forEach((contractName) => {
  contracts[contractName].abi = JSON.parse(contracts[contractName].interface)
  contracts[contractName].bytecode = '0x' + contracts[contractName].bytecode
  contracts[contractName].runtimeBytecode = '0x' + contracts[contractName].runtimeBytecode
})

module.exports = contracts
