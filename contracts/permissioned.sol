import "owned.sol";

contract permissioned is owned{

	struct User{
		mapping(bytes32=>bool) actionToPermissionMap;
	}

	address[] userAddrs;
	mapping(address=>User) userMap;

	function getPermission(address addr, bytes32 action) constant returns(bool) {
    //TODO: it might be useful to add an isOwner(addr) method to owned
		if(addr==owner)
			return true;
		else
			return userMap[addr].actionToPermissionMap[action];
	}

	function getSenderPermission(bytes32 action) constant returns(bool) {
    //TODO: We probably don't want to use tx.origin
		if (getPermission(msg.sender,action) || getPermission(tx.origin,action)) {
			return true;
		} else {
			return false;
		}
	}

	function requireAddrPermission(address addr, bytes32 action) {
		if(!getPermission(addr, action))
			throw;
	}

	function requireSenderPermission(bytes32 action) {
		if(!getSenderPermission(action))
			throw;
	}

	function setPermission(address userAddr, bytes32 action, bool _permission) {
		requireSenderPermission('admin.setpermission');
		userMap[userAddr].actionToPermissionMap[action] = _permission;
	}

}