import "ownable.sol";
import "Submarket.sol";

contract SubmarketReg is ownable {

	address[] registeredAddrsArray;
	mapping(address=>bool) registeredAddrsMap;

	address public infosphereAddr;
	address public aliasRegAddr;

	function setInfosphereAddr(address _infosphereAddr) {
		requireOwnership();
		infosphereAddr = _infosphereAddr;
	}

	function setAliasRegAddr(address _aliasRegAddr) {
		requireOwnership();
		aliasRegAddr = _aliasRegAddr;
	}

	event Registration(address submarketAddr);

	bytes[] calls;

	function pushCall(bytes call) {
		calls.push(call);
	}

	function create(address owner, bool isOpen, bytes32 currency, uint escrowFeeTerabase, uint escrowFeeCentiperun, bytes32 fileHash, bytes32 alias) {

		var submarket = new Submarket();
		var submarketAddr = address(submarket);

		submarket.setInfosphere(infosphereAddr);
		submarket.setAliasReg(aliasRegAddr);

		submarket.setBool('isOpen',isOpen);
		submarket.setBytes32('currency',currency);
		submarket.setUint('escrowFeeTerabase',escrowFeeTerabase);
		submarket.setUint('escrowFeeCentiperun',escrowFeeCentiperun);
		submarket.setBytes32('fileHash',fileHash);

		if(alias!='')
			submarket.setAlias(alias);

		submarket.setOwner(owner);

		registeredAddrsArray.push(submarketAddr);
		registeredAddrsMap[submarketAddr] = true;

		Registration(submarketAddr);

	}

	function isRegistered(address addr) constant returns(bool) {
		return registeredAddrsMap[addr];
	}

	function getSubmarketCount() constant returns(uint) {
		return registeredAddrsArray.length;
	}

	function getSubmarketAddr(uint index) constant returns(address) {
		return registeredAddrsArray[index];
	}
}