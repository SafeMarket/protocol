pragma solidity ^0.4.4;

import "ownable.sol";
import "Store.sol";
import "executor.sol";

contract StoreReg is executor {
  mapping(address => address[]) created;
	address[] registeredAddrsArray;
	mapping(address=>bool) registeredAddrsMap;

	event Registration(address storeAddr);

  address public aliasRegAddr;

  function StoreReg(address _aliasRegAddr) {
    aliasRegAddr = _aliasRegAddr;
  }

	function create(uint[] calldataLengths, bytes calldatas) {

		Store store = new Store();
    store.setAliasReg(aliasRegAddr);
		address storeAddr = address(store);
    _execute(storeAddr, calldataLengths, calldatas);
		store.setOwner(msg.sender);
		registeredAddrsArray.push(storeAddr);
		registeredAddrsMap[storeAddr] = true;

    created[msg.sender].push(storeAddr);

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