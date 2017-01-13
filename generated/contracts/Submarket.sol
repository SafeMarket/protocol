pragma solidity ^0.4.6;

import "ownable.sol";

contract Submarket is ownable {

  function () payable {}

  bool public isOpen;
  function set_isOpen(bool _isOpen) require_isOwner(msg.sender) { isOpen = _isOpen; }
  bytes4 public currency;
  function set_currency(bytes4 _currency) require_isOwner(msg.sender) { currency = _currency; }
  uint256 public escrowFeeTerabase;
  function set_escrowFeeTerabase(uint256 _escrowFeeTerabase) require_isOwner(msg.sender) { escrowFeeTerabase = _escrowFeeTerabase; }
  uint256 public escrowFeeTeraperun;
  function set_escrowFeeTeraperun(uint256 _escrowFeeTeraperun) require_isOwner(msg.sender) { escrowFeeTeraperun = _escrowFeeTeraperun; }
  bytes public metaMultihash;
  function set_metaMultihash(bytes _metaMultihash) require_isOwner(msg.sender) { metaMultihash = _metaMultihash; }



}
