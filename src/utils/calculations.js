import { BUSINESS_CONSTANTS, EQUITY_TRANCHES } from './constants'
import {
  generateCompleteInvestmentAnalysis as generateDCFAnalysis,
  DEFAULT_ASSUMPTIONS
} from './dcfCalculations'

// Revenue Projections
export const calculateMonthlyRevenue = (monthsSinceOpening) => {
  const { TARGET_MONTHLY_REVENUE_PER_STORE, RAMP_UP_MONTHS } = BUSINESS_CONSTANTS

  if (monthsSinceOpening >= RAMP_UP_MONTHS) {
    return TARGET_MONTHLY_REVENUE_PER_STORE
  }

  // S-curve ramp-up (more realistic than linear)
  const progress = monthsSinceOpening / RAMP_UP_MONTHS
  const sCurve = 1 / (1 + Math.exp(-10 * (progress - 0.5)))

  return TARGET_MONTHLY_REVENUE_PER_STORE * sCurve
}

export const calculateAnnualRevenueProjection = (totalStores, monthsToComplete, currentStores = 2) => {
  const newStores = totalStores - currentStores
  const storeOpeningSchedule = []

  // Distribute store openings evenly over the period
  const monthsBetweenOpenings = monthsToComplete / newStores

  // Generate opening schedule
  for (let i = 0; i < newStores; i++) {
    storeOpeningSchedule.push(Math.floor(i * monthsBetweenOpenings))
  }

  // Calculate revenue month by month for 24 months
  const monthlyRevenue = []

  for (let month = 0; month < 24; month++) {
    let totalRevenue = 0

    // Current stores (already operational)
    totalRevenue += currentStores * BUSINESS_CONSTANTS.TARGET_MONTHLY_REVENUE_PER_STORE

    // New stores
    storeOpeningSchedule.forEach(openingMonth => {
      if (month >= openingMonth) {
        const monthsSinceOpening = month - openingMonth
        totalRevenue += calculateMonthlyRevenue(monthsSinceOpening)
      }
    })

    monthlyRevenue.push(totalRevenue)
  }

  // Calculate annual revenue
  const year1Revenue = monthlyRevenue.slice(0, 12).reduce((a, b) => a + b, 0)
  const year2Revenue = monthlyRevenue.slice(12, 24).reduce((a, b) => a + b, 0)

  return {
    year1Revenue,
    year2Revenue,
    monthlyRevenue,
    averageMonthlyY1: year1Revenue / 12,
    averageMonthlyY2: year2Revenue / 12
  }
}

// Financial Metrics
export const calculateFinancialMetrics = (revenue) => {
  const { GROSS_MARGIN, EBITDA_MARGIN } = BUSINESS_CONSTANTS

  const grossProfit = revenue * GROSS_MARGIN
  const ebitda = revenue * EBITDA_MARGIN
  const operatingExpenses = grossProfit - ebitda

  return {
    revenue,
    grossProfit,
    grossMargin: GROSS_MARGIN,
    operatingExpenses,
    ebitda,
    ebitdaMargin: EBITDA_MARGIN
  }
}

// Debt Service
export const calculateDebtService = (debtAmount = BUSINESS_CONSTANTS.DEBT_CAPITAL) => {
  const { DEBT_INTEREST_RATE } = BUSINESS_CONSTANTS

  const annualInterest = debtAmount * DEBT_INTEREST_RATE
  const monthlyPayment = annualInterest / 12

  // Assuming interest-only for first 2 years
  const year1Cost = annualInterest
  const year2Cost = annualInterest
  const totalCost = year1Cost + year2Cost

  return {
    debtAmount,
    interestRate: DEBT_INTEREST_RATE,
    annualInterest,
    monthlyPayment,
    year1Cost,
    year2Cost,
    totalCost
  }
}

// Cash Flow Analysis
export const calculateCashFlow = (totalStores, monthsToComplete) => {
  const { year1Revenue, year2Revenue } = calculateAnnualRevenueProjection(totalStores, monthsToComplete)

  const year1Metrics = calculateFinancialMetrics(year1Revenue)
  const year2Metrics = calculateFinancialMetrics(year2Revenue)

  const debtService = calculateDebtService()

  // Cash flow = EBITDA - Debt Service
  const year1CashFlow = year1Metrics.ebitda - debtService.year1Cost
  const year2CashFlow = year2Metrics.ebitda - debtService.year2Cost

  return {
    year1: {
      ...year1Metrics,
      debtService: debtService.year1Cost,
      cashFlow: year1CashFlow
    },
    year2: {
      ...year2Metrics,
      debtService: debtService.year2Cost,
      cashFlow: year2CashFlow
    },
    cumulative: {
      revenue: year1Revenue + year2Revenue,
      ebitda: year1Metrics.ebitda + year2Metrics.ebitda,
      cashFlow: year1CashFlow + year2CashFlow
    }
  }
}

// Exit Valuation
export const calculateExitValuation = (totalStores, monthsToComplete) => {
  const { year2Revenue } = calculateAnnualRevenueProjection(totalStores, monthsToComplete)
  const { ebitda } = calculateFinancialMetrics(year2Revenue)

  const { REVENUE_MULTIPLE_LOW, REVENUE_MULTIPLE_HIGH, EBITDA_MULTIPLE_RETAIL, MIN_STORES_FOR_EXIT } = BUSINESS_CONSTANTS

  if (totalStores < MIN_STORES_FOR_EXIT) {
    return null
  }

  // Revenue-based valuation
  const revenueValuationLow = year2Revenue * REVENUE_MULTIPLE_LOW
  const revenueValuationHigh = year2Revenue * REVENUE_MULTIPLE_HIGH
  const revenueValuationAvg = (revenueValuationLow + revenueValuationHigh) / 2

  // EBITDA-based valuation
  const ebitdaValuation = ebitda * EBITDA_MULTIPLE_RETAIL

  // Use the higher of the two methods (more favorable for founders)
  const finalValuation = Math.max(revenueValuationAvg, ebitdaValuation)

  return {
    revenueValuation: {
      low: revenueValuationLow,
      high: revenueValuationHigh,
      avg: revenueValuationAvg
    },
    ebitdaValuation,
    recommendedValuation: finalValuation,
    year2Revenue,
    year2Ebitda: ebitda,
    methodology: finalValuation === ebitdaValuation ? 'EBITDA Multiple' : 'Revenue Multiple'
  }
}

// SAFE Agreement - Equity Calculation
export const calculateSAFEEquity = (investment, exitValuation) => {
  const { SAFE_DISCOUNT } = BUSINESS_CONSTANTS

  // Valuation cap = Exit valuation * (1 - discount)
  const valuationCap = exitValuation * (1 - SAFE_DISCOUNT)

  // Shares = Investment / (Valuation Cap / Total Shares)
  // Simplified: Equity % = Investment / Valuation Cap * 100
  const equityPercentage = (investment / valuationCap) * 100

  // Investor's value at exit
  const valueAtExit = (equityPercentage / 100) * exitValuation

  // Multiple on investment
  const multiple = valueAtExit / investment

  return {
    investment,
    valuationCap,
    discount: SAFE_DISCOUNT * 100,
    equityPercentage,
    valueAtExit,
    multiple,
    exitValuation
  }
}

// IRR Calculation
export const calculateIRR = (initialInvestment, exitValue, years) => {
  // IRR = (Exit Value / Initial Investment) ^ (1 / years) - 1
  const irr = Math.pow(exitValue / initialInvestment, 1 / years) - 1
  return irr * 100
}

// ROI Calculation
export const calculateROI = (initialInvestment, exitValue) => {
  const roi = ((exitValue - initialInvestment) / initialInvestment) * 100
  return roi
}

// Equity Allocation by Tranches
export const calculateEquityAllocation = (exitValuation) => {
  const seedTranche = EQUITY_TRANCHES.SEED
  const seriesATranche = EQUITY_TRANCHES.SERIES_A

  // Calculate equity for each tranche
  const seedEquity = calculateSAFEEquity(seedTranche.targetAmount, exitValuation)
  const seriesAEquity = calculateSAFEEquity(seriesATranche.targetAmount, exitValuation)

  // Total investor equity
  const totalInvestorEquity = seedEquity.equityPercentage + seriesAEquity.equityPercentage

  // Founders' remaining equity
  const foundersEquity = 100 - totalInvestorEquity

  // Calculate returns for each tranche
  const seedIRR = calculateIRR(seedTranche.targetAmount, seedEquity.valueAtExit, 2)
  const seriesAIRR = calculateIRR(seriesATranche.targetAmount, seriesAEquity.valueAtExit, 2)

  return {
    seed: {
      ...seedEquity,
      tranche: seedTranche,
      irr: seedIRR,
      roi: calculateROI(seedTranche.targetAmount, seedEquity.valueAtExit)
    },
    seriesA: {
      ...seriesAEquity,
      tranche: seriesATranche,
      irr: seriesAIRR,
      roi: calculateROI(seriesATranche.targetAmount, seriesAEquity.valueAtExit)
    },
    summary: {
      totalInvestorEquity,
      foundersEquity,
      totalInvestment: BUSINESS_CONSTANTS.EQUITY_CAPITAL,
      totalValueAtExit: seedEquity.valueAtExit + seriesAEquity.valueAtExit,
      blendedIRR: (seedIRR * seedTranche.targetAmount + seriesAIRR * seriesATranche.targetAmount) / BUSINESS_CONSTANTS.EQUITY_CAPITAL
    }
  }
}

// Investment Score (GO/YELLOW/NO-GO)
export const calculateInvestmentScore = (data) => {
  let score = 50 // Base score

  const { totalStores, monthsToComplete, costPerStore } = data

  // 1. Market Size & Growth Potential (15 points)
  if (totalStores >= 15) score += 15
  else if (totalStores >= 10) score += 10
  else score += 5

  // 2. Unit Economics (20 points)
  const avgCostPerStore = (costPerStore || 2500000)
  const paybackPeriod = avgCostPerStore / (BUSINESS_CONSTANTS.TARGET_MONTHLY_REVENUE_PER_STORE * BUSINESS_CONSTANTS.EBITDA_MARGIN)

  if (paybackPeriod <= 24) score += 20 // Payback in 2 years
  else if (paybackPeriod <= 36) score += 15 // Payback in 3 years
  else score += 10

  // 3. Expansion Timeline (15 points)
  if (monthsToComplete <= 18) score += 15 // Aggressive
  else if (monthsToComplete <= 24) score += 12 // Standard
  else score += 8 // Conservative

  // 4. Exit Potential (20 points)
  const exitVal = calculateExitValuation(totalStores, monthsToComplete)
  if (exitVal && exitVal.recommendedValuation > 100000000) score += 20 // 100M+ valuation
  else if (exitVal && exitVal.recommendedValuation > 80000000) score += 15
  else if (exitVal) score += 10

  // 5. Investor Returns (20 points)
  if (exitVal) {
    const equity = calculateEquityAllocation(exitVal.recommendedValuation)
    const blendedIRR = equity.summary.blendedIRR

    if (blendedIRR >= 40) score += 20 // Excellent returns
    else if (blendedIRR >= 30) score += 15 // Strong returns
    else if (blendedIRR >= 20) score += 10 // Good returns
    else score += 5
  }

  // Cap score at 100
  score = Math.min(score, 100)

  // Determine decision
  let decision
  if (score >= 75) decision = 'GO'
  else if (score >= 60) decision = 'YELLOW'
  else decision = 'NO-GO'

  return {
    score,
    decision,
    breakdown: {
      marketSize: totalStores >= 15 ? 15 : (totalStores >= 10 ? 10 : 5),
      unitEconomics: paybackPeriod <= 24 ? 20 : (paybackPeriod <= 36 ? 15 : 10),
      expansionPlan: monthsToComplete <= 18 ? 15 : (monthsToComplete <= 24 ? 12 : 8),
      exitPotential: exitVal ? (exitVal.recommendedValuation > 100000000 ? 20 : 15) : 0
    }
  }
}

// Complete Investment Analysis with DCF
export const generateCompleteAnalysis = (data) => {
  const { totalStores, monthsToComplete, costPerStore } = data

  // Generate DCF Analysis with all projections
  const dcfAnalysis = generateDCFAnalysis(
    totalStores,
    monthsToComplete,
    {
      ...DEFAULT_ASSUMPTIONS,
      costPerStore: costPerStore || DEFAULT_ASSUMPTIONS.costPerStore
    }
  )

  // Legacy calculations for backward compatibility
  const revenueProjection = calculateAnnualRevenueProjection(totalStores, monthsToComplete)
  const cashFlow = calculateCashFlow(totalStores, monthsToComplete)
  const exitValuation = calculateExitValuation(totalStores, monthsToComplete)
  const equityAllocation = exitValuation ? calculateEquityAllocation(exitValuation.recommendedValuation) : null
  const investmentScore = calculateInvestmentScore(data)
  const totalInvestmentRequired = (totalStores - BUSINESS_CONSTANTS.CURRENT_STORES) * (costPerStore || 2500000)

  return {
    // Original analysis
    inputs: data,
    revenueProjection,
    cashFlow,
    exitValuation,
    equityAllocation,
    investmentScore,
    totalInvestmentRequired,
    capitalStructure: {
      equity: BUSINESS_CONSTANTS.EQUITY_CAPITAL,
      debt: BUSINESS_CONSTANTS.DEBT_CAPITAL,
      total: BUSINESS_CONSTANTS.TOTAL_RAISE
    },
    timestamp: new Date().toISOString(),

    // Complete DCF Analysis
    dcfAnalysis: dcfAnalysis,

    // Convenience accessors
    annualProjections: dcfAnalysis.annualProjections,
    dcfValuation: dcfAnalysis.dcfValuation,
    exitScenarios: dcfAnalysis.exitScenarios,
    equityAllocations: dcfAnalysis.equityAllocations,
    openingSchedule: dcfAnalysis.openingSchedule,
    assumptions: dcfAnalysis.inputs.assumptions,
    summary: dcfAnalysis.summary
  }
}
