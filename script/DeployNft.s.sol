// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ExpenseNFT} from "../src/ExpenseNFT.sol";

contract DeployNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        ExpenseNFT nft = new ExpenseNFT(deployer);
        
        console.log("NFT Contract Address:", address(nft));
        
        vm.stopBroadcast();
    }
}