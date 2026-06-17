// Standardized x402 Micropayment Interceptor and Receipt Verifier
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

export interface X402Challenge {
  x402Version: string;
  amount: string;
  token: string;
  chain: string; // eip155:8453 (Base Mainnet)
  recipient: string;
  nonce: string;
  message: string;
}

export class X402PaymentProcessor {
  private provider: ethers.JsonRpcProvider;
  private usdcContract: string;
  private merchantAddress: string;
  private settledTxHashes: Set<string> = new Set();

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://mainnet.base.org');
    this.usdcContract = (process.env.USDC_CONTRACT_ADDRESS || '').toLowerCase();
    this.merchantAddress = (process.env.MERCHANT_WALLET_ADDRESS || '').toLowerCase();
  }

  // Generates the x402 HTTP challenge parameters or JSON-RPC metadata
  public generateChallenge(costInUSDC: number): X402Challenge {
    const nonce = ethers.hexlify(ethers.randomBytes(32));
    return {
      x402Version: "2.1.0",
      amount: costInUSDC.toFixed(4),
      token: "USDC",
      chain: "eip155:8453",
      recipient: this.merchantAddress,
      nonce: nonce,
      message: `Aetheris-MCP tool access requires ${costInUSDC} USDC payment.`
    };
  }

  // Verifies a real transaction on-chain via transaction hash
  public async verifyPaymentSignature(txHash: string, expectedCost: number): Promise<boolean> {
    if (this.settledTxHashes.has(txHash)) {
       throw new Error("Replay attack detected: Transaction signature already redeemed.");
    }

    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) return false;

      const receipt = await tx.wait(1);
      if (!receipt || receipt.status !== 1) return false;

      // Extract ERC-20 transfer event to verify recipient and payment amount
      // Standard ERC-20 Transfer Signature Topic: Transfer(address,address,uint256)
      const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
      let matchedPayment = false;

      for (const log of receipt.logs) {
        if (log.address.toLowerCase() === this.usdcContract && log.topics[0] === transferTopic) {
          const toAddress = ethers.hexlify(ethers.stripZerosLeft(log.topics[2])).toLowerCase();
          
          if (toAddress === this.merchantAddress) {
            const transferAmount = BigInt(log.data);
            const expectedWei = BigInt(Math.round(expectedCost * 1000000)); // USDC has 6 decimals

            if (transferAmount >= expectedWei) {
              matchedPayment = true;
              break;
            }
          }
        }
      }

      if (matchedPayment) {
        this.settledTxHashes.add(txHash);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Cryptographic payment verification error:", err);
      return false;
    }
  }
}
