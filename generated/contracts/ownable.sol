pragma solidity ^0.4.4;

contract ownable {

	address public owner;

	function ownable() {
		owner = msg.sender;
	}

	modifier requireOwnership {
		if(msg.sender!=owner) {
      throw;
    }
    _;
	}

	function setOwner(address _owner) requireOwnership {
		owner = _owner;
	}

  function getOwner() constant returns (address) {
    return owner;
  }
}