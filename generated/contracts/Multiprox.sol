pragma solidity ^0.4.6;

import "ownable.sol";
import "executor.sol";

contract Multiprox is executor, ownable{

  mapping (bytes32 => bool) isCodeHashRegisteredMap;
  mapping (bytes32 => bytes) codeHashToCodeMap;

  function registerCode(bytes code) requireOwnership {
    bytes32 codeHash = sha3(code);
    if (isCodeHashRegisteredMap[codeHash]) {
      throw;
    }
    isCodeHashRegisteredMap[codeHash] = true;
    codeHashToCodeMap[codeHash] = code;
  }

  function unregisterCodeHash(bytes32 codeHash) requireOwnership {
    isCodeHashRegisteredMap[codeHash] = false;
  }

  function getIsCodeHashRegistered(bytes32 codeHash) constant returns(bool) {
    return isCodeHashRegisteredMap[codeHash];
  }

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

  function create(bytes32 codeHash) returns(address addr){
    bytes memory code = codeHashToCodeMap[codeHash];
    assembly{
      addr := create(0, add(code,0x20), mload(code))
      jumpi(invalidJumpLabel, iszero(extcodesize(addr)))
    }
    Creation(msg.sender, sha3(code), addr);
  }

  function createAndExecute(bytes32 codeHash, uint[] calldataLengths, bytes calldatas) returns(address addr){
    addr = create(codeHash);
    _execute(addr, calldataLengths, calldatas);
  }

}
