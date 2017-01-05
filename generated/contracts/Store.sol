pragma solidity ^0.4.6;

import "ownable.sol";

contract Store is ownable {

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
  
  function addProduct(
    bool _isActive, 
    uint _teraprice, 
    uint _units, 
    bytes32 _fileHash
  ) requireOwnership {
    Products.push(Product(
      _isActive, 
      _teraprice, 
      _units, 
      _fileHash
    ));
  }
  
  function getProductIsActive (uint index) constant returns (bool isActive) {
    return Products[index].isActive;
  }
  
  function setProductIsActive (uint index, bool value) requireOwnership {
    Products[index].isActive = value;
  }
  function getProductTeraprice (uint index) constant returns (uint teraprice) {
    return Products[index].teraprice;
  }
  
  function setProductTeraprice (uint index, uint value) requireOwnership {
    Products[index].teraprice = value;
  }
  function getProductUnits (uint index) constant returns (uint units) {
    return Products[index].units;
  }
  
  function setProductUnits (uint index, uint value) requireOwnership {
    Products[index].units = value;
  }
  function getProductFileHash (uint index) constant returns (bytes32 fileHash) {
    return Products[index].fileHash;
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
  
  function addTransport(
    bool _isActive, 
    uint _teraprice, 
    bytes32 _fileHash
  ) requireOwnership {
    Transports.push(Transport(
      _isActive, 
      _teraprice, 
      _fileHash
    ));
  }
  
  function getTransportIsActive (uint index) constant returns (bool isActive) {
    return Transports[index].isActive;
  }
  
  function setTransportIsActive (uint index, bool value) requireOwnership {
    Transports[index].isActive = value;
  }
  function getTransportTeraprice (uint index) constant returns (uint teraprice) {
    return Transports[index].teraprice;
  }
  
  function setTransportTeraprice (uint index, uint value) requireOwnership {
    Transports[index].teraprice = value;
  }
  function getTransportFileHash (uint index) constant returns (bytes32 fileHash) {
    return Transports[index].fileHash;
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

}
