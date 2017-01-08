pragma solidity ^0.4.4;

import "forumable.sol";
import "orderable.sol";
import "aliasable.sol";
import "approvesAliases.sol";
import "Order.sol";

contract Store is forumable, aliasable, orderable, approvesAliases {

  function () payable {}

    bool public isOpen;
    function setIsOpen(bool _isOpen) requireOwnership { isOpen = _isOpen; }
    bytes4 public currency;
    function setCurrency(bytes4 _currency) requireOwnership { currency = _currency; }
    uint public bufferCentiperun;
    function setBufferCentiperun(uint _bufferCentiperun) requireOwnership { bufferCentiperun = _bufferCentiperun; }
    uint public disputeSeconds;
    function setDisputeSeconds(uint _disputeSeconds) requireOwnership { disputeSeconds = _disputeSeconds; }
    uint public minProductsTeratotal;
    function setMinProductsTeratotal(uint _minProductsTeratotal) requireOwnership { minProductsTeratotal = _minProductsTeratotal; }
    uint public affiliateFeeCentiperun;
    function setAffiliateFeeCentiperun(uint _affiliateFeeCentiperun) requireOwnership { affiliateFeeCentiperun = _affiliateFeeCentiperun; }
    bytes32 public fileHash;
    function setFileHash(bytes32 _fileHash) requireOwnership { fileHash = _fileHash; }

  mapping(address => bool) public verifiedBuyers;
  function setVerifiedBuyer(address key, bool value) requireOwnership { verifiedBuyers[key] = value; }
  mapping(address => uint) public reviewIndices;
  function setReviewIndice(address key, uint value) requireOwnership { reviewIndices[key] = value; }

  /* START Product structs */
  
  struct Product{
    bool isActive;
    uint teraprice;
    uint units;
    bytes32 fileHash;
  }
  
  Product[] public Products;
  
  function getProductsLength() constant returns (uint) {
    return Products.length;
  }
  
  function addProduct(bool isActive, 
  uint teraprice, 
  uint units, 
  bytes32 fileHash
  ) requireOwnership {
    Products.push(Product(  isActive, 
    teraprice, 
    units, 
    fileHash
  ));
  }
  
  function getProductIsActive (uint _index) constant returns (bool isActive) {
    return Products[_index].isActive;
  }
  
  function setProductIsActive (uint index, bool value) requireOwnership {
    Products[index].isActive = value;
  }
  function getProductTeraprice (uint _index) constant returns (uint teraprice) {
    return Products[_index].teraprice;
  }
  
  function setProductTeraprice (uint index, uint value) requireOwnership {
    Products[index].teraprice = value;
  }
  function getProductUnits (uint _index) constant returns (uint units) {
    return Products[_index].units;
  }
  
  function setProductUnits (uint index, uint value) requireOwnership {
    Products[index].units = value;
  }
  function getProductFileHash (uint _index) constant returns (bytes32 fileHash) {
    return Products[_index].fileHash;
  }
  
  function setProductFileHash (uint index, bytes32 value) requireOwnership {
    Products[index].fileHash = value;
  }
  /* END Product structs */
  /* START Transport structs */
  
  struct Transport{
    bool isActive;
    uint teraprice;
    bytes32 fileHash;
  }
  
  Transport[] public Transports;
  
  function getTransportsLength() constant returns (uint) {
    return Transports.length;
  }
  
  function addTransport(bool isActive, 
  uint teraprice, 
  bytes32 fileHash
  ) requireOwnership {
    Transports.push(Transport(  isActive, 
    teraprice, 
    fileHash
  ));
  }
  
  function getTransportIsActive (uint _index) constant returns (bool isActive) {
    return Transports[_index].isActive;
  }
  
  function setTransportIsActive (uint index, bool value) requireOwnership {
    Transports[index].isActive = value;
  }
  function getTransportTeraprice (uint _index) constant returns (uint teraprice) {
    return Transports[_index].teraprice;
  }
  
  function setTransportTeraprice (uint index, uint value) requireOwnership {
    Transports[index].teraprice = value;
  }
  function getTransportFileHash (uint _index) constant returns (bytes32 fileHash) {
    return Transports[_index].fileHash;
  }
  
  function setTransportFileHash (uint index, bytes32 value) requireOwnership {
    Transports[index].fileHash = value;
  }
  /* END Transport structs */
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
  
  
  function getReviewBlockNumber (uint _index) constant returns (uint blockNumber) {
    return Reviews[_index].blockNumber;
  }
  
  function setReviewBlockNumber (uint index, uint value) requireOwnership {
    Reviews[index].blockNumber = value;
  }
  function getReviewScore (uint _index) constant returns (uint8 score) {
    return Reviews[_index].score;
  }
  
  function setReviewScore (uint index, uint8 value) requireOwnership {
    Reviews[index].score = value;
  }
  function getReviewSender (uint _index) constant returns (address sender) {
    return Reviews[_index].sender;
  }
  
  function setReviewSender (uint index, address value) requireOwnership {
    Reviews[index].sender = value;
  }
  function getReviewFileHash (uint _index) constant returns (bytes32 fileHash) {
    return Reviews[_index].fileHash;
  }
  
  function setReviewFileHash (uint index, bytes32 value) requireOwnership {
    Reviews[index].fileHash = value;
  }
  /* END Review structs */

  function restoreProductUnits(uint index, uint quantity) requireOwnership {
    Products[index].units = Products[index].units + quantity;
  }

  function depleteProductUnits(uint index, uint quantity) requireOwnership {
    if(Products[index].units < quantity) throw;
    Products[index].units = Products[index].units - quantity;
  }

  function addMessage(address orderAddr, bytes32 fileHash) requireOwnership {
    Order order = Order(orderAddr);
    order.addMessage(fileHash);
  }

  //TODO: cancel needs some tests
  function cancel(address orderAddr) requireOwnership {
    Order(orderAddr).cancel();
  }

  function markAsShipped(address orderAddr) requireOwnership {
    Order order = Order(orderAddr);

    uint productsLength = order.getProductsLength();

    for(uint i = 0; i < productsLength; i++) {
      uint index = order.getProductIndex(i);
      uint quantity = order.getProductQuantity(i);
      depleteProductUnits(index, quantity);
    }
    order.markAsShipped();
    verifiedBuyers[Order(orderAddr)] = true;
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