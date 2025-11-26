// Lenso Business Constants
export const BUSINESS_CONSTANTS = {
  // Store Metrics
  TARGET_MONTHLY_REVENUE_PER_STORE: 450000, // MXN
  AVG_GLASSES_PRICE: 2500, // MXN
  GROSS_MARGIN: 0.50, // 50%
  EBITDA_MARGIN: 0.20, // 20%

  // Expansion Plan
  COST_PER_STORE_MIN: 2000000, // 2M MXN
  COST_PER_STORE_MAX: 3000000, // 3M MXN
  RAMP_UP_MONTHS: 6, // Months to reach target revenue
  CURRENT_STORES: 2, // Plaza Patria & La Perla

  // Capital Structure
  TOTAL_RAISE: 30000000, // 30M MXN
  EQUITY_CAPITAL: 25000000, // 25M MXN
  DEBT_CAPITAL: 5000000, // 5M MXN
  DEBT_INTEREST_RATE: 0.155, // 15.5% annual

  // Valuation & Exit
  REVENUE_MULTIPLE_LOW: 1.5,
  REVENUE_MULTIPLE_HIGH: 1.7,
  EBITDA_MULTIPLE_RETAIL: 8, // Standard retail multiple
  MIN_STORES_FOR_EXIT: 15,
  SAFE_DISCOUNT: 0.35, // 35% discount

  // Fees
  FEES: {
    STRUCTURING: 0.008, // 0.80%
    PLACEMENT: 0.012, // 1.20%
    LEGAL: 0.004, // 0.40%
    TOTAL: 0.024 // 2.40%
  }
}

// Investment Banker - Equity Structuring Strategy
export const EQUITY_TRANCHES = {
  SEED: {
    name: 'Seed Round',
    targetAmount: 8000000, // 8M MXN
    minTicket: 500000, // 500K MXN
    maxTicket: 2000000, // 2M MXN
    rights: [
      'Participación proporcional en dividendos',
      'Derecho de información trimestral',
      'Anti-dilución parcial en siguiente ronda',
      'Tag-along rights (derecho de salida conjunta)'
    ],
    preferredReturn: 0, // No preferred return
    liquidationPreference: 1.0, // 1x non-participating
    discountOnNextRound: 0.25 // 25% discount on Series A
  },
  SERIES_A: {
    name: 'Series A',
    targetAmount: 16000000, // 16M MXN
    minTicket: 2000000, // 2M MXN
    maxTicket: 8000000, // 8M MXN
    rights: [
      'Participación proporcional en dividendos',
      'Derecho de información mensual',
      'Anti-dilución completa (weighted average)',
      'Tag-along rights',
      'Derecho de veto en decisiones estratégicas',
      'Asiento en consejo observador'
    ],
    preferredReturn: 0.08, // 8% preferred return
    liquidationPreference: 1.5, // 1.5x participating
    boardSeat: true
  }
}

// Scoring Criteria for GO/YELLOW/NO-GO
export const SCORING_WEIGHTS = {
  MARKET_SIZE: 15,
  UNIT_ECONOMICS: 20,
  EXPANSION_PLAN: 15,
  MANAGEMENT_TEAM: 15,
  COMPETITIVE_ADVANTAGE: 15,
  EXIT_POTENTIAL: 20
}
