import { X402PaymentProcessor } from '../src/x402-payment.js';
import { AgentLoyaltyProgram } from '../src/loyalty-program.js';

describe('Aetheris-MCP Core Systems Tests', () => {
  let paymentProcessor: X402PaymentProcessor;
  let loyaltyProgram: AgentLoyaltyProgram;

  beforeAll(() => {
    paymentProcessor = new X402PaymentProcessor();
    loyaltyProgram = new AgentLoyaltyProgram();
  });

  test('x402 challenge should match standard format specs', () => {
    const challenge = paymentProcessor.generateChallenge(0.01);
    expect(challenge.x402Version).toBe("2.1.0");
    expect(challenge.token).toBe("USDC");
    expect(challenge.chain).toBe("eip155:8453");
    expect(challenge.amount).toBe("0.0100");
  });

  test('Machine Loyalty Program should apply volume discount tiers', () => {
    const agent = "0x8976C8B56A15E824F251354d117bf0167F320ced";
    
    // Call 1: Bronze (0% discount)
    const call1 = loyaltyProgram.registerUsageAndCalculateCost(agent, 0.01);
    expect(call1.currentPrice).toBe(0.01);
    expect(call1.tier).toBe("Bronze Core");

    // Simulate 11 calls to push into Gold Tier (15% discount)
    for(let i = 0; i < 10; i++) {
      loyaltyProgram.registerUsageAndCalculateCost(agent, 0.01);
    }
    const call12 = loyaltyProgram.registerUsageAndCalculateCost(agent, 0.01);
    expect(call12.currentPrice).toBe(0.0085);
    expect(call12.tier).toBe("Gold Core");
  });
});
