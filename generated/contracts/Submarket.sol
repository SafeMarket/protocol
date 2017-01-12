pragma solidity ^0.4.6;

import "ownable.sol";

contract Submarket is ownable {

  function () payable {}

  bool public isOpen;
  function setIsOpen(bool _isOpen) requireOwnership { isOpen = _isOpen; }
  bytes4 public currency;
  function setCurrency(bytes4 _currency) requireOwnership { currency = _currency; }
  uint public escrowFeeTerabase;
  function setEscrowFeeTerabase(uint _escrowFeeTerabase) requireOwnership { escrowFeeTerabase = _escrowFeeTerabase; }
  uint public escrowFeeCentiperun;
  function setEscrowFeeCentiperun(uint _escrowFeeCentiperun) requireOwnership { escrowFeeCentiperun = _escrowFeeCentiperun; }
  bytes public metaMultihash;
  function setMetaMultihash(bytes _metaMultihash) requireOwnership { metaMultihash = _metaMultihash; }

  mapping(address => bool) public verifiedBuyers;
  function setVerifiedBuyer(address key, bool value) requireOwnership { verifiedBuyers[key] = value; }
  mapping(address => uint) public reviewIndices;
  function setReviewIndice(address key, uint value) requireOwnership { reviewIndices[key] = value; }


}
