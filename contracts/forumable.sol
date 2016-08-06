import "ownable.sol";
import "Forum.sol";

contract forumable is ownable{

	address public forumAddr;

	function forumable() {
		var forum = new Forum();
		forumAddr = address(forum);
	}

  //TODO: make sure someone can't change the forum and hide responses
	function setForumAddr(address _forumAddr) {
		requireOwnership();
		forumAddr = _forumAddr;
	}
}