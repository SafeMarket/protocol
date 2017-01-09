pragma solidity ^0.4.4;

import "ownable.sol";
import "Submarket.sol";
import "executor.sol";

contract SubmarketReg is ownable, executor {
  event Registration(address submarketAddr);

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

  function getCreatedSubmarketCount(address creator) constant returns(uint) {
    return createdAddrs[creator].length;
  }

  function getCreatedSubmarketAddr(address creator, uint index) constant returns(address) {
    return createdAddrs[creator][index];
  }

  function isRegistered(address addr) constant returns(bool) {
    return registeredAddrs[addr];
  }

	function SubmarketReg(address _aliasRegAddr) {
		aliasRegAddr = _aliasRegAddr;
	}

	function create(uint[] calldataLengths, bytes calldatas) {
    Submarket submarket = new Submarket();
    submarket.setAliasReg(aliasRegAddr);
    address submarketAddr = address(submarket);
    _execute(submarketAddr, calldataLengths, calldatas);
    submarket.setOwner(msg.sender);
    registeredAddrsArray.push(submarketAddr);
    registeredAddrs[submarketAddr] = true;

    createdAddrs[msg.sender].push(submarketAddr);

    Registration(submarketAddr);

  }
}