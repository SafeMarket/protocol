pragma solidity ^0.4.6;

import "ownable.sol";

contract Store is ownable {

  function () payable {}

  bool public isOpen;
  function set_isOpen(bool _isOpen) require_isOwner(msg.sender) { isOpen = _isOpen; }
  bytes4 public currency;
  function set_currency(bytes4 _currency) require_isOwner(msg.sender) { currency = _currency; }
  uint public bufferCentiperun;
  function set_bufferCentiperun(uint _bufferCentiperun) require_isOwner(msg.sender) { bufferCentiperun = _bufferCentiperun; }
  uint public disputeSeconds;
  function set_disputeSeconds(uint _disputeSeconds) require_isOwner(msg.sender) { disputeSeconds = _disputeSeconds; }
  uint public minProductsTeratotal;
  function set_minProductsTeratotal(uint _minProductsTeratotal) require_isOwner(msg.sender) { minProductsTeratotal = _minProductsTeratotal; }
  uint public affiliateFeeCentiperun;
  function set_affiliateFeeCentiperun(uint _affiliateFeeCentiperun) require_isOwner(msg.sender) { affiliateFeeCentiperun = _affiliateFeeCentiperun; }
  bytes public metaMultihash;
  function set_metaMultihash(bytes _metaMultihash) require_isOwner(msg.sender) { metaMultihash = _metaMultihash; }


  /* START Product struct array */
  
  struct Product{
    bool isActive;
    uint teraprice;
    uint units;
  }
  
  Product[] public Product_array;
  
  function get_Product_array_length() constant returns (uint) {
    return Product_array.length;
  }
  
  function add_Product(
    bool _isActive, 
    uint _teraprice, 
    uint _units
  ) require_isOwner(msg.sender) {
    Product_array.push(Product(
      _isActive, 
      _teraprice, 
      _units
    ));
  }
  
  function get_Product_isActive (uint index) constant returns (bool isActive) {
    return Product_array[index].isActive;
  }
  
  function set_Product_isActive (uint index, bool value) require_isOwner(msg.sender) {
    Product_array[index].isActive = value;
  }
  function get_Product_teraprice (uint index) constant returns (uint teraprice) {
    return Product_array[index].teraprice;
  }
  
  function set_Product_teraprice (uint index, uint value) require_isOwner(msg.sender) {
    Product_array[index].teraprice = value;
  }
  function get_Product_units (uint index) constant returns (uint units) {
    return Product_array[index].units;
  }
  
  function set_Product_units (uint index, uint value) require_isOwner(msg.sender) {
    Product_array[index].units = value;
  }
  /* END Product structs */
  /* START Transport struct array */
  
  struct Transport{
    bool isActive;
    uint teraprice;
  }
  
  Transport[] public Transport_array;
  
  function get_Transport_array_length() constant returns (uint) {
    return Transport_array.length;
  }
  
  function add_Transport(
    bool _isActive, 
    uint _teraprice
  ) require_isOwner(msg.sender) {
    Transport_array.push(Transport(
      _isActive, 
      _teraprice
    ));
  }
  
  function get_Transport_isActive (uint index) constant returns (bool isActive) {
    return Transport_array[index].isActive;
  }
  
  function set_Transport_isActive (uint index, bool value) require_isOwner(msg.sender) {
    Transport_array[index].isActive = value;
  }
  function get_Transport_teraprice (uint index) constant returns (uint teraprice) {
    return Transport_array[index].teraprice;
  }
  
  function set_Transport_teraprice (uint index, uint value) require_isOwner(msg.sender) {
    Transport_array[index].teraprice = value;
  }
  /* END Transport structs */

}
