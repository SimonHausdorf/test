// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract GRNToken is ERC20, ERC20Burnable {
    constructor (address[] memory recipients, uint256[] memory values) public ERC20('GreenPower', 'GRN') {
        for (uint256 i = 0; i < recipients.length; i++)
            _mint(recipients[i], values[i]);

    }
}

