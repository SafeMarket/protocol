const Chaithereum = require('chaithereum')
const TestRPC = require("ethereumjs-testrpc")
module.exports = new Chaithereum({
  provider: TestRPC.provider({
    gasLimit: 2000000
  })
})