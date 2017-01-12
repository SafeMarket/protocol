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
  bytes public metaMultihash;
  function setMetaMultihash(bytes _metaMultihash) requireOwnership { metaMultihash = _metaMultihash; }

  mapping(address => bool) public verifiedBuyers;
  function setVerifiedBuyer(address key, bool value) requireOwnership { verifiedBuyers[key] = value; }
  mapping(address => uint) public reviewIndices;
  function setReviewIndice(address key, uint value) requireOwnership { reviewIndices[key] = value; }

  /* START Product structs */
  
  struct Product{
    bool isActive;
    uint teraprice;
    uint units;
  }
  
  Product[] public Products;
  
  function getProductsLength() constant returns (uint) {
    return Products.length;
  }
  
  function addProduct(
    bool _isActive, 
    uint _teraprice, 
    uint _units
  ) requireOwnership {
    Products.push(Product(
      _isActive, 
      _teraprice, 
      _units
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
  /* END Product structs */
  /* START Transport structs */
  
  struct Transport{
    bool isActive;
    uint teraprice;
  }
  
  Transport[] public Transports;
  
  function getTransportsLength() constant returns (uint) {
    return Transports.length;
  }
  
  function addTransport(
    bool _isActive, 
    uint _teraprice
  ) requireOwnership {
    Transports.push(Transport(
      _isActive, 
      _teraprice
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
  /* END Transport structs */

}
