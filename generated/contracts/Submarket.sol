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

  // struct Review {
  //   uint blockNumber;
  //   uint8 score;
  //   address sender;
  //   bytes32 fileHash;
  // }

  // mapping(address => bool) public verfifiedBuyers;
  // mapping(address => uint) public reviewIndices;
  // Review[] public reviews;

  // function resolve(address orderAddr, uint buyerAmountCentiperun) requireOwnership {
  //   Order(orderAddr).resolve(buyerAmountCentiperun);

  //   verfifiedBuyers[Order(orderAddr)] = true;
  // }

  // function addReview(uint8 score, bytes32 fileHash) {
  //   if(verfifiedBuyers[msg.sender])
  //   throw;

  //   //TODO: magic numbers are bad, 5 should be a constant
  //   if(score > 5)
  //   throw;

  //   Review memory review;
  //   if(reviewIndices[msg.sender] == 0) {
  //     reviewIndices[msg.sender] = reviews.length;
  //     reviews.length = reviews.length+1;
  //   }

  //   review.blockNumber = block.number;
  //   review.score = score;
  //   review.fileHash = fileHash;

  //   reviews[reviewIndices[msg.sender]] = review;
  // }

  // function getReviewsLength() constant returns(uint) {
  //   return reviews.length;
  // }

  // function getReviewBlockNumber(uint index) constant returns(uint) {
  //   return reviews[index].blockNumber;
  // }

  // function getReviewSender(uint index) constant returns(address) {
  //   return reviews[index].sender;
  // }

  // function getReviewScore(uint index) constant returns(uint8) {
  //   return reviews[index].score;
  // }

  // function getReviewFileHash(uint index) constant returns(bytes32) {
  //   return reviews[index].fileHash;
  // }
}