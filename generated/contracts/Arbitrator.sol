pragma solidity ^0.4.6;

import "ownable.sol";
import "executor.sol";

contract Arbitrator is ownable, executor {

  function () payable {}

  bool public isOpen;
  function set_isOpen(bool _isOpen) require_isOwner(msg.sender) { isOpen = _isOpen; }
  bytes4 public currency;
  function set_currency(bytes4 _currency) require_isOwner(msg.sender) { currency = _currency; }
  uint256 public feeTerabase;
  function set_feeTerabase(uint256 _feeTerabase) require_isOwner(msg.sender) { feeTerabase = _feeTerabase; }
  uint256 public feePicoperun;
  function set_feePicoperun(uint256 _feePicoperun) require_isOwner(msg.sender) { feePicoperun = _feePicoperun; }
  bytes public metaMultihash;
  function set_metaMultihash(bytes _metaMultihash) require_isOwner(msg.sender) { metaMultihash = _metaMultihash; }

  /* START approvedStoreAlias unique array */
  
  bytes32[] public approvedStoreAlias_array;
  mapping(bytes32 => bool) public approvedStoreAlias_map;
  
  function get_approvedStoreAlias_array_length() constant returns (uint256) {
    return approvedStoreAlias_array.length;
  }
  
  function add_approvedStoreAlias(bytes32 approvedStoreAlias) require_isOwner(msg.sender) {
    if (approvedStoreAlias_map[approvedStoreAlias]) {
      throw;
    }
    approvedStoreAlias_array.push(approvedStoreAlias);
    approvedStoreAlias_map[approvedStoreAlias] = true;
  }
  
  function remove_approvedStoreAlias(uint256 index, bytes32 approvedStoreAlias) require_isOwner(msg.sender) {
    if (!approvedStoreAlias_map[approvedStoreAlias]) {
      throw;
    }
    if (approvedStoreAlias_array[index] != approvedStoreAlias) {
      throw;
    }
    approvedStoreAlias_array[index] = approvedStoreAlias_array[approvedStoreAlias_array.length - 1];
    approvedStoreAlias_array.length = approvedStoreAlias_array.length - 1;
    approvedStoreAlias_map[approvedStoreAlias] = false;
  }
  
  /* END approvedStoreAlias unique array */

  function execute(address addr, uint[] calldataLengths, bytes calldatas) require_isOwner(msg.sender) {
    _execute(addr, calldataLengths, calldatas);
  }

}
