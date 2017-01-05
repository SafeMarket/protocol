pragma solidity ^0.4.6;

import "ownable.sol";
import "executor.sol";

contract Multiprox is executor, ownable{

  event Creation(
    address indexed sender,
    bytes32 indexed codeHash,
    address addr
  );

  function execute(address addr, uint[] calldataLengths, bytes calldatas) {
    if(ownable(addr).hasOwner(msg.sender) != true) {
      throw;
    }
    _execute(addr, calldataLengths, calldatas);
  }

  function create(bytes code) returns(address addr){

    assembly{
      addr := create(0, add(code,0x20), mload(code))
      jumpi(invalidJumpLabel, iszero(extcodesize(addr)))
    }
    Creation(msg.sender, sha3(code), addr);
  }

  function createAndExecute(bytes code, uint[] calldataLengths, bytes calldatas) returns(address addr){
    addr = create(code);
    _execute(addr, calldataLengths, calldatas);
  }

}
