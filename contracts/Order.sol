import "Ticker.sol";
import "Store.sol";
import "Submarket.sol";

contract Order{

	Ticker ticker;

	bool isCreated;

	address public buyer;
	address public storeAddr;
	bytes4 public storeCurrency;
	address public submarketAddr;
	bytes4 public submarketCurrency;
	address public affiliate;

	struct Product{
		uint index;
		uint teraprice;
		bytes32 fileHash;
		uint quantity;
	}
	Product[] products;


  uint constant TERABASE = 1000000000000;
  uint constant CENTIBASE = 100;

	uint public transportTeraprice;
	bytes32 public transportFileHash;

	uint public buyerAmountCentiperun;
	uint public escrowFeeTerabase;
	uint public escrowFeeCentiperun;
	uint public affiliateFeeCentiperun;
	uint public bufferCentiperun;
	uint public safemarketFee;

	uint public escrowFeeTeramount;
	uint public bufferTeramount;
	uint public productsTeratotal;
	uint public storeTeratotal;
	uint public total;

  struct Totals {
    uint store; //Store total in wei
    uint escrowBase; //Escrow base in wei
    uint escrowFee; //Escrow percent fee in wei
    uint affiliate;
    uint buffer; //Total before buffer
    uint total; //Total
  }
  Totals totals;

  struct Payouts {
    uint store;
    uint escrow;
    uint affiliate;
    uint total;
  }
  Payouts payouts;

	uint public bounty;

	bool public isStoreAmountReleased;
	bool public isEscrowAmountReleased;
	bool public isAffiliateAmountReleased;

	uint public disputeSeconds;
	uint public status;
	uint public received;
	uint public shippedAt;
	uint public disputedAt;

	uint public blockNumber;

	struct Message{
		uint blockNumber;
		address sender;
		bytes32 fileHash;
	}

	struct Update{
		uint blockNumber;
		address sender;
		uint status;
	}

	Message[] messages;
	Update[] updates;

	uint constant initialized = 0;
	uint constant cancelled = 1;
	uint constant shipped = 2;
	uint constant disputed = 3;
	uint constant finalized = 4;

	uint public reviewBlockNumber;
	uint8 public reviewStoreScore;
	uint8 public reviewSubmarketScore;
	bytes32 public reviewFileHash;

	function create(
		address _buyer
		,address _storeAddr
		,address _submarketAddr
		,address _affiliate
    ,uint _bounty
     //TODO: possible vulnerability, the seller could reorder atteempt to products to force someone to buy a different product, may be an opportunity to use product hashes instead
		,uint[] _productIndexes
		,uint[] _productQuantities
    //TODO: again, maybe the following can be gamed
		,uint _transportIndex
		,address tickerAddr
	) {

		if(isCreated)
			throw;

		isCreated = true;

		blockNumber = block.number;

		buyer = _buyer;
		storeAddr = _storeAddr;
		submarketAddr = _submarketAddr;
		affiliate = _affiliate;
    bounty = _bounty;

    //TODO: ticker needs to be somehow approved by both buyer and seller, maybe it should be an option alowing the resolution market
		ticker = Ticker(tickerAddr);

		var store = Store(_storeAddr);

		if(!store.getBool('isOpen'))
			throw;

		storeCurrency = bytes4(store.getBytes32('currency'));

		for(uint i = 0; i< _productIndexes.length; i++) {

			uint[3] memory productParams = [
				_productIndexes[i],									//productIndex
				store.getProductTeraprice(_productIndexes[i]),		//productTeraprice
				_productQuantities[i]								//productQuantity
			];

			if(!store.getProductIsActive(productParams[0]))
				throw;

			products.push(Product(
				productParams[0],
				productParams[1],
				store.getProductFileHash(productParams[0]),
				productParams[2]
			));

			productsTeratotal = productsTeratotal + (productParams[1] * productParams[2]);
		}

		if(productsTeratotal < store.getUint('minProductsTeratotal'))
			throw;

		if(!store.getTransportIsActive(_transportIndex))
			throw;

		transportTeraprice = store.getTransportTeraprice(_transportIndex);
		transportFileHash = store.getTransportFileHash(_transportIndex);

		bufferCentiperun = store.getUint('bufferCentiperun');

		if(_affiliate != address(0)) {
			affiliateFeeCentiperun = store.getUint('affiliateFeeCentiperun');
		}

		if(submarketAddr != address(0)) {
      //TODO: change this to use an instance of the submarket that is not infosphered
      //TODO: test submarkets and orders with submarkets
			var submarket = infosphered(_submarketAddr);
			if(!submarket.getBool('isOpen'))
				throw;
			submarketCurrency = bytes4(submarket.getBytes32('currency'));
			escrowFeeTerabase = submarket.getUint('escrowFeeTerabase');
			escrowFeeCentiperun = submarket.getUint('escrowFeeCentiperun');
			disputeSeconds = store.getUint('disputeSeconds');
		}

    //TDDO: the wording on the transportTeraprice variable may need to be fixed to match the other parameters
		storeTeratotal = productsTeratotal + transportTeraprice;

    computeTotals();
	}

  function computeTotals() {
    uint storeTerawei = ticker.convert(storeTeratotal, storeCurrency, bytes4('WEI'));

    uint escrowBaseTerawei;
    if (escrowFeeTerabase > 0) {
      escrowBaseTerawei = ticker.convert(escrowFeeTerabase, submarketCurrency, bytes4('WEI'));
    }

    uint escrowFeeTerawei;
    if (escrowFeeTerabase > 0) {
      escrowFeeTerawei = storeTerawei * escrowFeeCentiperun;
    }

    uint affiliateTerawei;
    if (affiliateFeeCentiperun > 0) {
      affiliateTerawei = storeTerawei * affiliateFeeCentiperun;
    }

    uint subTotalTerawei = storeTerawei + escrowBaseTerawei + escrowFeeTerawei + affiliateTerawei;

    uint bufferTerawei;
    if (bufferCentiperun > 0) {
      bufferTerawei = subTotalTerawei * bufferCentiperun;
    }

    totals.store = storeTerawei / TERABASE;
    totals.escrowBase = escrowBaseTerawei / TERABASE;
    totals.escrowFee = escrowFeeTerawei / TERABASE;
    totals.affiliate = affiliateTerawei / TERABASE;
    totals.buffer = bufferTerawei / TERABASE;


    totals.total = (subTotalTerawei + bufferTerawei) / TERABASE + bounty;
  }

	function getProductCount() constant returns (uint) { return products.length; }
	function getProductIndex(uint _index) constant returns (uint) { return products[_index].index; }
	function getProductTeraprice(uint _index) constant returns (uint) { return products[_index].teraprice; }
	function getProductFileHash(uint _index) constant returns (bytes32) { return products[_index].fileHash; }
	function getProductQuantity(uint _index) constant returns (uint) { return products[_index].quantity; }

  function getStoreTotal() constant returns (uint) { return totals.store;}
  function getEscrowBaseTotal() constant returns (uint) { return totals.escrowBase;}
  function getEscrowFeeTotal() constant returns (uint) { return totals.escrowFee;}
  function getAffiliateTotal() constant returns (uint) { return totals.affiliate;}
  function getBufferTotal() constant returns (uint) { return totals.buffer;}
  function getTotalTotal() constant returns (uint) { return totals.total;}

	function addMessage(bytes32 fileHash) {
    address user = msg.sender;

		if(
			user != buyer
			&& user != storeAddr
			&& user != submarketAddr
		)
			throw;

		messages.push(Message(block.number, user, fileHash));
	}

	function addUpdate(uint _status) private{
		status = _status;
		updates.push(Update(block.number, msg.sender, _status));
	}

	function cancel() {

		if(status != initialized)
			throw;

    //TODO: check all cases in which a storeAddr could send this request
		if(msg.sender != buyer && msg.sender != storeAddr)
			throw;

		suicide(buyer);
	}

	function markAsShipped() {

		if(status != initialized)
			throw;

    //TODO: check all cases in which a storeAddr could send this request
		if(msg.sender != storeAddr)
			throw;

    if(this.balance < totals.total) throw;
		//don't allow to mark as shipped on same block that a withdrawl is made
		//if(receivedAtBlockNumber == block.number)
		//	throw;

		shippedAt = now;
		addUpdate(shipped);
	}

	function finalize() {

		if(status != shipped)
			throw;

		if(msg.sender != buyer)
			throw;

		computePayouts();

    if(this.balance < payouts.total) {
      throw;
    }

		addUpdate(finalized);
	}

	function dispute() {

		if(msg.sender != buyer)
			throw;

		if(status != shipped)
			throw;

		if(submarketAddr==address(0))
			throw;

		if(now - shippedAt > disputeSeconds)
			throw;

		addUpdate(disputed);
		disputedAt=now;

	}

	function resolve(uint _buyerAmountCentiperun) {

		if(status!=disputed)
			throw;

		if(msg.sender != submarketAddr)
			throw;

		buyerAmountCentiperun = _buyerAmountCentiperun;

		finalize();
	}

	 function computePayouts() {//private {
    uint storeTerawei = ticker.convert(storeTeratotal, storeCurrency, bytes4('WEI'));

    uint escrowBaseTerawei;
    if (escrowFeeTerabase > 0) {
      escrowBaseTerawei = ticker.convert(escrowFeeTerabase, submarketCurrency, bytes4('WEI'));
    }

    uint escrowFeeTerawei;
    if (escrowFeeTerabase > 0) {
      escrowFeeTerawei = storeTerawei * escrowFeeCentiperun;
    }

    uint affiliateTerawei;
    if (affiliateFeeCentiperun > 0) {
      affiliateTerawei = storeTerawei * affiliateFeeCentiperun;
    }

    uint totalTerawei = storeTerawei + escrowBaseTerawei + escrowFeeTerawei + affiliateTerawei;

    payouts.store = storeTerawei / TERABASE;
    payouts.escrow = (escrowBaseTerawei + escrowFeeTerawei) / TERABASE;
    payouts.affiliate = affiliateTerawei / TERABASE;
    payouts.total = totalTerawei / TERABASE + bounty;
	 }

   function getStorePayout() constant returns (uint) { return payouts.store;}
   function getEscrowPayout() constant returns (uint) { return payouts.escrow;}
   function getAffiliatePayout() constant returns (uint) { return payouts.affiliate;}
   function getTotalPayout() constant returns (uint) { return payouts.total;}

	 function release(bool isReleased, address addr, uint amount) private {
	 	if(bounty > amount)
	 		bounty = amount / CENTIBASE;

	 	if(!addr.send(amount - bounty))
	 		throw;

	 	if(!msg.sender.send(bounty))
	 		throw;
	 }

	function releaseBuyerPayout() {
    if(!isStoreAmountReleased || !isEscrowAmountReleased || !isAffiliateAmountReleased) throw;
	 	suicide(buyer);
	}

  function releaseStorePayout() {
    if(isStoreAmountReleased) throw;
    isStoreAmountReleased = true;
    release(isStoreAmountReleased,storeAddr,payouts.store);
  }

  function releaseEscrowAPayout() {
    if(isEscrowAmountReleased) throw;
    isEscrowAmountReleased = true;
    release(isEscrowAmountReleased,submarketAddr,payouts.escrow);
  }

  function releaseAffiliatePayout() {
    if(isAffiliateAmountReleased) throw;
    isAffiliateAmountReleased = true;
    release(isAffiliateAmountReleased,affiliate,payouts.affiliate);
  }

  function getReceived() constant returns (uint) {
		return this.balance;
	}

	function getMessagesCount() constant returns(uint) {
		return messages.length;
	}

	function getMessageBlockNumber(uint index) constant returns(uint) {
		return messages[index].blockNumber;
	}

	function getMessageSender(uint index) constant returns(address) {
		return messages[index].sender;
	}

	function getMessageFileHash(uint index) constant returns(bytes32) {
		return messages[index].fileHash;
	}

	function getUpdatesCount() constant returns(uint) {
		return updates.length;
	}

	function getUpdateBlockNumber(uint index) constant returns(uint) {
		return updates[index].blockNumber;
	}

	function getUpdateSender(uint index) constant returns(address) {
		return updates[index].sender;
	}

	function getUpdateStatus(uint index) constant returns(uint) {
		return updates[index].status;
	}

	function setReview(uint8 storeScore, uint8 submarketScore, bytes32 fileHash) {
    //TODO: probably shouldn't use tx.origin here
		if(msg.sender != buyer && tx.origin != buyer)
			throw;

    //TODO: magic numbers are bad, 5 should be a constant
		if(storeScore > 5 || submarketScore > 5)
			throw;

    //TODO: change this logic so it just ignores the parameter instead of throwing
		if(submarketAddr == address(0) && submarketScore != 0)
			throw;

		reviewBlockNumber = block.number;
		reviewStoreScore = storeScore;
		reviewSubmarketScore = submarketScore;
		reviewFileHash = fileHash;
	}

  function getReviewBlockNumber() constant returns(uint) {
    return reviewBlockNumber;
  }

  function getReviewStoreScore() constant returns(uint8) {
    return reviewStoreScore;
  }

  function getReviewSubmarketScore() constant returns(uint8) {
    return reviewSubmarketScore;
  }

  function getReviewFileHash() constant returns(bytes32) {
    return reviewFileHash;
  }

}