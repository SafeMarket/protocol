import "forumable.sol";
import "audible.sol";
import "infosphered.sol";
import "aliasable.sol";
import "approvesAliases.sol";
import "Order.sol";

contract Submarket is forumable, audible, infosphered, aliasable {

	function resolve(address orderAddr, uint buyerAmountCentiperun) {
		requireOwnership();
		Order(orderAddr).resolve(buyerAmountCentiperun);
	}
}