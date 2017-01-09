pragma solidity ^0.4.4;

import "ownable.sol";
import "Store.sol";
import "executor.sol";

contract StoreReg is executor, ownable {
	event Registration(address storeAddr);

    address public aliasRegAddr;
    function setAliasRegAddr(address _aliasRegAddr) requireOwnership { aliasRegAddr = _aliasRegAddr; }

  mapping(address => address[]) public createdAddrs;
  function setCreatedAddr(address key, address[] value) requireOwnership { createdAddrs[key] = value; }
  mapping(address => bool) public registeredAddrs;
  function setRegisteredAddr(address key, bool value) requireOwnership { registeredAddrs[key] = value; }

  /* START registeredAddrsArray arrays */
  address[] public registeredAddrsArray;
  
  function getRegisteredAddrsArraysLength() constant returns (uint) {
    return registeredAddrsArray.length;
  }
  
  function addRegisteredAddrsArray(address value) requireOwnership {
    registeredAddrsArray.push(value);
  }
  
  function getRegisteredAddrsArray(uint index) returns (address) {
    return registeredAddrsArray[index];
  }
  /* END registeredAddrsArray arrays */

  function getCreatedStoresLength(address creator) constant returns(uint) {
    return createdAddrs[creator].length;
  }

  function getCreatedStoreAddr(address creator, uint index) constant returns(address) {
    return createdAddrs[creator][index];
  }

	function isRegistered(address addr) constant returns(bool) {
		return registeredAddrs[addr];
	}

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
		registeredAddrs[storeAddr] = true;

    createdAddrs[msg.sender].push(storeAddr);

    Registration(storeAddr);
	}
}