import "ownable.sol";
import "OrderReg.sol";

contract orderable is ownable{
	OrderReg orderReg;aa

  //TODO: make sure the OrderReg can't be changed to hide orders
	function setOrderReg(address _orderRegAddr) {
		requireOwnership();
		orderReg = OrderReg(_orderRegAddr);
	}
}