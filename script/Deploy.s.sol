// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {ExpenseSplitter} from "../contract/Expense.sol";
import {console} from "forge-std/console.sol";

contract DeployExpense is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        ExpenseSplitter expense = new ExpenseSplitter();

        console.log("ExpenseSplitter deployed to:", address(expense));

        vm.stopBroadcast();
    }
}