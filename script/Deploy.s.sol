// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Storage} from "../contract/Storage.sol";
import {console} from "forge-std/console.sol";  // ← ADD THIS LINE

contract DeployStorage is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        Storage storageContract = new Storage();
        
        console.log("Storage deployed to:", address(storageContract));
        
        vm.stopBroadcast();
    }
}