// abi.js - FOR YOUR ACTUAL CONTRACT
export const contractABI = [
  {
    "type": "function",
    "name": "addExpense",
    "inputs": [
      { "name": "_description", "type": "string" },
      { "name": "_payer", "type": "string" },
      { "name": "_payee", "type": "string" },
      { "name": "_participant", "type": "string" },
      { "name": "_place", "type": "string" },
      { "name": "_amount", "type": "uint256" },
      { "name": "_status", "type": "uint8" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getExpense",
    "inputs": [{ "name": "_id", "type": "uint256" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "description", "type": "string" },
          { "name": "payer", "type": "string" },
          { "name": "payee", "type": "string" },
          { "name": "participant", "type": "string" },
          { "name": "place", "type": "string" },
          { "name": "amount", "type": "uint256" },
          { "name": "status", "type": "uint8" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLength",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStatus",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getShareAmount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateexpense",
    "inputs": [
      { "name": "_description", "type": "string" },
      { "name": "_payer", "type": "string" },
      { "name": "_payee", "type": "string" },
      { "name": "_participant", "type": "string" },
      { "name": "_place", "type": "string" },
      { "name": "_amount", "type": "uint256" },
      { "name": "_status", "type": "uint8" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateStatus",
    "inputs": [{ "name": "_newStatus", "type": "uint8" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resetexp",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];