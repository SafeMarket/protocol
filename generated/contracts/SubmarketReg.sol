pragma solidity ^0.4.4;

import "ownable.sol";
import "Submarket.sol";
import "executor.sol";

contract SubmarketReg is ownable, executor {
  mapping(address => address[]) created;
	address[] registeredAddrsArray;
	mapping(address=>bool) registeredAddrsMap;

	address public aliasRegAddr;

  event Registration(address submarketAddr);

	function SubmarketReg(address _aliasRegAddr) {
		aliasRegAddr = _aliasRegAddr;
	}

	function create(uint[] calldataLengths, bytes calldatas) {

    Submarket submarket = new Submarket();
    address submarketAddr = address(submarket);
    _execute(submarketAddr, calldataLengths, calldatas);
    submarket.setOwner(msg.sender, true);
    registeredAddrsArray.push(submarketAddr);
    registeredAddrsMap[submarketAddr] = true;

    created[msg.sender].push(submarketAddr);

    Registration(submarketAddr);

  }

  function getSubmarketCount() constant returns(uint) {
    return registeredAddrsArray.length;
  }

  function getSubmarketAddr(uint index) constant returns(address) {
    return registeredAddrsArray[index];
  }

  function getCreatedSubmarketCount(address creator) constant returns(uint) {
    return created[creator].length;
  }

  function getCreatedSubmarketAddr(address creator, uint index) constant returns(address) {
    return created[creator][index];
  }

  function isRegistered(address addr) constant returns(bool) {
    return registeredAddrsMap[addr];
  }
}
