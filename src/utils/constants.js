// Lenso Business Constants
// FUENTE DE VERDAD: InvestmentAnalysisV2.jsx

export const BUSINESS_CONSTANTS = {
  // Store Metrics
  TARGET_MONTHLY_REVENUE_PER_STORE: 500000, // MXN ($6M anual)
  TARGET_ANNUAL_REVENUE_PER_STORE: 6000000, // MXN
  AVG_GLASSES_PRICE: 2500, // MXN
  GROSS_MARGIN: 0.64, // 64%

  // EBITDA Margins (antes de fee operadora)
  EBITDA_MARGIN_EXPANSION: 0.205, // 20.5% años 1-3
  EBITDA_MARGIN_MATURE: 0.235, // 23.5% años 4+

  // EBITDA Neto (después de fee operadora 8%)
  EBITDA_NETO_EXPANSION: 0.125, // 12.5% años 1-3
  EBITDA_NETO_MATURE: 0.155, // 15.5% años 4+

  // Fee Operadora
  FEE_OPERADORA: 0.08, // 8%

  // Expansion Plan
  COST_PER_STORE: 2500000, // 2.5M MXN promedio
  RAMP_UP_MONTHS: 6, // Months to reach target revenue
  CURRENT_STORES: 2, // Plaza Patria & La Perla
  TARGET_STORES_FUNDED: 13, // Tiendas financiadas con el raise
  TARGET_STORES_ORGANIC: 5, // Tiendas orgánicas (FCF)
  TARGET_STORES_TOTAL: 18, // Total incluyendo orgánicas

  // Capital Structure
  TOTAL_RAISE: 30000000, // 30M MXN
  EQUITY_CAPITAL: 25000000, // 25M MXN
  DEBT_CAPITAL: 5000000, // 5M MXN
  DEBT_INTEREST_RATE: 0.155, // 15.5% annual
  DEBT_TERM_YEARS: 6, // Años para pagar deuda (años 4-6)

  // Dilución
  DILUTION: 0.25, // 25%
  PRE_MONEY_VALUATION: 100000000, // $100M
  POST_MONEY_VALUATION: 125000000, // $125M

  // Valuation & Exit
  REVENUE_MULTIPLE: 2.0, // 2X revenue (conservador retail)
  EBITDA_MULTIPLE_RETAIL: 8, // Standard retail multiple
  MIN_STORES_FOR_EXIT: 15,

  // DCF Parameters
  WACC: 0.20, // 20%
  TERMINAL_GROWTH_RATE: 0.03, // 3%
  PROJECTION_YEARS: 10,
  SAME_STORE_GROWTH: 0.035, // 3.5% anual

  // Tax
  TAX_RATE: 0.30, // 30% ISR México

  // Dividend Policy
  DIVIDEND_START_YEAR: 3,
  DIVIDEND_DISTRIBUTION_RATE: 0.50, // 50% del FCF

  // Fees (Total 3%)
  FEES: {
    STRUCTURING: 0.01, // 1.00%
    PLACEMENT: 0.01, // 1.00%
    FINDERS: 0.01, // 1.00%
    TOTAL: 0.03 // 3.00%
  }
}

// OpEx Structure (% del Revenue)
export const OPEX_STRUCTURE = {
  MARKETING_EXPANSION: 0.08, // 8% durante expansión (años 1-3)
  MARKETING_MATURE: 0.05, // 5% en madurez (años 4+)
  SALARIES: 0.15, // 15% del revenue
  RENT: 0.15, // 15% del revenue
  COMISIONES: 0.03, // 3% comisiones de venta
  OTHER: 0.025 // 2.5% (utilities, seguros, mantenimiento)
}

// Debt Service Schedule
export const DEBT_SERVICE = {
  principal: 5000000,
  rate: 0.155,
  interestAnnual: 775000,
  years: [
    { year: 1, interest: 775000, principal: 0, total: 775000 },
    { year: 2, interest: 775000, principal: 0, total: 775000 },
    { year: 3, interest: 775000, principal: 0, total: 775000 },
    { year: 4, interest: 775000, principal: 1670000, total: 2445000 },
    { year: 5, interest: 775000, principal: 1670000, total: 2445000 },
    { year: 6, interest: 775000, principal: 1660000, total: 2435000 },
    { year: 7, interest: 0, principal: 0, total: 0 },
    { year: 8, interest: 0, principal: 0, total: 0 },
    { year: 9, interest: 0, principal: 0, total: 0 },
    { year: 10, interest: 0, principal: 0, total: 0 }
  ]
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
