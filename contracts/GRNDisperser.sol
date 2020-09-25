// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract GRNDisperser {
    ERC20Burnable GRNToken;
    address distr;
    
    constructor(ERC20Burnable _GRNToken, address _distr) public{
        GRNToken = _GRNToken;
        distr = _distr;
    }

    function disperseToken(address[] memory recipients, uint256[] memory values) external {
        require(msg.sender == distr, "Can only be called by distribution account");

        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++)
            total += values[i];
            
        require(GRNToken.transferFrom(msg.sender, address(this), total));
        
        for (uint256 j = 0; j < recipients.length; j++)
            require(GRNToken.transfer(recipients[j], values[j]));
    }
}

