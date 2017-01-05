pragma solidity ^0.4.6;

contract ownable {

	mapping(address => bool) public owners;

	function ownable() {
		owners[msg.sender] = true;
	}

	modifier requireOwnership {
		if(msg.sender != address(this) && !hasOwner(msg.sender)) {
      throw;
    }
    _;
	}

	function setOwner(address addr, bool isOwner) requireOwnership {
		owners[addr] = isOwner;
	}

  function hasOwner(address addr) constant returns (bool) {
    return owners[addr];
  }
}
