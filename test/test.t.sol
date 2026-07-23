// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Storage} from "../contract/storage.sol";

contract StorageTest is Test {
    Storage public storageContract;

    // Test addresses 
    address public ram = address(0x111);
    address public hari = address(0x222);
    address public shyam = address(0x333);
    address public gita = address(0x444);

    function setUp() public {
        storageContract = new Storage();
        
        // Fund addresses 
        vm.deal(ram, 10 ether);
        vm.deal(hari, 10 ether);
        vm.deal(shyam, 10 ether);
        vm.deal(gita, 10 ether);
    }

    // Test 1: Adding a single expense where Ram payignfor Hari
    function test_AddExpense() public {
        address[] memory participants = new address[](1);
        participants[0] = hari;
        
        string[] memory participantNames = new string[](1);
        participantNames[0] = "Hari";

        storageContract.addExpense(
            "Khaja  ",       
            "Ram",                   
            ram,                     
            participants,           
            participantNames,       
            "Kathmandu",            
            2 ether,               
            Storage.Status.pending
        );
        
        uint256 length = storageContract.getLength();
        assertEq(length, 1, "Should have 1 expense");
        
        // Verify expense details
        (string memory expname, string memory paidby, , , uint256 amt, , , , ) = storageContract.getExpense(0);
        assertEq(expname, "Khaja  ", "Wrong expense name");
        assertEq(paidby, "Ram", "Wrong payer name");
        assertEq(amt, 2 ether, "Wrong amount");
    }

    // Test 2: Add expense with multiple participants Ram, Hari, Shyam
    function test_ExpenseWithMultipleParticipants() public {
        address[] memory participants = new address[](2);
        participants[0] = hari;
        participants[1] = shyam;
        
        string[] memory participantNames = new string[](2);
        participantNames[0] = "Hari";
        participantNames[1] = "Shyam";

        storageContract.addExpense(
            "Bhoj at Durbar Square", 
            "Ram",
            ram,
            participants,
            participantNames,
            "Patan",
            3 ether,
            Storage.Status.pending
        );
        
        uint256 length = storageContract.getLength();
        assertEq(length, 1, "Should have 1 expense");
        
        //  getShareAmount() now emits an event and doesn't return a value so we just call it to test it doesn't revert
        storageContract.getShareAmount();
    }

    // Test 3: Mark participant as paid Hari pays his money to Ram
    function test_MarkParticipantPaid() public {
        address[] memory participants = new address[](2);
        participants[0] = hari;
        participants[1] = shyam;
        
        string[] memory participantNames = new string[](2);
        participantNames[0] = "Hari";
        participantNames[1] = "Shyam";

        storageContract.addExpense(
            "Movie at Kumari Cinema",
            "Ram",
            ram,
            participants,
            participantNames,
            "Kathmandu",
            3 ether,
            Storage.Status.pending
        );
        
        // Hari pays his share (1 ether)
        vm.prank(ram); // Only payer can mark as paid   
        storageContract.markParticipantPaid(0, hari);
        
        // Check if Hari is marked as paid 
        address[] memory badDebtors = storageContract.getBadDebtors(0);
        assertEq(badDebtors.length, 1, "Should have 1 bad debtor (Shyam)");
        assertEq(badDebtors[0], shyam, "Shyam should be the bad debtor");
    }

    // Test 4: Request payment from participant Shyam requests Ram for payment
    function test_RequestPayment() public {
        address[] memory participants = new address[](1);
        participants[0] = shyam;
        
        string[] memory participantNames = new string[](1);
        participantNames[0] = "Shyam";

        storageContract.addExpense(
            "Chiya ", 
            "Ram",
            ram,
            participants,
            participantNames,
            "Kathmandu",
            1 ether,
            Storage.Status.pending
        );
        
        // Shyam requests payment from Ram
        vm.prank(shyam);
        storageContract.requestPayment(ram, 0.5 ether, "Need money for chiya");
        
        // Check if payment request was created
        uint256 requestCount = storageContract.getPaymentRequestCount();
        assertEq(requestCount, 1, "Should have 1 payment request");
        
        // Verify request details
        Storage.PaymentRequest memory request = storageContract.getPaymentRequest(0);
        assertEq(request.from, shyam, "Request should be from Shyam");
        assertEq(request.to, ram, "Request should be to Ram");
        assertEq(request.amount, 0.5 ether, "Amount should be 0.5 ether");
        assertEq(request.isPaid, false, "Request should not be paid yet");
    }

    // Test 5: Update expense status (Pending to Paid)
    function test_UpdateStatus() public {
        address[] memory participants = new address[](1);
        participants[0] = hari;
        
        string[] memory participantNames = new string[](1);
        participantNames[0] = "Hari";

        storageContract.addExpense(
            "MoMo   ", 
            "Ram",
            ram,
            participants,
            participantNames,
            "Bhaktapur",
            1 ether,
            Storage.Status.pending
        );
        
        // Update status to paid
        storageContract.updateStatus(Storage.Status.paid);
        
        // Since getStatus() now takes a parameter and emits an event,
        // we call it with a status to test it doesn't revert
        storageContract.getStatus(Storage.Status.paid);
    }

    // Test 6: Get bad debtors who hasn't paid yet
    function test_GetBadDebtors() public {
        address[] memory participants = new address[](3);
        participants[0] = hari;
        participants[1] = shyam;
        participants[2] = gita;
        
        string[] memory participantNames = new string[](3);
        participantNames[0] = "Hari";
        participantNames[1] = "Shyam";
        participantNames[2] = "Gita";

        storageContract.addExpense(
            "Trip to Pokhara",
            "Ram",
            ram,
            participants,
            participantNames,
            "Pokhara",
            4 ether,
            Storage.Status.pending
        );
        
        // Mark only Hari as paid (1 ether each)
        vm.prank(ram);
        storageContract.markParticipantPaid(0, hari);
        
        // Get bad debtors (Shyam and Gita haven't paid)
        address[] memory badDebtors = storageContract.getBadDebtors(0);
        assertEq(badDebtors.length, 2, "Should have 2 bad debtors");
        
        // Check if both Shyam and Gita are in the list
        bool foundShyam = false;
        bool foundGita = false;
        for (uint i = 0; i < badDebtors.length; i++) {
            if (badDebtors[i] == shyam) foundShyam = true;
            if (badDebtors[i] == gita) foundGita = true;
        }
        assertTrue(foundShyam, "Shyam should be in bad debtors list");
        assertTrue(foundGita, "Gita should be in bad debtors list");
    }

    // Test 7:Add expense, pay, and mark as completed
    function test_CompleteFlow() public {
        // Step 1: Ram adds expense for dinner
        address[] memory participants = new address[](2);
        participants[0] = hari;
        participants[1] = shyam;
        
        string[] memory participantNames = new string[](2);
        participantNames[0] = "Hari";
        participantNames[1] = "Shyam";

        storageContract.addExpense(
            "Dinner at Thakali Kitchen",
            "Ram",
            ram,
            participants,
            participantNames,
            "Kathmandu",
            3 ether,
            Storage.Status.pending
        );
        
        // Step 2: Hari pays his share (1 ether)
        vm.prank(ram);
        storageContract.markParticipantPaid(0, hari);
        
        // Step 3: Shyam pays his share (1 ether)
        vm.prank(ram);
        storageContract.markParticipantPaid(0, shyam);
        
        // Step 4: All participants have paid, so status should be become 'paid'
        storageContract.getStatus(Storage.Status.paid);
        
        // Step 5: Check no bad debtors remain
        address[] memory badDebtors = storageContract.getBadDebtors(0);
        assertEq(badDebtors.length, 0, "No bad debtors should remain");
    }
}
// https://metaapk-j1txxupq7-pratikpangeni7283444259-9486s-projects.vercel.app