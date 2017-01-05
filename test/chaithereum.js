const chaithereum = require('../modules/chaithereum')

before(() => {
  return chaithereum.promise
})

module.exports = chaithereum
