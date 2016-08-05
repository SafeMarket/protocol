import "owned.sol";
//TODO: merge this contract with aliasable
contract approvesAliases is owned{

  bytes32[] approvedAliases;
  mapping (bytes32 => bool) isApprovedMap;

  function approveAlias(bytes32 alias) {
    requireOwnership();

    if(isApprovedMap[alias]) {
      return;
    }

    approvedAliases.push(alias);
    isApprovedMap[alias] = true;
  }

  function disapproveAlias(bytes32 alias) {
    requireOwnership();
    isApprovedMap[alias] = false;
  }

  function getIsAliasApproved(bytes32 alias) constant returns (bool) {
    return isApprovedMap[alias];
  }

  function getApprovedAliasesCount() constant returns (uint) {
    return approvedAliases.length;
  }

  function getApprovedAlias(uint index) constant returns (bytes32) {
    return approvedAliases[index];
  }
}