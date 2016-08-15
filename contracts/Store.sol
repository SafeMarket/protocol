import "forumable.sol";
import "audible.sol";
import "orderable.sol";
import "infosphered.sol";
import "aliasable.sol";
import "approvesAliases.sol";
import "Order.sol";

contract StoreOrderInterface {
  function markAsShipped();
  function cancel();
  function getProductCount();
  function getProductIndex(uint _index);
	function getProductQuantity(uint _index);
}

contract Store is forumable, audible, infosphered, aliasable, orderable, approvesAliases {

  struct Product{
    bool isActive;
    uint teraprice;
    uint units;
    bytes32 fileHash;
  }

  struct Transport{
    bool isActive;
    uint256 teraprice;
    bytes32 fileHash;
  }

  Product[] public products;
  Transport[] transports;


  function Store(bytes32[] productParams, bytes32[] transportParams, bytes32[] _approvedAliases) {
    //TODO: solidity has been around for awhile, maybe there is a better way to do this
    //than a list of parameters
    for(uint i = 0; i< productParams.length; i=i+4) {
      bool isProductActive = uint(productParams[i]) != 0;
      products.push(Product(
        isProductActive,
        uint(productParams[i+1]),
        uint(productParams[i+2]),
        productParams[i+3]
      ));
    }

    for(uint j = 0; j< transportParams.length; j=j+3) {
      bool isTransportActive = uint(transportParams[j]) != 0;
		  transports.push(Transport(
        isTransportActive,
			  uint(transportParams[j+1]),
			  transportParams[j+2]
		  ));
	  }

		approvedAliases = _approvedAliases;
	}

	function setProductIsActive(uint index, bool isActive){
		requireOwnership();
		products[index].isActive = isActive;
	}

	function setProductTeraprice(uint index, uint teraprice){
		requireOwnership();
		products[index].teraprice = teraprice;
	}

	function setProductUnits(uint index, uint units){
		requireOwnership();
		products[index].units = units;
	}

	function setProductFileHash(uint index, bytes32 fileHash){
		requireOwnership();
		products[index].fileHash = fileHash;
	}

	function setTransportIsActive(uint index, bool isActive){
		requireOwnership();
		transports[index].isActive = isActive;
	}

	function setTransportTeraprice(uint index, uint teraprice){
		requireOwnership();
		transports[index].teraprice = teraprice;
	}

	function setTransportFileHash(uint index, bytes32 fileHash){
		requireOwnership();
		transports[index].fileHash = fileHash;
	}

	function getProductCount() constant returns(uint){
		return products.length;
	}

	function getProductIsActive(uint index) constant returns(bool){
		return products[index].isActive;
	}

	function getProductTeraprice(uint index) constant returns(uint){
		return products[index].teraprice;
	}

	function getProductUnits(uint index) constant returns(uint){
		return products[index].units;
	}

	function getProductFileHash(uint index) constant returns(bytes32){
		return products[index].fileHash;
	}

	function getTransportCount() constant returns(uint){
		return transports.length;
	}

	function getTransportIsActive(uint index) constant returns(bool){
		return transports[index].isActive;
	}

	function getTransportTeraprice(uint index) constant returns(uint){
		return transports[index].teraprice;
	}

	function getTransportFileHash(uint index) constant returns(bytes32){
		return transports[index].fileHash;
	}

	function addProduct(uint teraprice, uint units, bytes32 fileHash){
		requireOwnership();
		products.push(Product(true, teraprice, units, fileHash));
	}

	function addTransport(uint teraprice, bytes32 fileHash){
		requireOwnership();
		transports.push(Transport(true, teraprice, fileHash));
	}

	function restoreProductUnits(uint index, uint quantity){
		requireOwnership();

		products[index].units = products[index].units + quantity;
	}

	function depleteProductUnits(uint index, uint quantity){
		requireOwnership();

		if(products[index].units < quantity) throw;

		products[index].units = products[index].units - quantity;
	}


  //TODO: cancel needs some tests
	function cancel(address orderAddr) {
		requireOwnership();
		StoreOrderInterface(orderAddr).cancel();
	}

    //TODO: markAsShipped needs some tests
	function markAsShipped(address orderAddr) {
		requireOwnership();

    Order order = Order(order);

    uint productCount = order.getProductCount();

    for(uint i = 0; i < productCount; i++) {
      uint index = order.getProductIndex(i);
      uint quantity = order.getProductQuantity(i);
      depleteProductUnits(index, quantity);
    }
		order.markAsShipped();
	}
}