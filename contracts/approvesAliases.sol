import "ownable.sol";
//TODO: merge this contract with aliasable
//or make it use AliasReg in some way
contract approvesAliases is ownable{

  bytes32[] approvedAliases;
  mapping (bytes32 => bool) isApprovedMap;
  mapping (bytes32 => bool) isAddedMap;

  function approveAlias(bytes32 alias) {
    requireOwnership();

    if(isApprovedMap[alias]) {
      return;
    }

    if(!isAddedMap[alias]) {
      approvedAliases.push(alias);
    }

    isApprovedMap[alias] = true;
  }

  function disapproveAlias(bytes32 alias) {
    requireOwnership();
    isApprovedMap[alias] = false;
  }

  function getIsAliasApproved(bytes32 alias) constant returns (bool) {
    return isApprovedMap[alias];
  }

  function getApprovedAliasesLength() constant returns (uint) {
    return approvedAliases.length;
  }

  function getApprovedAlias(uint index) constant returns (bytes32) {
    return approvedAliases[index];
  }
}