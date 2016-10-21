contract ownable {

	address public owner;

	function ownable() {
		owner = msg.sender;
	}

	function requireOwnership() {
    //bad! remove tx.origin
		if(msg.sender!=owner && tx.origin!=owner) throw;
	}

	function setOwner(address _owner) {
		requireOwnership();
		owner = _owner;
	}

  function getOwner() constant returns (address) {
    return owner;
  }
}