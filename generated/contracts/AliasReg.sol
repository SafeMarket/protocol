pragma solidity ^0.4.6;

contract AliasReg {

	mapping(bytes32=>address) aliasToOwnerMap;
	mapping(address=>bytes32) ownerToAliasMap;

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

	function unregister() {
		bytes32 alias = ownerToAliasMap[msg.sender];
		aliasToOwnerMap[alias] = address(0);
		ownerToAliasMap[msg.sender] = bytes32(0);
	}

	function register(bytes32 alias) {
		if (alias == bytes32(0)) {
			throw;
		}
		if (ownerToAliasMap[msg.sender] != bytes32(0)) {
			// cannot register multiple aliases
			throw;
		}
		if (aliasToOwnerMap[alias] != address(0)) {
			throw;
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
		aliasToOwnerMap[alias] = msg.sender;
		ownerToAliasMap[msg.sender] = alias;
	}

	function getOwner(bytes32 alias) constant returns(address) {
		return aliasToOwnerMap[alias];
	}

	function getAlias(address owner) constant returns(bytes32) {
		return ownerToAliasMap[owner];
	}
}
