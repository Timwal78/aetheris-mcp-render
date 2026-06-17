# 🛡️ Aetheris-MCP: The x402 Agentic Web Scraper

[![Render](https://img.shields.io/badge/Deploy_to-Render-blue?style=for-the-badge&logo=render)](https://render.com)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Standard-green?style=for-the-badge)](https://modelcontextprotocol.io)
[![Base](https://img.shields.io/badge/Base-Network-0052FF?style=for-the-badge&logo=base)](https://base.org)

**Aetheris-MCP** is an enterprise-grade Server-Sent Events (SSE) Model Context Protocol server. It provides AI Agents with high-fidelity, ad-free Markdown web scraping capabilities, protected by an on-chain **x402 Micropayment Interceptor**. 

Bring Your Own Key (BYOK) for inference. Settle in USDC on Base for context.

## 🏗️ Architecture
* **Engine:** Node.js + Express
* **Scraper:** JSDOM (Deep DOM sanitization, strips scripts/styles/ads)
* **Transport:** Server-Sent Events (`/sse` & `/message`)
* **Monetization:** `ethers.js` (EVM HTTP 402 validation on Base Mainnet)

## 🚀 One-Click Deployment
This repository is configured with a `render.yaml` Blueprint.

1. Fork this repository.
2. Go to your [Render Dashboard](https://dashboard.render.com).
3. Click **New** -> **Blueprint**.
4. Connect the forked repository. Render will automatically detect the configuration and deploy the Express server.

## ⚙️ Environment Variables
Ensure you set these in your hosting environment:
* `REQUIRE_PAYMENT` (boolean) - Enforces the 402 interceptor.
* `BASE_MICROPAYMENT_COST` (float) - USDC cost per scrape (e.g., `0.01`).
* `USDC_CONTRACT_ADDRESS` - The target ERC-20 contract.
* `MERCHANT_WALLET_ADDRESS` - Your EVM public key.
* `RPC_URL` - Your Web3 RPC provider (defaults to `https://mainnet.base.org`).

## 💻 Client Integration
Agents should NOT connect to this server manually. Use the official Auto-Settlement SDK:
`npm install @aetheris/mcp-client`

See the [Client SDK Repository](https://github.com/Timwal78/aetheris-client-sdk) for documentation on how the SDK intercepts the 402 challenge and settles the transaction autonomously.
