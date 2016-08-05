import "owned.sol";
import "AliasReg.sol";

contract aliasable is owned {

	AliasReg aliasReg;

//TODO: make sure someone can't change the address a delete aliases
	function setAliasReg(address aliasRegAddr) {
		requireOwnership();
		aliasReg = AliasReg(aliasRegAddr);
	}

	function setAlias(bytes32 alias) {
		requireOwnership();
		aliasReg.claimAlias(alias);
	}

}