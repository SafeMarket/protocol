pragma solidity ^0.4.6;

import "ownable.sol";

//TODO: convert Ticker to use
contract Ticker is ownable {
	mapping(bytes4 => uint) prices;

	function setPrice(bytes4 currency, uint price) requireOwnership {
		prices[currency] = price;
	}

	function getPrice(bytes4 currency) constant returns (uint) {
		return prices[currency];
	}

	function convert(uint amount, bytes4 currencyFrom, bytes4 currencyTo) constant returns(uint) {
		if(prices[currencyFrom] == 0 || prices[currencyTo] == 0)
			throw;

		return ((amount*prices[currencyFrom])/prices[currencyTo]);
	}
}