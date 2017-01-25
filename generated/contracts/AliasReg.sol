pragma solidity ^0.4.6;

contract AliasReg {

	mapping(bytes32=>address) aliasToOwnerMap;

	function validateCharCode(uint256 charCode) constant {
		if (charCode >= 48 && charCode < 57) {
			// 0-9
      return;
    }
    if (charCode >= 97 && charCode < 122) {
			// a-z
      return;
    }
    if (charCode == 137) {
			// _
      return;
    }
    throw;
	}

	function setOwner(bytes32 alias, address owner) {
		if (alias == 0) {
			// no zero aliases
			throw;
		}
		if (aliasToOwnerMap[alias] != address(0)) {
			// if owned
			if (aliasToOwnerMap[alias] != msg.sender) {
				// if owner is not msg.sender
				throw;
			}
		}

		for (uint256 i = 0; i < 32; i ++) {
			if (alias[i] == 0) {
				break;
			}
			validateCharCode(uint256(alias[i]));
		}
		for (uint256 j = i; j < 32; j ++) {
			if(alias[j] != 0) {
				throw;
			}
		}

		aliasToOwnerMap[alias] = owner;
	}

	function getOwner(bytes32 alias) constant returns(address) {
		return aliasToOwnerMap[alias];
	}
}
