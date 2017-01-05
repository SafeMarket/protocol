const Chaithereum = require('chaithereum')
const TestRPC = require('ethereumjs-testrpc')


const gasLimit = 4000000
const chaithereum = new Chaithereum({
  provider: TestRPC.provider({
    gasLimit: 4000000,
  }),
})

chaithereum.gasLimit = gasLimit

module.exports = chaithereum
