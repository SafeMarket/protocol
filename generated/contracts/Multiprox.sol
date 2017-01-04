pragma solidity ^0.4.4;

import "ownable.sol";
import "executor.sol";

contract Multiprox is executor{
  function execute(address addr, uint[] calldataLengths, bytes calldatas) {
    if(!ownable(addr).hasOwner(msg.sender)) {
      throw;
    }
    _execute(addr, calldataLengths, calldatas);
  }
}