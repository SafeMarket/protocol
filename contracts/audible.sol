import "ownable.sol";
import "Forum.sol";

contract audible is ownable{

	function addComment(address forumAddr, bytes32 parentId, bytes data) {
		this.requireOwnership();
		Forum(forumAddr).addComment(parentId,data);
	}

}


//TODO: revisit this code and decide where there is another way to wirite this and
//the Forum class so the addComment function can be part of the Forum