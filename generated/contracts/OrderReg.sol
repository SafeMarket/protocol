pragma solidity ^0.4.4;

import "ownable.sol";
import "StoreReg.sol";
import "SubmarketReg.sol";
import "Ticker.sol";
import "Order.sol";

contract OrderReg is ownable{

  event Registration(address orderAddr);

  StoreReg public storeReg;
  SubmarketReg public submarketReg;
  Ticker public ticker;

  uint public safemarketFeeMilliperun = 30;

  address[] registeredAddrsArray;
  mapping(address=>bool) registeredAddrsMap;
  mapping(address=>address[]) addrsByStoreAddr;
  mapping(address=>address[]) addrsBySubmarketAddr;

  function OrderReg(address storeRegAddr, address submarketRegAddr, address tickerAddr) {
  	storeReg = StoreReg(storeRegAddr);
  	submarketReg = SubmarketReg(submarketRegAddr);
  	ticker = Ticker(tickerAddr);
  }

	function create(
		address buyer,
		address storeAddr,
		address submarketAddr,
		address affiliate,
    uint bounty,
		uint[] productIndexes,
		uint[] productQuantities,
		uint transportIndex,
		uint orderTotal
	) payable {

		if(!storeReg.isRegistered(storeAddr))
			throw;

		bool usesSubmarket = (submarketAddr != address(0));

		if(usesSubmarket && !submarketReg.isRegistered(submarketAddr))
			throw;

		Order order = new Order();
		address orderAddr = address(order);
		registeredAddrsArray.push(orderAddr);
		registeredAddrsMap[orderAddr] = true;

		uint safemarketFee = msg.value - orderTotal;

		if(safemarketFee <  ((orderTotal * safemarketFeeMilliperun) / 1000)) {
			throw;
		}

		order.create.value(orderTotal)(
			buyer,
			storeAddr,
			submarketAddr,
			affiliate,
      bounty,
			productIndexes,
			productQuantities,
			transportIndex,
			address(ticker)
		);

		Registration(orderAddr);

		if (usesSubmarket) {
			addrsBySubmarketAddr[submarketAddr].push(orderAddr);
		}

		addrsByStoreAddr[storeAddr].push(orderAddr);
	}

	function isRegistered(address addr) constant returns(bool) {
		return registeredAddrsMap[addr];
	}

	function getAddrsLength() constant returns(uint) {
		return registeredAddrsArray.length;
	}

	function getAddr(uint index) constant returns(address) {
		return registeredAddrsArray[index];
	}

	function getAddrsByStoreAddrLength(address storeAddr) constant returns(uint) {
		return addrsByStoreAddr[storeAddr].length;
	}

	function getAddrByStoreAddr(address storeAddr, uint index) constant returns(address) {
		return addrsByStoreAddr[storeAddr][index];
	}

	function getAddrsBySubmarketAddrLength(address storeAddr) constant returns(uint) {
		return addrsBySubmarketAddr[storeAddr].length;
	}

	function getAddrBySubmarketAddr(address storeAddr, uint index) constant returns(address) {
		return addrsBySubmarketAddr[storeAddr][index];
	}
}