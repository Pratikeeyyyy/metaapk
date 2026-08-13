# Splitting the Bill, On-Chain: Building ExpenseShare, a Decentralized Expense Tracker

*How I built a trustless, blockchain-powered expense-sharing app — from Solidity smart contracts to a live React frontend.*

---

## The Problem

Every group trip, dinner, or shared apartment comes with the same awkward ritual: someone pays, someone tracks, and someone always *forgets to pay back*. The spreadsheet becomes a mess, text-message IOUs get lost, and "who owes whom" is always a guessing game.

What if the tracking, the splitting, and the settlement all happened automatically — with a permanent, tamper-proof record that nobody can dispute?

That's exactly what **ExpenseShare** does. It's a decentralized application (DApp) built on the Ethereum Sepolia testnet where expenses are split, tracked, and settled transparently on the blockchain.

---

## The Solution

ExpenseShare lets you:

- **Connect your MetaMask wallet** and start splitting expenses instantly
- **Create expenses** with multiple participants — the smart contract calculates everyone's share automatically
- **Track who owes whom** in real-time with live dashboard stats
- **Send payment requests** and settle debts directly on-chain
- **Flag bad debtors** when people don't pay up
- **Mint NFT receipts** as permanent proof that an expense was settled

The whole thing runs with **zero backend**. There's no server, no central database — just a smart contract doing all the heavy lifting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 3 |
| Web3 | ethers.js v5, MetaMask |
| Smart Contracts | Solidity 0.8, Foundry (Forge) |
| NFT Standard | OpenZeppelin ERC721 |
| Storage | IPFS via Pinata |
| Network | Ethereum Sepolia testnet |
| CI/CD | GitHub Actions, Vercel |

---

## The Smart Contracts

### 1. `Storage.sol` — The Expense Manager

This contract is the heart of the app. Every expense lives on-chain as an immutable record:

```solidity
enum Status { pending, paid, rejected, badDebt }

struct Expense {
    string expname;
    string paidby;
    address payerAddress;
    string paddress;
    uint256 amt;
    uint256 shareamount;
    Status status;
    address[] participants;
    string[] participantNames;
    mapping(address => bool) hasPaid;
}
```

**Key mechanics:**

- **Equal splitting** — the share is computed on-chain: `amt / (participants + 1)`.
- **Lifecycle tracking** — every expense moves through `pending → paid`, or falls into `rejected` / `badDebt`.
- **Payment requests** — a participant who wants their money back can create an on-chain request, and the debtor can settle it by sending ETH directly through the contract.
- **Bad debt detection** — `getBadDebtors()` scans participants who haven't paid, so defaulters are always identifiable.
- **Events everywhere** — `ExpenseAdded`, `ParticipantPaid`, `PaymentRequested`, `PaymentCompleted`, and `StatusUpdated` let the frontend react to state changes in real time.

### 2. `ExpenseNFT.sol` — Proof of Settlement

Each fully-paid expense can be minted into an **NFT receipt**:

```solidity
contract ExpenseNFT is ERC721, ERC721URIStorage, ERC721Pausable, Ownable, ERC721Burnable
```

- Only the **payer** (the actual owner) can mint, and only after the expense is fully **paid** — it's a genuine receipt, not a participation trophy.
- NFT metadata and images are uploaded to **IPFS via Pinata**, so the receipt lives permanently on decentralized storage.
- The NFT contract tracks which expense maps to which token, and users can even **import their receipts straight into MetaMask** via `wallet_watchAsset`.

---

## The Frontend

The React app is deliberately simple in structure but rich in features:

- **Landing page** with a full marketing story, feature grid, and "how it works" section
- **Auth pages** (register/login) gated by a route guard
- **Dashboard** showing summary stats — pending, paid, received, and *payment due* (what *you* owe others)
- **Dynamic participant forms** — add up to 10 people with names and wallet addresses
- **Live refresh** — the dashboard polls the chain every 15 seconds, so statuses update as participants pay
- **Bad debt section** that surfaces defaulters with their addresses and amounts
- **Dark mode** toggled and persisted via `localStorage`

One nice touch: payments are processed in two steps. The participant sends ETH directly to the payer via `signer.sendTransaction`, then the payer marks them as paid in the contract. This keeps real value flowing between wallets while the contract maintains the trusted record.

---

## Testing & CI

The project ships with **7 Foundry tests** covering the full business logic:

- Adding a single-expense and verifying stored details
- Multi-participant splitting
- Marking participants as paid and confirming the remaining bad debtor
- Creating and verifying payment requests
- Updating expense status
- Extracting all bad debtors from a 4-person expense
- A complete end-to-end flow: add → pay → all settled

GitHub Actions runs `forge fmt --check`, `forge build --sizes`, and `forge test -vvv` on every push, so the contract logic is continuously verified.

---

## Deployment

- **Frontend:** live on Vercel
- **Smart contracts:** deployed on the Sepolia testnet

> Deployed contract addresses are available in the repo's `src/Expenseapp.jsx` and broadcast logs.

---

## Challenges & Lessons Learned

1. **Wallet ↔ contract coordination.** Making real ETH transfers while keeping the on-chain ledger accurate required a careful two-step design — direct wallet-to-wallet payment, then an on-chain status update. It's the difference between a "ledger app" and a real settlement tool.

2. **Gas-conscious events.** Converting view functions into event-emitting functions (e.g., `getStatus`) taught me that on-chain state changes cost gas, and events are the cheap, standard way to surface state to the UI.

3. **NFT gating logic.** Deciding *who* can mint a receipt NFT and *when* (only the payer, only after full payment) forced me to think hard about what an NFT receipt should actually represent.

4. **Sepolia chain management.** The app auto-switches users to Sepolia via `wallet_switchEthereumChain` and gracefully handles the case where the network isn't added yet.

---

## What's Next

- 🔔 Notification system for due payments
- 💳 ERC20 token support instead of raw ETH
- 📊 Analytics dashboard with spending insights
- 🔄 Automatic escrow settlement
- 📱 Mobile app version
- 🤖 AI-based expense prediction
- **Fix SPA routing on Vercel** (currently direct URL navigation to `/login` or `/register` returns 404 — a simple rewrite config fixes this)

---

## Try It Yourself

1. Install MetaMask and connect to the **Sepolia** testnet (the app does this for you).
2. Grab some free test ETH from a Sepolia faucet.
3. Open the live app, create an expense, split it with friends, and mint your first receipt NFT.

---

## Final Thoughts

Building ExpenseShare showed me how blockchain genuinely solves a real-world coordination problem. There's no middleman, no spreadsheet, no "I'll pay you back later" — just transparent, immutable, trustless expense tracking.

**Transparency. Trustless execution. Accountability. Immutable records.** That's what happens when you put a bill on the blockchain.

---

*Repo: [github.com/Pratikeeyyyy/metaapk](https://github.com/Pratikeeyyyy/metaapk)*
