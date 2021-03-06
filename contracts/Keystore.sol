contract Keystore{

	mapping(address => Key) keys;

	struct Key{
		uint timestamp;
		uint8[32] byt;
	}

	function setKey(uint8[32] byt) {
		keys[msg.sender] = Key(now, byt);
	}

	function getTimestamp(address addr) constant returns(uint) {
		return keys[addr].timestamp;
	}

	function getByt(address addr) constant returns(uint8[32]) {
		return keys[addr].byt;
	}

}
