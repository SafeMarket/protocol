pragma solidity ^0.4.4;

import "ownable.sol";
import "AliasReg.sol";

contract aliasable is ownable {

	AliasReg aliasReg;
  bytes32 public alias;

//TODO: make sure someone can't change the address a delete aliases
	function setAliasReg(address aliasRegAddr) requireOwnership {
		aliasReg = AliasReg(aliasRegAddr);
	}

	function setAlias(bytes32 _alias) requireOwnership {
		aliasReg.claimAlias(_alias);
    alias = _alias;
	}

}