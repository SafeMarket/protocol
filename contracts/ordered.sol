import "owned.sol";
import "OrderReg.sol";

contract ordered is owned{

	OrderReg orderReg;
	address public orderRegAddr;
	address[] orderAddrs;

  //TODO: make sure the OrderReg can't be changed to hide orders
	function setOrderReg(address _orderRegAddr) {
		requireOwnership();
		orderReg = OrderReg(_orderRegAddr);
		orderRegAddr = _orderRegAddr;
	}

	function addOrderAddr(address orderAddr) {
		if(msg.sender != orderRegAddr)
			throw;

		orderAddrs.push(orderAddr);
	}

	function getOrderAddrsCount() constant returns (uint) {
		return orderAddrs.length;
	}

	function getOrderAddr(uint index) constant returns (address) {
		return orderAddrs[index];
	}

}