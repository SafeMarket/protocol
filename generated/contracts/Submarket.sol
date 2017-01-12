pragma solidity ^0.4.6;

import "ownable.sol";

contract Submarket is ownable {

  function () payable {}

  bool public isOpen;
  function set_isOpen(bool _isOpen) require_isOwner(msg.sender) { isOpen = _isOpen; }
  bytes4 public currency;
  function set_currency(bytes4 _currency) require_isOwner(msg.sender) { currency = _currency; }
  uint public escrowFeeTerabase;
  function set_escrowFeeTerabase(uint _escrowFeeTerabase) require_isOwner(msg.sender) { escrowFeeTerabase = _escrowFeeTerabase; }
  uint public escrowFeeTeraperun;
  function set_escrowFeeTeraperun(uint _escrowFeeTeraperun) require_isOwner(msg.sender) { escrowFeeTeraperun = _escrowFeeTeraperun; }
  bytes public metaMultihash;
  function set_metaMultihash(bytes _metaMultihash) require_isOwner(msg.sender) { metaMultihash = _metaMultihash; }



}
