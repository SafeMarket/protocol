module.exports = function parseTransactionReciept (transactionReceipt) {
  return {
    sender: '0x' + transactionReceipt.logs[0].topics[1].substr(-40),
    codeHash: transactionReceipt.logs[0].topics[2],
    addr: '0x' + transactionReceipt.logs[0].data.substr(-40),
  }
}
