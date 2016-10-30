import "ownable.sol";
import "Forum.sol";

contract forumable is ownable {

	Forum forum;

  //TODO: make sure someone can't change the forum and hide responses
	function setForum(address forumAddr) {
		requireOwnership();
		forum = Forum(forumAddr);
	}

  function addComment(bytes32 parentId, bytes data) {
		requireOwnership();
		forum.addComment(parentId, data);
	}
}