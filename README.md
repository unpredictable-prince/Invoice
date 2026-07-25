# Midnight Invoice DApp

A Full-Stack decentralized application for private, secure invoicing on the Midnight Network.

## Contract Address

**MANDATORY:** You must manually deploy the smart contract and replace this placeholder to test the application.

| Network | Contract Address |
|---------|------------------|
| Preprod | `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` |

Alternatively, via environment variable:
```env
CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
```

## Features
- **Private Invoicing:** Create and pay invoices securely on the Midnight blockchain.
- **Zero-Knowledge Proofs:** Leverages Midnight's privacy-first capabilities to keep your payment details and identity safe.
- **Responsive UI:** Built with React and optimized for a seamless user experience.
- **Full-Stack CLI & API:** A complete developer toolchain for interacting with the blockchain programmatically.

## What This Project Does
This project provides a complete template for an Invoice management system. Users can create a new invoice which contains an amount and description. Only the designated payer, or an authorized entity, can fulfill the payment using Zero-Knowledge proofs. The public ledger simply records the state of the invoice without revealing the payer's private keys.

## Privacy Model
- **Public Information:** The invoice amount, description, and status (`UNPAID` / `PAID`) are publicly verifiable on the ledger. 
- **Private Information:** The user's secret keys and local witness data remain completely off-chain.
- **What users prove without revealing:** Users prove they have the correct private keys to authorize the payment without ever exposing their keys to the public ledger or other users.

## Tech Stack
- **Smart Contracts:** Compact (Midnight Network)
- **Frontend:** React, TypeScript, Vite, Material UI
- **Backend & Integrations:** Node.js, Midnight.js SDK
- **Environment:** Docker, Node v24

## Folder Structure
```
.
├── api/             # Backend wrapper and Midnight provider integration
├── contract/        # Compact smart contracts and deployment scripts
├── invoice-cli/     # Command-line interface for the DApp
├── invoice-ui/      # React Frontend
└── rename.js        # Refactoring utility
```

## Prerequisites
- Node.js v24.11.1 or higher (or v22 if required by strict challenge environment)
- Docker installed and running
- Midnight Proof Server running in Docker

## Installation

1. Install dependencies for the root and all workspaces:
```bash
npm install
```

2. Start the Proof Server in Docker:
```bash
docker pull midnightnetwork/proof-server
docker run -p 6300:6300 midnightnetwork/proof-server
```

## Compile

Compile the Compact smart contract into TypeScript definitions:
```bash
npm run compact
```

## Build

Build the full-stack workspace (contract, API, CLI, UI):
```bash
npm run build
```

## Manual Deployment

Deployment is intentionally skipped in the codebase. To deploy the compiled contract, execute the following command:

```bash
NODE_OPTIONS="--max-old-space-size=12288" npm run deploy -- --network preprod
```

Wait for the deployment to finish, and copy the resulting contract address.

## After Deployment

The only remaining manual steps are:
1. Deploy the Compact contract using the command above.
2. Copy the deployed contract address.
3. Replace every occurrence of `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` in the source code.
4. Run the UI locally: `cd invoice-ui && npm run dev`

## Environment Variables
- `CONTRACT_ADDRESS`: The deployed Midnight smart contract address.
- `NETWORK`: The target network (e.g., `preprod`).

## Screenshots

*(Placeholder for screenshots of the Invoice DApp)*

## Initial Idea

*(Placeholder for Initial Idea)*

## Troubleshooting
- **Compact compilation fails:** Ensure `@midnight-ntwrk/compact-compiler` is installed globally or available in the local bin.
- **Proof Server Connection Refused:** Verify that Docker is running and the port 6300 is bound correctly.
- **Node version error:** Ensure you are running Node `>= 24.11.1` as per the `package.json` engines requirement.
