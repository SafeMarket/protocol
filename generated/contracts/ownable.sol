pragma solidity ^0.4.6;

contract ownable {

	mapping(address => bool) public isOwner_mapping;

	function ownable() {
		isOwner_mapping[msg.sender] = true;
	}

	modifier require_isOwner(address addr) {
		if(!get_isOwner(addr)) {
      throw;
    }
    _;
	}

	function set_isOwner(address addr, bool isOwner) require_isOwner(msg.sender) {
		isOwner_mapping[addr] = isOwner;
	}

  function get_isOwner(address addr) constant returns (bool) {
    return isOwner_mapping[addr];
  }
}
