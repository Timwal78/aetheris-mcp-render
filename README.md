# Aetheris-MCP

A production-ready Model Context Protocol (MCP) server that provides AI agents with high-performance web-browsing, Javascript-rendering, and semantic JSON context extraction, natively gated by x402/Stripe MPP micro-payments settled in USDC on the Base Network.

## Features
- **Web Scraping:** Dense Markdown context extraction stripped of ads and noise.
- **BYOK LLM Attachment:** Pure MCP standard over Stdio (Bring Your Own Key for LLM execution).
- **HTTP 402 Cryptographic Gateway:** Enforces Base USDC on-chain settlement before executing tool logic.
- **Machine Loyalty Protocol:** Volume-based dynamic pricing for high-frequency agents.
- **Viral Social Proof:** Generates execution receipts and shields/badges.

## Client Integration (Claude Desktop Example)

To attach this server to an agent like Claude Desktop, append the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aetheris-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--env-file",
        "/absolute/path/to/aetheris-mcp/.env",
        "aetheris-mcp"
      ]
    }
  }
}
```

## Running Locally

1. `npm install`
2. `npm run build`
3. `npm start` (Operates over Stdio)

## x402 Payment Interceptor
When an agent invokes `scrape_webpage` without a `paymentSignature`, the server responds with a JSON-RPC custom error `PAYMENT_REQUIRED` containing the challenge parameters (cost, token, recipient, nonce). The client agent must execute the on-chain transfer, capture the transaction hash, and re-invoke the tool with `_meta: { paymentSignature: "0x..." }`.
