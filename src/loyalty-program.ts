// Machine volume tracking system: Grants dynamic scale-discounts directly to active agent public keys
export class AgentLoyaltyProgram {
  private agentCallRegistry: Map<string, number> = new Map();

  public registerUsageAndCalculateCost(agentAddress: string, basePrice: number): {
    currentPrice: number;
    usageCount: number;
    tier: string;
  } {
    const totalCalls = (this.agentCallRegistry.get(agentAddress.toLowerCase()) || 0) + 1;
    this.agentCallRegistry.set(agentAddress.toLowerCase(), totalCalls);

    let multiplier = 1.0;
    let tier = "Bronze Core";

    if (totalCalls > 100) {
      multiplier = 0.50; // 50% discount for enterprise power-agents
      tier = "Diamond Core";
    } else if (totalCalls > 50) {
      multiplier = 0.70; // 30% discount
      tier = "Platinum Core";
    } else if (totalCalls > 10) {
      multiplier = 0.85; // 15% discount
      tier = "Gold Core";
    }

    return {
      currentPrice: parseFloat((basePrice * multiplier).toFixed(4)),
      usageCount: totalCalls,
      tier: tier
    };
  }
}
