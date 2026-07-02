// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
contract ExpenseSplitter { 
    // ENUMS
    enum Status {
        Pending,
        Paid,
        BadDebt
    }
    // STRUCTS
    struct Expense {
        uint256 id;

        string expenseName;
        string location;

        address payer;
        string payerName;

        uint256 totalAmount;
        uint256 shareAmount;

        Status status;

        address[] participants;
        string[] participantNames;

        uint256 paidCount;

        uint256 createdAt;
    }
    // STORAGE
    Expense[] private expenses;
    // expenseId => participant => paid?
    mapping(uint256 => mapping(address => bool))
        public hasPaid;
    // EVENTS
    event ExpenseCreated(
        uint256 indexed expenseId,
        string expenseName,
        address indexed payer,
        uint256 totalAmount,
        uint256 shareAmount
    );
    event SharePaid(
        uint256 indexed expenseId,
        address indexed participant,
        uint256 amount
    );
    event ExpenseCompleted(
        uint256 indexed expenseId
    );
    event ExpenseMarkedBadDebt(
        uint256 indexed expenseId
    );
    // CREATE EXPENSE
    function createExpense(
        string memory _expenseName,
        string memory _location,
        string memory _payerName,
        uint256 _totalAmount,
        address[] memory _participants,
        string[] memory _participantNames
    ) external {
        require(
            bytes(_expenseName).length > 0,
            "Expense name required"
        );
        require(
            _totalAmount > 0,
            "Amount must be greater than zero"
        );
        require(
            _participants.length > 0,
            "Participants required"
        );
        require(
            _participants.length ==
            _participantNames.length,
            "Array mismatch"
        );
        uint256 shareAmount =
            _totalAmount /
            _participants.length;
        expenses.push();
        uint256 expenseId =
            expenses.length - 1;
        Expense storage exp =
            expenses[expenseId];
        exp.id = expenseId;
        exp.expenseName = _expenseName;
        exp.location = _location;
        exp.payer = msg.sender;
        exp.payerName = _payerName;
        exp.totalAmount = _totalAmount;
        exp.shareAmount = shareAmount;
        exp.status = Status.Pending;
        exp.createdAt = block.timestamp;
        bool payerIncluded = false;

        for (
            uint256 i;
            i < _participants.length;
            i++
        ) {

            require(
                _participants[i] != address(0),
                "Invalid participant"
            );

            exp.participants.push(
                _participants[i]
            );

            exp.participantNames.push(
                _participantNames[i]
            );

            if (
                _participants[i] ==
                msg.sender
            ) {

                payerIncluded = true;

                // payer has already paid
                hasPaid[
                    expenseId
                ][msg.sender] = true;

                exp.paidCount++;
            }
        }

        require(
            payerIncluded,
            "Payer must be participant"
        );

        emit ExpenseCreated(
            expenseId,
            _expenseName,
            msg.sender,
            _totalAmount,
            shareAmount
        );
    }

// PAY EXPENSE SHARE


function payExpenseShare(
    uint256 _expenseId
) external payable {

    require(
        _expenseId < expenses.length,
        "Expense not found"
    );

    Expense storage exp = expenses[_expenseId];

    require(
        exp.status == Status.Pending,
        "Expense not pending"
    );

    bool isParticipant = false;

    for (
        uint256 i = 0;
        i < exp.participants.length;
        i++
    ) {

        if (exp.participants[i] == msg.sender) {
            isParticipant = true;
            break;
        }
    }

    require(
        isParticipant,
        "Not a participant"
    );

    require(
        !hasPaid[_expenseId][msg.sender],
        "Already paid"
    );

    require(
        msg.value == exp.shareAmount,
        "Incorrect payment amount"
    );

    // Mark participant as paid
    hasPaid[_expenseId][msg.sender] = true;

    exp.paidCount++;

    // Transfer ETH to payer
    (bool success, ) = payable(exp.payer).call{
        value: msg.value
    }("");

    require(
        success,
        "Transfer failed"
    );

    emit SharePaid(
        _expenseId,
        msg.sender,
        msg.value
    );

    // Everyone paid?
    if (
        exp.paidCount ==
        exp.participants.length
    ) {

        exp.status = Status.Paid;

        emit ExpenseCompleted(
            _expenseId
        );
    }
}
// MARK BAD DEBT
function markBadDebt(
    uint256 _expenseId
) external {

    require(
        _expenseId < expenses.length,
        "Expense not found"
    );

    Expense storage exp = expenses[_expenseId];

    require(
        msg.sender == exp.payer,
        "Only payer can call"
    );

    require(
        exp.status == Status.Pending,
        "Expense not pending"
    );

    exp.status = Status.BadDebt;

    emit ExpenseMarkedBadDebt(
        _expenseId
    );
}

// GET EXPENSE COUNT

function getExpenseCount()
    external
    view
    returns (uint256)
{
    return expenses.length;
}
// GET EXPENSE
function getExpense(
    uint256 _expenseId
)
    external
    view
    returns (
        uint256 id,
        string memory expenseName,
        string memory location,
        address payer,
        string memory payerName,
        uint256 totalAmount,
        uint256 shareAmount,
        Status status,
        address[] memory participants,
        string[] memory participantNames,
        uint256 paidCount,
        uint256 createdAt
    )
{
    require(
        _expenseId < expenses.length,
        "Expense not found"
    );

    Expense storage exp =
        expenses[_expenseId];

    return (
        exp.id,
        exp.expenseName,
        exp.location,
        exp.payer,
        exp.payerName,
        exp.totalAmount,
        exp.shareAmount,
        exp.status,
        exp.participants,
        exp.participantNames,
        exp.paidCount,
        exp.createdAt
    );
}

// GET STATUS
function getExpenseStatus(
    uint256 _expenseId
)
    external
    view
    returns (Status)
{
    require(
        _expenseId < expenses.length,
        "Expense not found"
    );

    return expenses[_expenseId].status;
}

// HAS PARTICIPANT PAID

function hasParticipantPaid(
    uint256 _expenseId,
    address _participant
)
    external
    view
    returns (bool)
{
    require(
        _expenseId < expenses.length,
        "Expense not found"
    );

    return hasPaid[
        _expenseId
    ][_participant];
}
// GET REMAINING PARTICIPANTS
function getRemainingParticipants(
    uint256 _expenseId
)
    external
    view
    returns (address[] memory)
{
    require(
        _expenseId < expenses.length,
        "Expense not found"
    );

    Expense storage exp =
        expenses[_expenseId];

    uint256 count;

    for (
        uint256 i;
        i < exp.participants.length;
        i++
    ) {
        if (
            !hasPaid[
                _expenseId
            ][exp.participants[i]]
        ) {
            count++;
        }
    }

    address[] memory remaining =
        new address[](count);

    uint256 index;
    for (
        uint256 i;
        i < exp.participants.length;
        i++
    ) {
        if (
            !hasPaid[
                _expenseId
            ][exp.participants[i]]
        ) {
            remaining[index] =
                exp.participants[i];

            index++;
        }
    }
    return remaining;
   }
}