pragma solidity ^0.4.4;

import "ownable.sol";
import "Store.sol";

contract StoreReg is ownable {
  mapping(address => address[]) created;
	address[] registeredAddrsArray;
	mapping(address=>bool) registeredAddrsMap;

	address public infosphereAddr;
	address public aliasRegAddr;
	address public orderRegAddr;

	event Registration(address storeAddr);

	function setInfosphereAddr(address _infosphereAddr) requireOwnership {
		infosphereAddr = _infosphereAddr;
	}

	function setAliasRegAddr(address _aliasRegAddr) requireOwnership {
		aliasRegAddr = _aliasRegAddr;
	}

	function setOrderRegAddr(address _orderRegAddr) requireOwnership {
		orderRegAddr = _orderRegAddr;
	}

	function create(
		address owner,
		bool isOpen,
		bytes32 currency,
		uint bufferCentiperun,
		uint disputeSeconds,
		uint minProductsTeratotal,
		uint affiliateFeeCentiperun,
		bytes32 fileHash,
		bytes32 alias,
		bytes32[] productParams,
		bytes32[] transportParams,
		bytes32[] approvedSubmarkets
	 ) {

		var store = new Store(
			productParams,
			transportParams,
			approvedSubmarkets
		);

		var storeAddr = address(store);

		store.setOrderReg(orderRegAddr);
		store.setInfosphere(infosphereAddr);
		store.setAliasReg(aliasRegAddr);

		store.setBool('isOpen',isOpen);
		store.setBytes32('currency',currency);
		store.setUint('bufferCentiperun',bufferCentiperun);
		store.setUint('disputeSeconds',disputeSeconds);
		store.setUint('minProductsTeratotal',minProductsTeratotal);
		store.setUint('affiliateFeeCentiperun',affiliateFeeCentiperun);
		store.setBytes32('fileHash', fileHash);

		if(alias!='')
			store.setAlias(alias);

		store.setOwner(owner);

		registeredAddrsArray.push(storeAddr);
		registeredAddrsMap[storeAddr] = true;

    created[owner].push(storeAddr);

    Registration(storeAddr);
	}

	function getStoresLength() constant returns(uint) {
		return registeredAddrsArray.length;
	}

	function getStoreAddr(uint index) constant returns(address) {
		return registeredAddrsArray[index];
	}

  function getCreatedStoresLength(address creator) constant returns(uint) {
    return created[creator].length;
  }

  function getCreatedStoreAddr(address creator, uint index) constant returns(address) {
    return created[creator][index];
  }

	function isRegistered(address addr) constant returns(bool) {
		return registeredAddrsMap[addr];
	}
}