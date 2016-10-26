import "ownable.sol";
//TODO: merge this contract with aliasable
//or make it use AliasReg in some way
contract approvesAliases is ownable{

  bytes32[] _approvedAliases;
  mapping (bytes32 => bool) _isApprovedMap;
  mapping (bytes32 => bool) _isAddedMap;

  function approveAlias(bytes32 alias) {
    requireOwnership();

    if(_isApprovedMap[alias]) {
      return;
    }

    if(!_isAddedMap[alias]) {
      _isAddedMap[alias] = true;
      _approvedAliases.push(alias);
    }

    _isApprovedMap[alias] = true;
  }

  function approveAliases(bytes32[] aliases) {
    for (uint i = 0; i < aliases.length; i++) {
      approveAlias(aliases[i]);
    }
  }

  function disapproveAlias(bytes32 alias) {
    requireOwnership();
    _isApprovedMap[alias] = false;
  }

  function getIsAliasApproved(bytes32 alias) constant returns (bool) {
    return _isApprovedMap[alias];
  }

  function getApprovedAliasesLength() constant returns (uint) {
    return _approvedAliases.length;
  }

  function getApprovedAlias(uint index) constant returns (bytes32) {
    return _approvedAliases[index];
  }
}