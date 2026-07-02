// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contract/Expense.sol";

contract ExpenseSplitterTest is Test {

    ExpenseSplitter expense;

    address payer = address(1);
    address alice = address(2);
    address bob = address(3);

    function setUp() public {
        expense = new ExpenseSplitter();
    }

    function createSampleExpense() internal {
        address[] memory participants = new address[](3);
        participants[0] = payer;
        participants[1] = alice;
        participants[2] = bob;

        string[] memory names = new string[](3);
        names[0] = "John";
        names[1] = "Alice";
        names[2] = "Bob";

        vm.prank(payer);

        expense.createExpense(
            "Dinner",
            "Restaurant",
            "John",
            3 ether,
            participants,
            names
        );
    }

    // CREATE EXPENSE

    function test_CreateExpense() public {

        createSampleExpense();

        assertEq(expense.getExpenseCount(), 1);
    }

    // GET EXPENSE

    function test_GetExpense() public {

        createSampleExpense();

        (
            uint256 id,
            string memory expenseName,
            string memory location,
            address expensePayer,
            string memory payerName,
            uint256 totalAmount,
            uint256 shareAmount,
            ExpenseSplitter.Status status,
            ,
            ,
            uint256 paidCount,

        ) = expense.getExpense(0);

        assertEq(id, 0);
        assertEq(expenseName, "Dinner");
        assertEq(location, "Restaurant");
        assertEq(expensePayer, payer);
        assertEq(payerName, "John");
        assertEq(totalAmount, 3 ether);
        assertEq(shareAmount, 1 ether);
        assertEq(uint(status), 0);
        assertEq(paidCount, 1);
    }

    
    // HAS PARTICIPANT PAID


    function test_HasParticipantPaid() public {

        createSampleExpense();

        assertTrue(
            expense.hasParticipantPaid(0, payer)
        );

        assertFalse(
            expense.hasParticipantPaid(0, alice)
        );
    }

    // PAY SHARE

    function test_PayExpenseShare() public {

        createSampleExpense();

        vm.deal(alice, 1 ether);

        vm.prank(alice);

        expense.payExpenseShare{value: 1 ether}(0);

        assertTrue(
            expense.hasParticipantPaid(0, alice)
        );
    }

    // COMPLETE EXPENSE

    function test_CompleteExpense() public {

        createSampleExpense();

        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);

        vm.prank(alice);
        expense.payExpenseShare{value: 1 ether}(0);

        vm.prank(bob);
        expense.payExpenseShare{value: 1 ether}(0);

        ExpenseSplitter.Status status =
            expense.getExpenseStatus(0);

        assertEq(
            uint(status),
            uint(ExpenseSplitter.Status.paid)
        );
    }

    // MARK BAD DEBT
    function test_MarkBadDebt() public {

        createSampleExpense();

        vm.prank(payer);

        expense.markBadDebt(0);

        ExpenseSplitter.Status status =
            expense.getExpenseStatus(0);

        assertEq(
            uint(status),
            uint(ExpenseSplitter.Status.badDebt)
        );
    }

    // REMAINING PARTICIPANTS

    function test_RemainingParticipants() public {

        createSampleExpense();

        address[] memory remaining =
            expense.getRemainingParticipants(0);

        // payer has already paid
        assertEq(remaining.length, 2);

        vm.deal(alice, 1 ether);

        vm.prank(alice);

        expense.payExpenseShare{value: 1 ether}(0);

        remaining =
            expense.getRemainingParticipants(0);

        assertEq(remaining.length, 1);
        assertEq(remaining[0], bob);
    }
}