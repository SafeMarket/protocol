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
  
  function addProduct(bool isActive, uint teraprice, uint units, bytes32 fileHash) requireOwnership {
    Products.push(Product(isActive, teraprice, units, fileHash));
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
  
  function addTransport(bool isActive, uint teraprice, bytes32 fileHash) requireOwnership {
    Transports.push(Transport(isActive, teraprice, fileHash));
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


	// function restoreProductUnits(uint index, uint quantity) requireOwnership {
	// 	products[index].units = products[index].units + quantity;
	// }

	// function depleteProductUnits(uint index, uint quantity) requireOwnership {
	// 	if(products[index].units < quantity) throw;
	// 	products[index].units = products[index].units - quantity;
	// }

 //  function addMessage(address orderAddr, bytes32 fileHash) requireOwnership {
 //    Order order = Order(orderAddr);
 //    order.addMessage(fileHash);
 //  }

 //  //TODO: cancel needs some tests
	// function cancel(address orderAddr) requireOwnership {
	// 	Order(orderAddr).cancel();
	// }

 //    //TODO: markAsShipped needs some tests
	// function markAsShipped(address orderAddr) requireOwnership {

 //    Order order = Order(orderAddr);

 //    uint productsLength = order.getProductsLength();

 //    for(uint i = 0; i < productsLength; i++) {
 //      uint index = order.getProductIndex(i);
 //      uint quantity = order.getProductQuantity(i);
 //      depleteProductUnits(index, quantity);
 //    }
 //    order.markAsShipped();

 //    verfifiedBuyers[Order(orderAddr)] = true;
 //  }

}