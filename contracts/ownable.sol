contract ownable {

	address public owner;

	function ownable() {
		owner = msg.sender;
	}

	function requireOwnership() {
		if(msg.sender!=owner) throw;
	}

	function setOwner(address _owner) {
		requireOwnership();
		owner = _owner;
	}

  function getOwner() constant returns (address) {
    return owner;
  }
}