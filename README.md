# ₿ Soluf Bitcoin Explorer

Soluf is a high-performance, AI-augmented Bitcoin blockchain explorer. It provides real-time access to the Bitcoin ledger via GetBlock.io RPC and leverages **Gemini 3 Pro** to provide deep technical analysis of blocks and transactions.

## ✨ Key Features

- **Real-time Blockchain Metrics**: Live dashboard showing network hashrate, block height, difficulty, and synchronization progress.
- **AI-Powered Insights**: Integrated **Gemini 3 Pro** analysis for translating complex cryptographic data into human-readable technical reports.
- **Educational Layer**: Interactive tooltips explaining core protocol concepts such as Merkle Roots, SegWit Weighting, vSize, and Difficulty targets.
- **Web3 Identity Ready**: Pre-integrated with **Web3Auth (Sapphire Devnet)** for secure, passwordless identity management.
- **High-Performance UI**: Built with React 19 and Tailwind CSS, featuring glassmorphism aesthetics and smooth transitions.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (via `@google/genai`)
- **Infrastructure**: [GetBlock.io](https://getblock.io/) Bitcoin RPC
- **Authentication**: [Web3Auth](https://web3auth.io/) (Sapphire Devnet)

## 🚀 Configuration

### Bitcoin RPC
The application connects to a Bitcoin node using the following endpoint:
`https://go.getblock.io/4c2f115ed7c943e485c261b545a6dc8b`

### Gemini AI
AI features require a valid Google Gemini API Key. The application uses the following models:
- **gemini-3-pro-preview**: For complex blockchain reasoning and transaction logic decoding.
- **gemini-3-flash-preview**: For rapid summarization and general Q&A.

### Web3Auth
- **Client ID**: `BBc7Oph1MvvAGTRX00qZLMhn2EQNZzcDnq402gUfFOWkUDxp2cPLQ3vfQJ6tG50ewDPPZJudhGvpNKtfXJ2KKTQ`
- **Environment**: Sapphire Devnet
- **JWKS Endpoint**: `https://api-auth.web3auth.io/.well-known/jwks.json`

## 📖 Educational Tooltips
The explorer acts as a learning tool. Hover over technical labels (e.g., *Merkle Root*, *vSize*, *Chainwork*) to see precise protocol definitions. These are designed to help new developers understand the cryptographic underpinnings of the Bitcoin network.

## 🤝 Contributing
Soluf is designed as a template for modern Web3 explorers. Feel free to extend the `BitcoinRpcService` to add support for more methods or improve the AI prompts in `GeminiService`.

---
*Built with passion for the Bitcoin ecosystem.*
