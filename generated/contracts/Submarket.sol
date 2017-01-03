pragma solidity ^0.4.4;

import "forumable.sol";
import "aliasable.sol";
import "approvesAliases.sol";
import "Order.sol";

contract Submarket is forumable, aliasable {

  function () payable {}

  bool public isOpen;
  function setIsOpen(bool _isOpen) requireOwnership { isOpen = _isOpen; }
  bytes4 public currency;
  function setCurrency(bytes4 _currency) requireOwnership { currency = _currency; }
  uint public escrowFeeTerabase;
  function setEscrowFeeTerabase(uint _escrowFeeTerabase) requireOwnership { escrowFeeTerabase = _escrowFeeTerabase; }
  uint public escrowFeeCentiperun;
  function setEscrowFeeCentiperun(uint _escrowFeeCentiperun) requireOwnership { escrowFeeCentiperun = _escrowFeeCentiperun; }
  bytes32 public fileHash;
  function setFileHash(bytes32 _fileHash) requireOwnership { fileHash = _fileHash; }

  mapping(address => bool) public verifiedBuyers;
  function setVerifiedBuyer(address key, bool value) requireOwnership { verifiedBuyers[key] = value; }
  mapping(address => uint) public reviewIndices;
  function setReviewIndice(address key, uint value) requireOwnership { reviewIndices[key] = value; }

  /* START Review structs */
  
  struct Review{
    uint blockNumber;
    uint8 score;
    address sender;
    bytes32 fileHash;
  }
  
  Review[] public Reviews;
  
  function getReviewsLength() constant returns (uint) {
    return Reviews.length;
  }
  
  
  function getReviewBlockNumber (uint index) constant returns (uint blockNumber) {
    return Reviews[index].blockNumber;
  }
  
  function setReviewBlockNumber (uint index, uint value) requireOwnership {
    Reviews[index].blockNumber = value;
  }
  function getReviewScore (uint index) constant returns (uint8 score) {
    return Reviews[index].score;
  }
  
  function setReviewScore (uint index, uint8 value) requireOwnership {
    Reviews[index].score = value;
  }
  function getReviewSender (uint index) constant returns (address sender) {
    return Reviews[index].sender;
  }
  
  function setReviewSender (uint index, address value) requireOwnership {
    Reviews[index].sender = value;
  }
  function getReviewFileHash (uint index) constant returns (bytes32 fileHash) {
    return Reviews[index].fileHash;
  }
  
  function setReviewFileHash (uint index, bytes32 value) requireOwnership {
    Reviews[index].fileHash = value;
  }
  /* END Review structs */

  function resolve(address orderAddr, uint buyerAmountCentiperun) requireOwnership {
    Order(orderAddr).resolve(buyerAmountCentiperun);
    verifiedBuyers[orderAddr] = true;
  }

  function addReview(uint8 score, bytes32 fileHash) {
    if(verifiedBuyers[msg.sender])
    throw;

    //TODO: magic numbers are bad, 5 should be a constant
    if(score > 5)
    throw;

    Review memory review;
    if(reviewIndices[msg.sender] == 0) {
      reviewIndices[msg.sender] = Reviews.length;
      Reviews.length = Reviews.length+1;
    }

    review.blockNumber = block.number;
    review.score = score;
    review.fileHash = fileHash;

    Reviews[reviewIndices[msg.sender]] = review;
  }
}