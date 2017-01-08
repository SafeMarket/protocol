pragma solidity ^0.4.4;

import "Ticker.sol";
import "Store.sol";
import "Submarket.sol";
import "ownable.sol";

contract Order is ownable {

  function () payable {}

      Ticker public ticker;
      function setTicker(Ticker _ticker) requireOwnership { ticker = _ticker; }
      bool public isCreated;
      function setIsCreated(bool _isCreated) requireOwnership { isCreated = _isCreated; }
      address public buyer;
      function setBuyer(address _buyer) requireOwnership { buyer = _buyer; }
      address public storeAddr;
      function setStoreAddr(address _storeAddr) requireOwnership { storeAddr = _storeAddr; }
      bytes4 public storeCurrency;
      function setStoreCurrency(bytes4 _storeCurrency) requireOwnership { storeCurrency = _storeCurrency; }
      address public submarketAddr;
      function setSubmarketAddr(address _submarketAddr) requireOwnership { submarketAddr = _submarketAddr; }
      bytes4 public submarketCurrency;
      function setSubmarketCurrency(bytes4 _submarketCurrency) requireOwnership { submarketCurrency = _submarketCurrency; }
      address public affiliate;
      function setAffiliate(address _affiliate) requireOwnership { affiliate = _affiliate; }
      uint constant public TERABASE = 1000000000000;
      uint constant public CENTIBASE = 100;
      uint public transportTeraprice;
      function setTransportTeraprice(uint _transportTeraprice) requireOwnership { transportTeraprice = _transportTeraprice; }
      bytes32 public transportFileHash;
      function setTransportFileHash(bytes32 _transportFileHash) requireOwnership { transportFileHash = _transportFileHash; }
      uint public buyerAmountCentiperun;
      function setBuyerAmountCentiperun(uint _buyerAmountCentiperun) requireOwnership { buyerAmountCentiperun = _buyerAmountCentiperun; }
      uint public escrowFeeTerabase;
      function setEscrowFeeTerabase(uint _escrowFeeTerabase) requireOwnership { escrowFeeTerabase = _escrowFeeTerabase; }
      uint public escrowFeeCentiperun;
      function setEscrowFeeCentiperun(uint _escrowFeeCentiperun) requireOwnership { escrowFeeCentiperun = _escrowFeeCentiperun; }
      uint public affiliateFeeCentiperun;
      function setAffiliateFeeCentiperun(uint _affiliateFeeCentiperun) requireOwnership { affiliateFeeCentiperun = _affiliateFeeCentiperun; }
      uint public bufferCentiperun;
      function setBufferCentiperun(uint _bufferCentiperun) requireOwnership { bufferCentiperun = _bufferCentiperun; }
      uint public safemarketFee;
      function setSafemarketFee(uint _safemarketFee) requireOwnership { safemarketFee = _safemarketFee; }
      uint public escrowFeeTeramount;
      function setEscrowFeeTeramount(uint _escrowFeeTeramount) requireOwnership { escrowFeeTeramount = _escrowFeeTeramount; }
      uint public bufferTeramount;
      function setBufferTeramount(uint _bufferTeramount) requireOwnership { bufferTeramount = _bufferTeramount; }
      uint public productsTeratotal;
      function setProductsTeratotal(uint _productsTeratotal) requireOwnership { productsTeratotal = _productsTeratotal; }
      uint public storeTeratotal;
      function setStoreTeratotal(uint _storeTeratotal) requireOwnership { storeTeratotal = _storeTeratotal; }
      uint public total;
      function setTotal(uint _total) requireOwnership { total = _total; }
      uint public bounty;
      function setBounty(uint _bounty) requireOwnership { bounty = _bounty; }
      bool public isStoreAmountReleased;
      function setIsStoreAmountReleased(bool _isStoreAmountReleased) requireOwnership { isStoreAmountReleased = _isStoreAmountReleased; }
      bool public isEscrowAmountReleased;
      function setIsEscrowAmountReleased(bool _isEscrowAmountReleased) requireOwnership { isEscrowAmountReleased = _isEscrowAmountReleased; }
      bool public isAffiliateAmountReleased;
      function setIsAffiliateAmountReleased(bool _isAffiliateAmountReleased) requireOwnership { isAffiliateAmountReleased = _isAffiliateAmountReleased; }
      uint public disputeSeconds;
      function setDisputeSeconds(uint _disputeSeconds) requireOwnership { disputeSeconds = _disputeSeconds; }
      uint public status;
      function setStatus(uint _status) requireOwnership { status = _status; }
      uint public received;
      function setReceived(uint _received) requireOwnership { received = _received; }
      uint public shippedAt;
      function setShippedAt(uint _shippedAt) requireOwnership { shippedAt = _shippedAt; }
      uint public disputedAt;
      function setDisputedAt(uint _disputedAt) requireOwnership { disputedAt = _disputedAt; }
      uint public blockNumber;
      function setBlockNumber(uint _blockNumber) requireOwnership { blockNumber = _blockNumber; }
      uint constant public INITIALIZED = 0;
      uint constant public SHIPPED = 1;
      uint constant public DISPUTED = 2;
      uint constant public RESOLVED = 3;
      uint constant public FINALIZED = 4;

    /* START Product structs */
    
    struct Product{
      uint index;
      uint teraprice;
      bytes32 fileHash;
      uint quantity;
    }
    
    Product[] public Products;
    
    function getProductsLength() constant returns (uint) {
      return Products.length;
    }
    
    function addProduct(uint index, 
    uint teraprice, 
    bytes32 fileHash, 
    uint quantity
    ) requireOwnership {
      Products.push(Product(  index, 
      teraprice, 
      fileHash, 
      quantity
    ));
    }
    
    function getProductIndex (uint _index) constant returns (uint index) {
      return Products[_index].index;
    }
    
    function setProductIndex (uint index, uint value) requireOwnership {
      Products[index].index = value;
    }
    function getProductTeraprice (uint _index) constant returns (uint teraprice) {
      return Products[_index].teraprice;
    }
    
    function setProductTeraprice (uint index, uint value) requireOwnership {
      Products[index].teraprice = value;
    }
    function getProductFileHash (uint _index) constant returns (bytes32 fileHash) {
      return Products[_index].fileHash;
    }
    
    function setProductFileHash (uint index, bytes32 value) requireOwnership {
      Products[index].fileHash = value;
    }
    function getProductQuantity (uint _index) constant returns (uint quantity) {
      return Products[_index].quantity;
    }
    
    function setProductQuantity (uint index, uint value) requireOwnership {
      Products[index].quantity = value;
    }
    /* END Product structs */
    /* START Message structs */
    
    struct Message{
      uint blockNumber;
      address sender;
      bytes32 fileHash;
    }
    
    Message[] public Messages;
    
    function getMessagesLength() constant returns (uint) {
      return Messages.length;
    }
    
    function addMessage(uint blockNumber, 
    address sender, 
    bytes32 fileHash
    ) requireOwnership {
      Messages.push(Message(  blockNumber, 
      sender, 
      fileHash
    ));
    }
    
    function getMessageBlockNumber (uint _index) constant returns (uint blockNumber) {
      return Messages[_index].blockNumber;
    }
    
    function setMessageBlockNumber (uint index, uint value) requireOwnership {
      Messages[index].blockNumber = value;
    }
    function getMessageSender (uint _index) constant returns (address sender) {
      return Messages[_index].sender;
    }
    
    function setMessageSender (uint index, address value) requireOwnership {
      Messages[index].sender = value;
    }
    function getMessageFileHash (uint _index) constant returns (bytes32 fileHash) {
      return Messages[_index].fileHash;
    }
    
    function setMessageFileHash (uint index, bytes32 value) requireOwnership {
      Messages[index].fileHash = value;
    }
    /* END Message structs */
    /* START Update structs */
    
    struct Update{
      uint blockNumber;
      address sender;
      uint status;
    }
    
    Update[] public Updates;
    
    function getUpdatesLength() constant returns (uint) {
      return Updates.length;
    }
    
    function addUpdate(uint blockNumber, 
    address sender, 
    uint status
    ) requireOwnership {
      Updates.push(Update(  blockNumber, 
      sender, 
      status
    ));
    }
    
    function getUpdateBlockNumber (uint _index) constant returns (uint blockNumber) {
      return Updates[_index].blockNumber;
    }
    
    function setUpdateBlockNumber (uint index, uint value) requireOwnership {
      Updates[index].blockNumber = value;
    }
    function getUpdateSender (uint _index) constant returns (address sender) {
      return Updates[_index].sender;
    }
    
    function setUpdateSender (uint index, address value) requireOwnership {
      Updates[index].sender = value;
    }
    function getUpdateStatus (uint _index) constant returns (uint status) {
      return Updates[_index].status;
    }
    
    function setUpdateStatus (uint index, uint value) requireOwnership {
      Updates[index].status = value;
    }
    /* END Update structs */

    /* START Totals structs */
    
    struct Totals{
      uint store;
      uint escrowBase;
      uint escrowFee;
      uint affiliate;
      uint buffer;
      uint total;
    }
    
    Totals public totals;
    
    function getTotalsStore () constant returns (uint store) {
      return totals.store;
    }
    
    function setTotalsStore (uint value) requireOwnership {
      totals.store = value;
    }
    function getTotalsEscrowBase () constant returns (uint escrowBase) {
      return totals.escrowBase;
    }
    
    function setTotalsEscrowBase (uint value) requireOwnership {
      totals.escrowBase = value;
    }
    function getTotalsEscrowFee () constant returns (uint escrowFee) {
      return totals.escrowFee;
    }
    
    function setTotalsEscrowFee (uint value) requireOwnership {
      totals.escrowFee = value;
    }
    function getTotalsAffiliate () constant returns (uint affiliate) {
      return totals.affiliate;
    }
    
    function setTotalsAffiliate (uint value) requireOwnership {
      totals.affiliate = value;
    }
    function getTotalsBuffer () constant returns (uint buffer) {
      return totals.buffer;
    }
    
    function setTotalsBuffer (uint value) requireOwnership {
      totals.buffer = value;
    }
    function getTotalsTotal () constant returns (uint total) {
      return totals.total;
    }
    
    function setTotalsTotal (uint value) requireOwnership {
      totals.total = value;
    }
    /* END Totals structs */
    /* START Payouts structs */
    
    struct Payouts{
      uint store;
      uint escrow;
      uint affiliate;
      uint total;
    }
    
    Payouts public payouts;
    
    function getPayoutsStore () constant returns (uint store) {
      return payouts.store;
    }
    
    function setPayoutsStore (uint value) requireOwnership {
      payouts.store = value;
    }
    function getPayoutsEscrow () constant returns (uint escrow) {
      return payouts.escrow;
    }
    
    function setPayoutsEscrow (uint value) requireOwnership {
      payouts.escrow = value;
    }
    function getPayoutsAffiliate () constant returns (uint affiliate) {
      return payouts.affiliate;
    }
    
    function setPayoutsAffiliate (uint value) requireOwnership {
      payouts.affiliate = value;
    }
    function getPayoutsTotal () constant returns (uint total) {
      return payouts.total;
    }
    
    function setPayoutsTotal (uint value) requireOwnership {
      payouts.total = value;
    }
    /* END Payouts structs */

	function create(
		address _buyer
		,address _storeAddr
		,address _submarketAddr
		,address _affiliate
    ,uint _bounty
     //TODO: possible vulnerability, the seller could reorder atteempt to Products to force someone to buy a different product, may be an opportunity to use product hashes instead
		,uint[] _productIndexes
		,uint[] _productQuantities
    //TODO: again, maybe the following can be gamed
		,uint _transportIndex
		,address tickerAddr
	) payable {

		if(isCreated)
			throw;

		isCreated = true;

		blockNumber = block.number;

		buyer = _buyer;
		storeAddr = _storeAddr;
    //TODO: check if submarket is in list of approved submarkets
		submarketAddr = _submarketAddr;
		affiliate = _affiliate;
    bounty = _bounty;

    //TODO: ticker needs to be somehow approved by both buyer and seller, maybe it should be an option alowing the resolution market
		ticker = Ticker(tickerAddr);

		Store store = Store(_storeAddr);

		if(!store.isOpen())
			throw;

		storeCurrency = bytes4(store.currency());

		for(uint i = 0; i< _productIndexes.length; i++) {

			uint[3] memory productParams = [
				_productIndexes[i],									//productIndex
				store.getProductTeraprice(_productIndexes[i]),		//productTeraprice
				_productQuantities[i]								//productQuantity
			];

			if(!store.getProductIsActive(productParams[0]))
				throw;

			Products.push(Product(
				productParams[0],
				productParams[1],
				store.getProductFileHash(productParams[0]),
				productParams[2]
			));

			productsTeratotal = productsTeratotal + (productParams[1] * productParams[2]);
		}

		if(productsTeratotal < store.minProductsTeratotal())
			throw;

		if(!store.getTransportIsActive(_transportIndex))
			throw;

		transportTeraprice = store.getTransportTeraprice(_transportIndex);
		transportFileHash = store.getTransportFileHash(_transportIndex);

		bufferCentiperun = store.bufferCentiperun();

		if(_affiliate != address(0)) {
			affiliateFeeCentiperun = store.affiliateFeeCentiperun();
		}

		if(submarketAddr != address(0)) {
      //TODO: change this to use an instance of the submarket that is not infosphered
      //TODO: test submarkets and orders with submarkets
			var submarket = Submarket(_submarketAddr);
			if(!submarket.isOpen())
				throw;
			submarketCurrency = submarket.currency();
			escrowFeeTerabase = submarket.escrowFeeTerabase();
			escrowFeeCentiperun = submarket.escrowFeeCentiperun();
			disputeSeconds = store.disputeSeconds();
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
      escrowFeeTerawei = storeTerawei * escrowFeeCentiperun / CENTIBASE;
    }

    uint affiliateTerawei;
    if (affiliateFeeCentiperun > 0) {
      affiliateTerawei = storeTerawei * affiliateFeeCentiperun / CENTIBASE;
    }

    uint subTotalTerawei = storeTerawei + escrowBaseTerawei + escrowFeeTerawei + affiliateTerawei;

    uint bufferTerawei;
    if (bufferCentiperun > 0) {
      bufferTerawei = subTotalTerawei * bufferCentiperun / CENTIBASE;
    }

    totals.store = storeTerawei / TERABASE;
    totals.escrowBase = escrowBaseTerawei / TERABASE;
    totals.escrowFee = escrowFeeTerawei / TERABASE;
    totals.affiliate = affiliateTerawei / TERABASE;
    totals.buffer = bufferTerawei / TERABASE;

    totals.total = (subTotalTerawei + bufferTerawei) / TERABASE + bounty;
  }

	function addMessage(bytes32 fileHash) {
    address user = msg.sender;

		if(
			user != buyer
			&& user != storeAddr
			&& user != submarketAddr
		)
			throw;

		Messages.push(Message(block.number, user, fileHash));
	}

	function addUpdate(uint _status) private{
		status = _status;
		Updates.push(Update(block.number, msg.sender, _status));
	}

	function cancel() {

		if(status != INITIALIZED)
			throw;

    //TODO: check all cases in which a storeAddr could send this request
		if(msg.sender != buyer && msg.sender != storeAddr)
			throw;

		suicide(buyer);
	}

	function markAsShipped() {
		if(status != INITIALIZED)
			throw;

    //TODO: check all cases in which a storeAddr could send this request
		if(msg.sender != storeAddr)
			throw;

    if(this.balance < totals.total) throw;
		//don't allow to mark as SHIPPED on same block that a withdrawl is made
		//if(receivedAtBlockNumber == block.number)
		//	throw;

		shippedAt = now;
		addUpdate(SHIPPED);
	}

	function finalize() {
    if((status==SHIPPED && now - shippedAt > disputeSeconds) || (status==DISPUTED && now - disputedAt > disputeSeconds)) {
  		computePayouts();
  		addUpdate(FINALIZED);
      return;
    }

  	if(status != SHIPPED && status != RESOLVED) throw;

		if(msg.sender != buyer) throw;

		computePayouts();

    if(this.balance < payouts.total) throw;

		addUpdate(FINALIZED);
	}

	function dispute() {
		if(msg.sender != buyer)
			throw;

		if(status != SHIPPED)
			throw;

		if(submarketAddr==address(0))
			throw;

		if(now - shippedAt > disputeSeconds)
			throw;

		addUpdate(DISPUTED);
		disputedAt=now;

	}

  //TODO: add buyerAmountCentiperun to the payout calculation
	function resolve(uint _buyerAmountCentiperun) {

		if(status!=DISPUTED)
			throw;

		if(msg.sender != submarketAddr)
			throw;

		buyerAmountCentiperun = _buyerAmountCentiperun;

    computePayouts();

    addUpdate(RESOLVED);
	}

	 function computePayouts() {
     uint storeTerawei = ticker.convert(storeTeratotal, storeCurrency, bytes4('WEI'));

     uint escrowBaseTerawei;
     if (escrowFeeTerabase > 0) {
       escrowBaseTerawei = ticker.convert(escrowFeeTerabase, submarketCurrency, bytes4('WEI'));
     }

     uint escrowFeeTerawei;
     if (escrowFeeTerabase > 0) {
       escrowFeeTerawei = storeTerawei * escrowFeeCentiperun / CENTIBASE;
     }

     uint affiliateTerawei;
     if (affiliateFeeCentiperun > 0) {
       affiliateTerawei = storeTerawei * affiliateFeeCentiperun / CENTIBASE;
     }

     uint totalTerawei = storeTerawei + escrowBaseTerawei + escrowFeeTerawei + affiliateTerawei;

     payouts.store = storeTerawei / TERABASE;
     payouts.escrow = (escrowBaseTerawei + escrowFeeTerawei) / TERABASE;
     payouts.affiliate = affiliateTerawei / TERABASE;
     payouts.total = totalTerawei / TERABASE;
	 }

	 function release(address addr, uint amount) private {
     if(status != FINALIZED) throw;

    uint reward = bounty / 4;
    if(reward > amount) reward = amount;

	 	if(!msg.sender.send(reward))
	 		throw;

    if(amount - reward < 0) return;
    if(addr == address(0)) addr = buyer;
	 	if(!addr.send(amount - reward))
	 		throw;

	 }

	function releaseBuyerPayout() {
    if(!isStoreAmountReleased || !isEscrowAmountReleased || !isAffiliateAmountReleased){
      throw;
    }
    suicide(buyer);
	}

  function releaseStorePayout() {
    if(isStoreAmountReleased) throw;
    isStoreAmountReleased = true;
    release(storeAddr,payouts.store);
  }

  function releaseEscrowAPayout() {
    if(isEscrowAmountReleased) throw;
    isEscrowAmountReleased = true;
    release(submarketAddr,payouts.escrow);
  }

  function releaseAffiliatePayout() {
    if(isAffiliateAmountReleased) throw;
    isAffiliateAmountReleased = true;
    release(affiliate,payouts.affiliate);
  }
}