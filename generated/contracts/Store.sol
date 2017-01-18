pragma solidity ^0.4.6;

import "ownable.sol";

contract Store is ownable {

  function () payable {}

  bool public isOpen;
  function set_isOpen(bool _isOpen) require_isOwner(msg.sender) { isOpen = _isOpen; }
  bytes4 public currency;
  function set_currency(bytes4 _currency) require_isOwner(msg.sender) { currency = _currency; }
  uint256 public bufferTeraperun;
  function set_bufferTeraperun(uint256 _bufferTeraperun) require_isOwner(msg.sender) { bufferTeraperun = _bufferTeraperun; }
  uint256 public disputeSeconds;
  function set_disputeSeconds(uint256 _disputeSeconds) require_isOwner(msg.sender) { disputeSeconds = _disputeSeconds; }
  uint256 public minProductsTeratotal;
  function set_minProductsTeratotal(uint256 _minProductsTeratotal) require_isOwner(msg.sender) { minProductsTeratotal = _minProductsTeratotal; }
  uint256 public affiliateFeeTeraperun;
  function set_affiliateFeeTeraperun(uint256 _affiliateFeeTeraperun) require_isOwner(msg.sender) { affiliateFeeTeraperun = _affiliateFeeTeraperun; }
  bytes public metaMultihash;
  function set_metaMultihash(bytes _metaMultihash) require_isOwner(msg.sender) { metaMultihash = _metaMultihash; }


  /* START Product struct array */
  
  struct Product{
    bool isArchived;
    uint256 teraprice;
    uint256 units;
  }
  
  Product[] public Product_array;
  
  function get_Product_array_length() constant returns (uint256) {
    return Product_array.length;
  }
  
  function add_Product(
    bool _isArchived, 
    uint256 _teraprice, 
    uint256 _units
  ) require_isOwner(msg.sender) {
    Product_array.push(Product(
      _isArchived, 
      _teraprice, 
      _units
    ));
  }
  
  function get_Product_isArchived (uint256 index) constant returns (bool isArchived) {
    return Product_array[index].isArchived;
  }
  
  function set_Product_isArchived (uint256 index, bool value) require_isOwner(msg.sender) {
    Product_array[index].isArchived = value;
  }
  function get_Product_teraprice (uint256 index) constant returns (uint256 teraprice) {
    return Product_array[index].teraprice;
  }
  
  function set_Product_teraprice (uint256 index, uint256 value) require_isOwner(msg.sender) {
    Product_array[index].teraprice = value;
  }
  function get_Product_units (uint256 index) constant returns (uint256 units) {
    return Product_array[index].units;
  }
  
  function set_Product_units (uint256 index, uint256 value) require_isOwner(msg.sender) {
    Product_array[index].units = value;
  }
  /* END Product structs */
  /* START Transport struct array */
  
  struct Transport{
    bool isArchived;
    uint256 teraprice;
  }
  
  Transport[] public Transport_array;
  
  function get_Transport_array_length() constant returns (uint256) {
    return Transport_array.length;
  }
  
  function add_Transport(
    bool _isArchived, 
    uint256 _teraprice
  ) require_isOwner(msg.sender) {
    Transport_array.push(Transport(
      _isArchived, 
      _teraprice
    ));
  }
  
  function get_Transport_isArchived (uint256 index) constant returns (bool isArchived) {
    return Transport_array[index].isArchived;
  }
  
  function set_Transport_isArchived (uint256 index, bool value) require_isOwner(msg.sender) {
    Transport_array[index].isArchived = value;
  }
  function get_Transport_teraprice (uint256 index) constant returns (uint256 teraprice) {
    return Transport_array[index].teraprice;
  }
  
  function set_Transport_teraprice (uint256 index, uint256 value) require_isOwner(msg.sender) {
    Transport_array[index].teraprice = value;
  }
  /* END Transport structs */

}
