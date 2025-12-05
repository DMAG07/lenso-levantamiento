// DCF (Discounted Cash Flow) Calculations for Lenso Investment Analysis
// SINCRONIZADO CON InvestmentAnalysisV2.jsx como fuente de verdad

import { BUSINESS_CONSTANTS, OPEX_STRUCTURE, DEBT_SERVICE } from './constants'

export const DEFAULT_ASSUMPTIONS = {
  // Existing Stores
  currentStores: BUSINESS_CONSTANTS.CURRENT_STORES,
  currentStoreRevenue: BUSINESS_CONSTANTS.TARGET_MONTHLY_REVENUE_PER_STORE,

  // New Store Economics
  targetMonthlyRevenue: BUSINESS_CONSTANTS.TARGET_MONTHLY_REVENUE_PER_STORE,
  targetAnnualRevenue: BUSINESS_CONSTANTS.TARGET_ANNUAL_REVENUE_PER_STORE,
  rampUpMonths: BUSINESS_CONSTANTS.RAMP_UP_MONTHS,
  costPerStore: BUSINESS_CONSTANTS.COST_PER_STORE,

  // Unit Economics
  grossMargin: BUSINESS_CONSTANTS.GROSS_MARGIN,
  ebitdaMarginExpansion: BUSINESS_CONSTANTS.EBITDA_MARGIN_EXPANSION,
  ebitdaMarginMature: BUSINESS_CONSTANTS.EBITDA_MARGIN_MATURE,
  ebitdaNetoExpansion: BUSINESS_CONSTANTS.EBITDA_NETO_EXPANSION,
  ebitdaNetoMature: BUSINESS_CONSTANTS.EBITDA_NETO_MATURE,
  feeOperadora: BUSINESS_CONSTANTS.FEE_OPERADORA,
  taxRate: BUSINESS_CONSTANTS.TAX_RATE,

  // Growth & Operations
  sameStoreGrowth: BUSINESS_CONSTANTS.SAME_STORE_GROWTH,

  // Capital Structure
  totalRaise: BUSINESS_CONSTANTS.TOTAL_RAISE,
  equityRaise: BUSINESS_CONSTANTS.EQUITY_CAPITAL,
  debtRaise: BUSINESS_CONSTANTS.DEBT_CAPITAL,
  debtRate: BUSINESS_CONSTANTS.DEBT_INTEREST_RATE,
  debtTerm: BUSINESS_CONSTANTS.DEBT_TERM_YEARS,
  dilution: BUSINESS_CONSTANTS.DILUTION,

  // Valuation
  revenueMultiple: BUSINESS_CONSTANTS.REVENUE_MULTIPLE,
  ebitdaMultiple: BUSINESS_CONSTANTS.EBITDA_MULTIPLE_RETAIL,

  // DCF Parameters
  discountRate: BUSINESS_CONSTANTS.WACC,
  terminalGrowthRate: BUSINESS_CONSTANTS.TERMINAL_GROWTH_RATE,
  projectionYears: BUSINESS_CONSTANTS.PROJECTION_YEARS,

  // Dividend Policy
  dividendStartYear: BUSINESS_CONSTANTS.DIVIDEND_START_YEAR,
  dividendDistributionRate: BUSINESS_CONSTANTS.DIVIDEND_DISTRIBUTION_RATE,

  // Store targets
  targetStoresFunded: BUSINESS_CONSTANTS.TARGET_STORES_FUNDED,
  targetStoresOrganic: BUSINESS_CONSTANTS.TARGET_STORES_ORGANIC,
  targetStoresTotal: BUSINESS_CONSTANTS.TARGET_STORES_TOTAL
}

// Proyecciones hardcodeadas de V2 (fuente de verdad)
// Revenue por tienda crece 3.5% anual (año 1: $6M, año 10: $8.18M)
export const PROYECCION_10_ANOS = [
  { year: 1, revenue: 66.0, ebitdaBruto: 13.53, feeOperadora: 5.28, ebitdaNeto: 8.25, interestExpense: 0.775, ebit: 7.475, taxes: 2.242, netIncome: 5.23, capitalPayment: 0, fcf: 5.23, debtService: 0.775, tiendas: 11, distribuible: 5.23, inversionTiendas: 0 },
  { year: 2, revenue: 80.73, ebitdaBruto: 16.55, feeOperadora: 6.46, ebitdaNeto: 10.09, interestExpense: 0.775, ebit: 9.316, taxes: 2.795, netIncome: 6.52, capitalPayment: 0, fcf: 6.52, debtService: 0.775, tiendas: 13, distribuible: 6.52, inversionTiendas: 0 },
  { year: 3, revenue: 89.98, ebitdaBruto: 18.45, feeOperadora: 7.2, ebitdaNeto: 11.25, interestExpense: 0.775, ebit: 10.473, taxes: 3.142, netIncome: 7.33, capitalPayment: 0, fcf: 4.83, debtService: 0.775, tiendas: 14, distribuible: 4.83, inversionTiendas: 2.5 },
  { year: 4, revenue: 106.44, ebitdaBruto: 25.01, feeOperadora: 8.51, ebitdaNeto: 16.5, interestExpense: 0.775, ebit: 15.723, taxes: 4.717, netIncome: 11.01, capitalPayment: 1.67, fcf: 4.34, debtService: 2.445, tiendas: 16, distribuible: 4.34, inversionTiendas: 5.0 },
  { year: 5, revenue: 123.93, ebitdaBruto: 29.12, feeOperadora: 9.91, ebitdaNeto: 19.21, interestExpense: 0.775, ebit: 18.435, taxes: 5.53, netIncome: 12.9, capitalPayment: 1.67, fcf: 6.23, debtService: 2.445, tiendas: 18, distribuible: 6.23, inversionTiendas: 5.0 },
  { year: 6, revenue: 128.27, ebitdaBruto: 30.14, feeOperadora: 10.26, ebitdaNeto: 19.88, interestExpense: 0.775, ebit: 19.107, taxes: 5.732, netIncome: 13.37, capitalPayment: 1.66, fcf: 11.71, debtService: 2.435, tiendas: 18, distribuible: 11.71, inversionTiendas: 0 },
  { year: 7, revenue: 132.76, ebitdaBruto: 31.2, feeOperadora: 10.62, ebitdaNeto: 20.58, interestExpense: 0, ebit: 20.578, taxes: 6.173, netIncome: 14.4, capitalPayment: 0, fcf: 14.4, debtService: 0.0, tiendas: 18, distribuible: 14.4, inversionTiendas: 0 },
  { year: 8, revenue: 137.41, ebitdaBruto: 32.29, feeOperadora: 10.99, ebitdaNeto: 21.3, interestExpense: 0, ebit: 21.298, taxes: 6.389, netIncome: 14.91, capitalPayment: 0, fcf: 14.91, debtService: 0.0, tiendas: 18, distribuible: 14.91, inversionTiendas: 0 },
  { year: 9, revenue: 142.22, ebitdaBruto: 33.42, feeOperadora: 11.38, ebitdaNeto: 22.04, interestExpense: 0, ebit: 22.043, taxes: 6.613, netIncome: 15.43, capitalPayment: 0, fcf: 15.43, debtService: 0.0, tiendas: 18, distribuible: 15.43, inversionTiendas: 0 },
  { year: 10, revenue: 147.19, ebitdaBruto: 34.59, feeOperadora: 11.78, ebitdaNeto: 22.81, interestExpense: 0, ebit: 22.815, taxes: 6.844, netIncome: 15.97, capitalPayment: 0, fcf: 15.97, debtService: 0.0, tiendas: 18, distribuible: 15.97, inversionTiendas: 0 }
]

// DCF Detail (WACC 20%)
export const DCF_DETAIL = [
  { year: 1, fcf: 5.23, pvFactor: 0.8333, pv: 4.36 },
  { year: 2, fcf: 6.52, pvFactor: 0.6944, pv: 4.53 },
  { year: 3, fcf: 4.83, pvFactor: 0.5787, pv: 2.80 },
  { year: 4, fcf: 4.34, pvFactor: 0.4823, pv: 2.09 },
  { year: 5, fcf: 6.23, pvFactor: 0.4019, pv: 2.50 },
  { year: 6, fcf: 11.71, pvFactor: 0.3349, pv: 3.92 },
  { year: 7, fcf: 14.4, pvFactor: 0.2791, pv: 4.02 },
  { year: 8, fcf: 14.91, pvFactor: 0.2326, pv: 3.47 },
  { year: 9, fcf: 15.43, pvFactor: 0.1938, pv: 2.99 },
  { year: 10, fcf: 15.97, pvFactor: 0.1615, pv: 2.58 }
]

// DCF Valuation Summary
export const DCF_VALUATION = {
  year1to10Flows: DCF_DETAIL,
  pvCashFlows10Years: 33.26,
  year10FCF: 15.97,
  perpetualGrowth: 0.03,
  wacc: 0.20,
  terminalValue: 96.76, // 15.97 * 1.03 / (0.20 - 0.03)
  terminalValuePV: 15.63,
  enterpriseValue: 48.88,
  deudaNeta: 0, // Deuda liquidada en año 6
  equityValueDCF: 48.88
}

// Venture Capital Valuation (2X Revenue)
export const VENTURE_CAPITAL_VALUATION = {
  year6Revenue: 128.27,
  year10Revenue: 147.19,
  multiploVentas: 2.0,
  valuationYear6: 256.54, // 2.0 × $128.27M
  valuationYear10: 294.38,
  methodology: '2X Revenue Multiple'
}

// Dividend Policy
export const DIVIDEND_POLICY = {
  startYear: BUSINESS_CONSTANTS.DIVIDEND_START_YEAR,
  distributionRate: BUSINESS_CONSTANTS.DIVIDEND_DISTRIBUTION_RATE
}

// Calculate Exit Scenario Year 6
export const calculateExitScenario6 = () => {
  const exitValue = VENTURE_CAPITAL_VALUATION.valuationYear6
  const dilution = DEFAULT_ASSUMPTIONS.dilution
  const equity = DEFAULT_ASSUMPTIONS.equityRaise / 1000000 // Convert to millions

  // Cash acumulado (años 1-2: 100% retenido, años 3-6: 50% retenido)
  const cashAccumulated = PROYECCION_10_ANOS.slice(0, 6).reduce((sum, y) => {
    const isDistributing = y.year >= DIVIDEND_POLICY.startYear
    return sum + (isDistributing ? y.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : y.distribuible)
  }, 0)

  const totalValue = exitValue + cashAccumulated
  const investorShare = totalValue * dilution

  // Dividendos recibidos años 3-6
  const dividends = PROYECCION_10_ANOS.slice(2, 6).reduce((sum, y) => {
    return sum + (y.distribuible * DIVIDEND_POLICY.distributionRate * dilution)
  }, 0)

  const totalReturn = investorShare + dividends
  const moic = totalReturn / equity
  const irr = (Math.pow(moic, 1/6) - 1) * 100

  return {
    year: 6,
    exitValue,
    cashAccumulated,
    totalValue,
    investorValue: investorShare,
    founderValue: totalValue * (1 - dilution),
    dividendsReceived: dividends,
    totalReturn,
    moic,
    irr
  }
}

// Calculate Exit Scenario Year 10
export const calculateExitScenario10 = () => {
  const exitValue = VENTURE_CAPITAL_VALUATION.valuationYear10
  const dilution = DEFAULT_ASSUMPTIONS.dilution
  const equity = DEFAULT_ASSUMPTIONS.equityRaise / 1000000

  const cashAccumulated = PROYECCION_10_ANOS.slice(0, 10).reduce((sum, y) => {
    const isDistributing = y.year >= DIVIDEND_POLICY.startYear
    return sum + (isDistributing ? y.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : y.distribuible)
  }, 0)

  const totalValue = exitValue + cashAccumulated
  const investorShare = totalValue * dilution

  const dividends = PROYECCION_10_ANOS.slice(2, 10).reduce((sum, y) => {
    return sum + (y.distribuible * DIVIDEND_POLICY.distributionRate * dilution)
  }, 0)

  const totalReturn = investorShare + dividends
  const moic = totalReturn / equity
  const irr = (Math.pow(moic, 1/10) - 1) * 100

  return {
    year: 10,
    exitValue,
    cashAccumulated,
    totalValue,
    investorValue: investorShare,
    founderValue: totalValue * (1 - dilution),
    dividendsReceived: dividends,
    totalReturn,
    moic,
    irr
  }
}

// Pre-calculate exit scenarios
export const EXIT_SCENARIO_6 = calculateExitScenario6()
export const EXIT_SCENARIO_10 = calculateExitScenario10()

// Complete Investment Analysis
export const generateCompleteInvestmentAnalysis = () => {
  return {
    assumptions: DEFAULT_ASSUMPTIONS,
    projections: PROYECCION_10_ANOS,
    dcfDetail: DCF_DETAIL,
    dcfValuation: DCF_VALUATION,
    vcValuation: VENTURE_CAPITAL_VALUATION,
    dividendPolicy: DIVIDEND_POLICY,
    exitScenario6: EXIT_SCENARIO_6,
    exitScenario10: EXIT_SCENARIO_10,
    summary: {
      dcfEquityValue: DCF_VALUATION.equityValueDCF,
      vcValuationYear6: VENTURE_CAPITAL_VALUATION.valuationYear6,
      vcValuationYear10: VENTURE_CAPITAL_VALUATION.valuationYear10,
      year6IRR: EXIT_SCENARIO_6.irr,
      year6MOIC: EXIT_SCENARIO_6.moic,
      year10IRR: EXIT_SCENARIO_10.irr,
      year10MOIC: EXIT_SCENARIO_10.moic,
      totalStores: DEFAULT_ASSUMPTIONS.targetStoresTotal,
      year6Revenue: PROYECCION_10_ANOS[5].revenue,
      year6EBITDANeto: PROYECCION_10_ANOS[5].ebitdaNeto
    }
  }
}
