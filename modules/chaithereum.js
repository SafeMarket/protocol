const Chaithereum = require('chaithereum')
const TestRPC = require("ethereumjs-testrpc")
module.exports = new Chaithereum({
  gasLimit: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  provider: TestRPC.provider({
    gasLimit: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  })
})