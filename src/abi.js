// Contract ABI for Storage
export const contractABI = [
  {
    "type": "function",
    "name": "addExpense",
    "inputs": [
      { "name": "_expname", "type": "string", "internalType": "string" },
      { "name": "_paidby", "type": "string", "internalType": "string" },
      { "name": "_person1", "type": "string", "internalType": "string" },
      { "name": "_person2", "type": "string", "internalType": "string" },
      { "name": "_paddress", "type": "string", "internalType": "string" },
      { "name": "_amt", "type": "uint256", "internalType": "uint256" },
      { "name": "_status", "type": "uint8", "internalType": "enum Storage.Status" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getExpense",
    "inputs": [{ "name": "_id", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "expname", "type": "string", "internalType": "string" },
          { "name": "paidby", "type": "string", "internalType": "string" },
          { "name": "person1", "type": "string", "internalType": "string" },
          { "name": "person2", "type": "string", "internalType": "string" },
          { "name": "paddress", "type": "string", "internalType": "string" },
          { "name": "amt", "type": "uint256", "internalType": "uint256" },
          { "name": "shareamount", "type": "uint256", "internalType": "uint256" },
          { "name": "status", "type": "uint8", "internalType": "enum Storage.Status" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLength",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStatus",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getShareAmount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateexpense",
    "inputs": [
      { "name": "_expname", "type": "string", "internalType": "string" },
      { "name": "_paidby", "type": "string", "internalType": "string" },
      { "name": "_person1", "type": "string", "internalType": "string" },
      { "name": "_person2", "type": "string", "internalType": "string" },
      { "name": "_paddress", "type": "string", "internalType": "string" },
      { "name": "_amt", "type": "uint256", "internalType": "uint256" },
      { "name": "_status", "type": "uint8", "internalType": "enum Storage.Status" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateStatus",
    "inputs": [{ "name": "_newStatus", "type": "uint8", "internalType": "enum Storage.Status" }],
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