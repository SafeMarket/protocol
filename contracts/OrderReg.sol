import "ownable.sol";
import "StoreReg.sol";
import "SubmarketReg.sol";
import "Ticker.sol";
import "Order.sol";

contract OrderReg is ownable{

  event Registration(address orderAddr);

  StoreReg storeReg;
  SubmarketReg submarketReg;
  Ticker ticker;

  uint public safemarketFeeMilliperun = 30;

  address[] registeredAddrsArray;
  mapping(address=>bool) registeredAddrsMap;
  mapping(address=>address[]) addrsByStoreAddr;
  mapping(address=>address[]) addrsBySubmarketAddr;

  //TODO: make a list of all the paths from which this function is allowed to be called
  //potentially split up these variable into separate methods
	function set(address storeRegAddr, address submarketRegAddr, address tickerAddr) {
		requireOwnership();
		storeReg = StoreReg(storeRegAddr);
		submarketReg = SubmarketReg(submarketRegAddr);
		ticker = Ticker(tickerAddr);
	}

	function create(
		address buyer,
		address storeAddr,
		address submarketAddr,
		address affiliate,
		uint[] productIndexes,
		uint[] productQuantities,
		uint transportIndex,
		uint orderTotal
	) {

		if(!storeReg.isRegistered(storeAddr))
			throw;

		bool usesSubmarket = (submarketAddr != address(0));

		if(usesSubmarket && !submarketReg.isRegistered(submarketAddr))
			throw;

		Order order = new Order();
		address orderAddr = address(order);
		registeredAddrsArray.push(orderAddr);
		registeredAddrsMap[orderAddr] = true;

		uint safemarketFee = msg.value - orderTotal;

		if(safemarketFee <  ((orderTotal * safemarketFeeMilliperun) / 1000)) {
			throw;
		}

		order.create.value(orderTotal)(
			buyer,
			storeAddr,
			submarketAddr,
			affiliate,
			0,
			productIndexes,
			productQuantities,
			transportIndex,
			address(ticker)
		);

		Registration(orderAddr);

		if (usesSubmarket) {
			addrsBySubmarketAddr[submarketAddr].push(orderAddr);
		}

		addrsByStoreAddr[storeAddr].push(orderAddr);
	}

	function isRegistered(address addr) constant returns(bool) {
		return registeredAddrsMap[addr];
	}

	function getAddrsLength() constant returns(uint) {
		return registeredAddrsArray.length;
	}

	function getAddr(uint index) constant returns(address) {
		return registeredAddrsArray[index];
	}

	function getAddrsByStoreAddrLength(address storeAddr) constant returns(uint) {
		return addrsByStoreAddr[storeAddr].length;
	}

	function getAddrByStoreAddr(address storeAddr, uint index) constant returns(address) {
		return addrsByStoreAddr[storeAddr][index];
	}

	function getAddrsBySubmarketAddrLength(address storeAddr) constant returns(uint) {
		return addrsBySubmarketAddr[storeAddr].length;
	}

	function getAddrBySubmarketAddr(address storeAddr, uint index) constant returns(address) {
		return addrsBySubmarketAddr[storeAddr][index];
	}
}