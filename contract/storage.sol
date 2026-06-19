// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Storage {
    // Expense status options
    enum Status {
        pending,   // 0
        paid,      // 1
        rejected,  // 2
        badDebt    // 3
    }

    // Expense structure
    struct Expense {
        string expname;
        string paidby;
        string person1;
        string person2;
        string paddress;
        uint256 amt;
        uint256 shareamount;
        Status status;
    }

    Expense[] public expenses;
    uint256 public expenseId;

    // Events
    event ExpenseAdded(uint256 indexed id, string expname, uint256 amt);
    event StatusUpdated(uint256 indexed id, Status newStatus);

    // Add a new expense
    function addExpense(
        string memory _expname,
        string memory _paidby,
        string memory _person1,
        string memory _person2,
        string memory _paddress,
        uint256 _amt,
        Status _status
    ) public {
        uint256 shareAmount = _amt / 3; // Split equally among 3 people
        
        Expense memory newExpense = Expense({
            expname: _expname,
            paidby: _paidby,
            person1: _person1,
            person2: _person2,
            paddress: _paddress,
            amt: _amt,
            shareamount: shareAmount,
            status: _status
        });
        
        expenses.push(newExpense);
        expenseId++;
        
        emit ExpenseAdded(expenseId, _expname, _amt);
    }

    // Get expense by ID
    function getExpense(uint256 _id) public view returns (Expense memory) {
        require(_id < expenses.length, "Expense not found");
        return expenses[_id];
    }

    // Get total expense count
    function getLength() public view returns (uint256) {
        return expenses.length;
    }

    // Get status message for the latest expense
    function getStatus() public view returns (string memory) {
        require(expenses.length > 0, "No expenses found");
        Status currentStatus = expenses[expenses.length - 1].status;
        
        if (currentStatus == Status.pending) {
            return "your expense is pending";
        } else if (currentStatus == Status.paid) {
            return "your expense is paid";
        } else if (currentStatus == Status.rejected) {
            return "your expense is rejected";
        } else if (currentStatus == Status.badDebt) {
            return "your expense is bad debt";
        }
        return "Unknown status";
    }

    // Get share amount for the latest expense
    function getShareAmount() public view returns (uint256) {
        require(expenses.length > 0, "No expenses found");
        return expenses[expenses.length - 1].shareamount;
    }

    // Update status for the latest expense
    function updateStatus(Status _newStatus) public {
        require(expenses.length > 0, "No expenses found");
        expenses[expenses.length - 1].status = _newStatus;
        emit StatusUpdated(expenses.length - 1, _newStatus);
    }

    // Add a new expense (kept for compatibility)
    function updateexpense(
        string memory _expname,
        string memory _paidby,
        string memory _person1,
        string memory _person2,
        string memory _paddress,
        uint256 _amt,
        Status _status
    ) public {
        uint256 shareAmount = _amt / 3;
        expenses.push(Expense({
            expname: _expname,
            paidby: _paidby,
            person1: _person1,
            person2: _person2,
            paddress: _paddress,
            amt: _amt,
            shareamount: shareAmount,
            status: _status
        }));
    }

    // Delete all expenses
    function resetexp() public {
        delete expenses;
        expenseId = 0;
    }
}