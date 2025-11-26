// DCF (Discounted Cash Flow) Calculations for Lenso Investment Analysis
// WITH ORGANIC GROWTH FROM FREE CASH FLOW REINVESTMENT

export const DEFAULT_ASSUMPTIONS = {
  // Existing Stores
  currentStores: 2,
  currentStoreRevenue: 450000, // MXN per month already at target

  // New Store Economics
  targetMonthlyRevenue: 450000, // MXN per month
  rampUpMonths: 6, // Months to reach target
  costPerStore: 2500000, // MXN (average 2M-3M)

  // Unit Economics
  grossMargin: 0.50, // 50%
  operatingMargin: 0.35, // 35% (EBITDA margin)
  taxRate: 0.30, // 30% ISR Mexico

  // Growth & Operations
  sameStoreGrowth: 0.07, // 7% annual growth post ramp-up
  capexMaintenance: 0.05, // 5% of revenue for maintenance

  // Working Capital (days)
  inventoryDays: 90, // Optical inventory turnover
  receivablesDays: 15, // Credit card + some accounts
  payablesDays: 30,

  // Capital Structure
  totalRaise: 30000000, // 30M MXN
  equityRaise: 25000000, // 25M MXN
  debtRaise: 5000000, // 5M MXN
  debtRate: 0.16, // 16% annual
  debtTerm: 5, // 5 years

  // Valuation
  safeDiscount: 0.35, // 35% discount
  revenueMultipleLow: 1.5,
  revenueMultipleHigh: 1.7,
  ebitdaMultiple: 8.0, // Retail standard

  // DCF Parameters
  discountRate: 0.08, // 8% WACC
  terminalGrowthRate: 0.03, // 3% perpetual growth
  projectionYears: 8,

  // Organic Growth
  organicGrowthStartMonth: 25, // Start reinvesting FCF after month 24
  reserveCashBuffer: 1000000 // Keep 1M MXN reserve before opening new stores
}

// Calculate working capital requirement
export const calculateWorkingCapital = (revenue, assumptions) => {
  const annualRevenue = revenue * 12
  const inventory = (annualRevenue * assumptions.grossMargin) * (assumptions.inventoryDays / 365)
  const receivables = annualRevenue * (assumptions.receivablesDays / 365)
  const payables = (annualRevenue * (1 - assumptions.grossMargin)) * (assumptions.payablesDays / 365)

  const workingCapital = inventory + receivables - payables

  return {
    inventory,
    receivables,
    payables,
    netWorkingCapital: workingCapital
  }
}

// Store opening schedule for INITIAL FUNDED stores (first 24 months)
export const calculateStoreOpeningSchedule = (newStores, months, assumptions) => {
  const schedule = []
  const storesPerMonth = newStores / months

  for (let month = 0; month < months; month++) {
    const storesThisMonth = Math.floor(storesPerMonth)
    const remainder = (newStores - (storesThisMonth * months)) > month ? 1 : 0
    const stores = storesThisMonth + remainder

    if (stores > 0) {
      schedule.push({
        month: month + 1,
        stores,
        capex: stores * assumptions.costPerStore,
        type: 'funded' // These are funded by the initial raise
      })
    }
  }

  return schedule
}

// Revenue by store by month
export const calculateStoreRevenue = (monthsSinceOpening, assumptions) => {
  if (monthsSinceOpening >= assumptions.rampUpMonths) {
    return assumptions.targetMonthlyRevenue
  }

  // S-curve ramp-up
  const progress = monthsSinceOpening / assumptions.rampUpMonths
  const sCurve = 1 / (1 + Math.exp(-10 * (progress - 0.5)))

  return assumptions.targetMonthlyRevenue * sCurve
}

// ENHANCED Monthly projections WITH ORGANIC GROWTH
export const calculateMonthlyProjectionsWithOrganicGrowth = (initialFundedStores, openingMonths, assumptions) => {
  const openingSchedule = calculateStoreOpeningSchedule(
    initialFundedStores - assumptions.currentStores,
    openingMonths,
    assumptions
  )

  const monthlyData = []
  const storeTracker = [] // Track each store's opening month and type
  let accumulatedCash = 0 // Cash available for organic growth

  // Existing stores
  for (let i = 0; i < assumptions.currentStores; i++) {
    storeTracker.push({ openedMonth: 0, isExisting: true, type: 'existing' })
  }

  // Initial funded stores
  openingSchedule.forEach(period => {
    for (let i = 0; i < period.stores; i++) {
      storeTracker.push({ openedMonth: period.month, isExisting: false, type: 'funded' })
    }
  })

  // Project 96 months (8 years)
  for (let month = 1; month <= 96; month++) {
    let monthRevenue = 0

    // Calculate revenue from all open stores
    storeTracker.forEach(store => {
      if (store.isExisting) {
        // Existing stores with growth
        const yearsElapsed = Math.floor(month / 12)
        const baseRevenue = assumptions.currentStoreRevenue
        monthRevenue += baseRevenue * Math.pow(1 + assumptions.sameStoreGrowth, yearsElapsed)
      } else {
        // New stores with ramp-up
        if (month >= store.openedMonth) {
          const monthsSinceOpening = month - store.openedMonth
          const rampUpRevenue = calculateStoreRevenue(monthsSinceOpening, assumptions)

          // Apply growth after ramp-up
          if (monthsSinceOpening >= assumptions.rampUpMonths) {
            const yearsAfterRampUp = Math.floor((monthsSinceOpening - assumptions.rampUpMonths) / 12)
            monthRevenue += rampUpRevenue * Math.pow(1 + assumptions.sameStoreGrowth, yearsAfterRampUp)
          } else {
            monthRevenue += rampUpRevenue
          }
        }
      }
    })

    // Calculate monthly cash flow (simplified for organic growth)
    const monthlyEBITDA = monthRevenue * assumptions.operatingMargin
    const monthlyDepreciation = (initialFundedStores * assumptions.costPerStore * 0.20) / 12
    const monthlyEBIT = monthlyEBITDA - monthlyDepreciation

    const debtBalance = month <= (assumptions.debtTerm * 12) ? assumptions.debtRaise : 0
    const monthlyInterest = (debtBalance * assumptions.debtRate) / 12

    const monthlyEBT = monthlyEBIT - monthlyInterest
    const monthlyTaxes = Math.max(0, monthlyEBT * assumptions.taxRate)
    const monthlyNetIncome = monthlyEBT - monthlyTaxes

    const monthlyCapexMaintenance = monthRevenue * assumptions.capexMaintenance
    const monthlyOCF = monthlyNetIncome + monthlyDepreciation
    const monthlyFCF = monthlyOCF - monthlyCapexMaintenance

    // Accumulate cash for organic growth (starting month 25)
    if (month >= assumptions.organicGrowthStartMonth) {
      accumulatedCash += monthlyFCF

      // Check if we can open a new store
      const cashNeededForNewStore = assumptions.costPerStore + assumptions.reserveCashBuffer
      if (accumulatedCash >= cashNeededForNewStore) {
        // Open a new organic store!
        storeTracker.push({
          openedMonth: month,
          isExisting: false,
          type: 'organic'
        })
        accumulatedCash -= assumptions.costPerStore
      }
    }

    const storesOpen = storeTracker.filter(s => s.isExisting || month >= s.openedMonth).length
    const organicStores = storeTracker.filter(s => s.type === 'organic' && month >= s.openedMonth).length

    monthlyData.push({
      month,
      year: Math.ceil(month / 12),
      revenue: monthRevenue,
      storesOpen,
      organicStores,
      accumulatedCash,
      fcf: monthlyFCF
    })
  }

  return {
    monthlyData,
    storeTracker,
    finalStoreCount: storeTracker.length,
    organicStoresOpened: storeTracker.filter(s => s.type === 'organic').length
  }
}

// Annual P&L projections WITH ORGANIC GROWTH
export const calculateAnnualProjectionsWithOrganicGrowth = (initialFundedStores, openingMonths, assumptions) => {
  const { monthlyData, storeTracker } = calculateMonthlyProjectionsWithOrganicGrowth(
    initialFundedStores,
    openingMonths,
    assumptions
  )

  const openingSchedule = calculateStoreOpeningSchedule(
    initialFundedStores - assumptions.currentStores,
    openingMonths,
    assumptions
  )

  const annualData = []

  for (let year = 1; year <= 8; year++) {
    const yearMonths = monthlyData.filter(m => m.year === year)

    // Revenue
    const revenue = yearMonths.reduce((sum, m) => sum + m.revenue, 0)

    // Store count at end of year
    const endOfYearMonth = year * 12
    const storesOpen = monthlyData.find(m => m.month === endOfYearMonth)?.storesOpen || 0
    const organicStores = monthlyData.find(m => m.month === endOfYearMonth)?.organicStores || 0

    // COGS
    const cogs = revenue * (1 - assumptions.grossMargin)
    const grossProfit = revenue * assumptions.grossMargin

    // Operating Expenses (to achieve 35% operating margin)
    const ebitda = revenue * assumptions.operatingMargin
    const opex = grossProfit - ebitda

    // D&A (20% of total CAPEX base per year, adjusting for organic stores)
    const fundedCapex = openingSchedule.reduce((sum, s) => sum + s.capex, 0)
    const organicCapex = organicStores * assumptions.costPerStore
    const totalCapexBase = fundedCapex + organicCapex
    const annualDepreciation = totalCapexBase * 0.20

    // EBIT
    const ebit = ebitda - annualDepreciation

    // Interest expense
    const debtBalance = year <= assumptions.debtTerm ? assumptions.debtRaise : 0
    const interestExpense = debtBalance * assumptions.debtRate

    // EBT & Taxes
    const ebt = ebit - interestExpense
    const taxes = Math.max(0, ebt * assumptions.taxRate)

    // Net Income
    const netIncome = ebt - taxes

    // Cash Flow
    const depreciation = annualDepreciation
    const capexMaintenance = revenue * assumptions.capexMaintenance

    // CAPEX for organic stores opened this year
    const organicStoresThisYear = storeTracker.filter(s =>
      s.type === 'organic' &&
      s.openedMonth > (year - 1) * 12 &&
      s.openedMonth <= year * 12
    ).length
    const capexGrowthOrganic = organicStoresThisYear * assumptions.costPerStore

    // CAPEX for funded stores (only in first 2 years)
    const capexGrowthFunded = year <= Math.ceil(openingMonths / 12)
      ? openingSchedule.filter(s => s.month <= year * 12 && s.month > (year - 1) * 12)
          .reduce((sum, s) => sum + s.capex, 0)
      : 0

    const capexGrowth = capexGrowthFunded + capexGrowthOrganic

    // Working Capital Change
    const currentWC = calculateWorkingCapital(revenue / 12, assumptions).netWorkingCapital
    const previousRevenue = year > 1 ? annualData[year - 2].revenue :
      assumptions.currentStores * assumptions.currentStoreRevenue * 12
    const previousWC = calculateWorkingCapital(previousRevenue / 12, assumptions).netWorkingCapital
    const wcChange = currentWC - previousWC

    // Free Cash Flow
    const operatingCashFlow = netIncome + depreciation
    const freeCashFlow = operatingCashFlow - capexMaintenance - capexGrowth - wcChange

    annualData.push({
      year,
      storesOpen,
      fundedStores: initialFundedStores,
      organicStores,
      revenue,
      cogs,
      grossProfit,
      grossMarginPct: (grossProfit / revenue),
      opex,
      ebitda,
      ebitdaMarginPct: (ebitda / revenue),
      depreciation,
      ebit,
      interestExpense,
      ebt,
      taxes,
      netIncome,
      netMarginPct: (netIncome / revenue),

      // Cash Flow
      operatingCashFlow,
      capexMaintenance,
      capexGrowthFunded,
      capexGrowthOrganic,
      capexGrowth,
      totalCapex: capexMaintenance + capexGrowth,
      wcChange,
      freeCashFlow,

      // Debt
      debtBalance
    })
  }

  return annualData
}

// DCF Valuation
export const calculateDCF = (annualProjections, assumptions) => {
  const { discountRate, terminalGrowthRate } = assumptions

  // Discount each year's FCF
  const discountedCashFlows = annualProjections.map((year, index) => {
    const yearNum = index + 1
    const discountFactor = Math.pow(1 + discountRate, yearNum)
    const presentValue = year.freeCashFlow / discountFactor

    return {
      year: yearNum,
      fcf: year.freeCashFlow,
      discountFactor,
      presentValue
    }
  })

  // Terminal Value (Gordon Growth Model)
  const year8FCF = annualProjections[7].freeCashFlow
  const terminalValue = (year8FCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate)
  const terminalValuePV = terminalValue / Math.pow(1 + discountRate, 8)

  // Enterprise Value
  const pvOfProjectedCashFlows = discountedCashFlows.reduce((sum, cf) => sum + cf.presentValue, 0)
  const enterpriseValue = pvOfProjectedCashFlows + terminalValuePV

  // Equity Value (subtract net debt)
  const netDebt = assumptions.debtRaise // Assuming all debt is outstanding at valuation
  const equityValue = enterpriseValue - netDebt

  return {
    discountedCashFlows,
    pvOfProjectedCashFlows,
    terminalValue,
    terminalValuePV,
    enterpriseValue,
    netDebt,
    equityValue,

    // Per share metrics (if we had shares)
    impliedValuation: equityValue
  }
}

// Exit Valuation at Year 6 (PRIMARY FOCUS)
export const calculateYear6Valuation = (annualProjections, assumptions) => {
  const year6Data = annualProjections[5] // Index 5 = Year 6
  const year6Revenue = year6Data.revenue
  const year6EBITDA = year6Data.ebitda

  const revenueValuationLow = year6Revenue * assumptions.revenueMultipleLow
  const revenueValuationHigh = year6Revenue * assumptions.revenueMultipleHigh
  const revenueValuationAvg = (revenueValuationLow + revenueValuationHigh) / 2
  const ebitdaValuation = year6EBITDA * assumptions.ebitdaMultiple

  const recommendedValuation = Math.max(revenueValuationAvg, ebitdaValuation)
  const methodology = ebitdaValuation > revenueValuationAvg ? 'EBITDA Multiple' : 'Revenue Multiple'

  return {
    year: 6,
    storesOpen: year6Data.storesOpen,
    organicStores: year6Data.organicStores,
    revenue: year6Revenue,
    ebitda: year6EBITDA,
    revenueValuationLow,
    revenueValuationHigh,
    revenueValuationAvg,
    ebitdaValuation,
    recommendedValuation,
    methodology
  }
}

// Equity Allocation with SAFE
export const calculateEquityAllocation = (exitValuation, investment, safeDiscount) => {
  const valuationCap = exitValuation * (1 - safeDiscount)
  const equityPercentage = (investment / valuationCap) * 100
  const valueAtExit = (equityPercentage / 100) * exitValuation
  const moic = valueAtExit / investment // Multiple on Invested Capital

  return {
    investment,
    exitValuation,
    safeDiscount: safeDiscount * 100,
    valuationCap,
    equityPercentage,
    valueAtExit,
    moic
  }
}

// IRR Calculation
export const calculateIRR = (investment, exitValue, years) => {
  // Simple IRR: (Exit/Investment)^(1/years) - 1
  const irr = Math.pow(exitValue / investment, 1 / years) - 1
  return irr * 100
}

// Complete Investment Analysis WITH ORGANIC GROWTH
export const generateCompleteInvestmentAnalysis = (initialFundedStores, openingMonths, assumptions = DEFAULT_ASSUMPTIONS) => {
  // Financial Projections WITH ORGANIC GROWTH
  const annualProjections = calculateAnnualProjectionsWithOrganicGrowth(
    initialFundedStores,
    openingMonths,
    assumptions
  )

  const { monthlyData, storeTracker, finalStoreCount, organicStoresOpened } =
    calculateMonthlyProjectionsWithOrganicGrowth(initialFundedStores, openingMonths, assumptions)

  // DCF Valuation (VALUE TODAY)
  const dcfValuation = calculateDCF(annualProjections, assumptions)

  // Year 6 Valuation (VALUE IN 6 YEARS)
  const year6Valuation = calculateYear6Valuation(annualProjections, assumptions)

  // Equity Allocation for Year 6 Exit
  const year6EquityAllocation = calculateEquityAllocation(
    year6Valuation.recommendedValuation,
    assumptions.equityRaise,
    assumptions.safeDiscount
  )
  const year6IRR = calculateIRR(
    assumptions.equityRaise,
    year6EquityAllocation.valueAtExit,
    6
  )

  // Store Opening Schedule (funded stores only)
  const openingSchedule = calculateStoreOpeningSchedule(
    initialFundedStores - assumptions.currentStores,
    openingMonths,
    assumptions
  )

  // Organic Growth Timeline
  const organicGrowthTimeline = storeTracker
    .filter(s => s.type === 'organic')
    .map(s => ({
      month: s.openedMonth,
      year: Math.ceil(s.openedMonth / 12),
      type: 'organic'
    }))

  return {
    inputs: {
      totalStores: initialFundedStores,
      openingMonths,
      assumptions
    },
    annualProjections,
    monthlyProjections: monthlyData,
    dcfValuation,
    year6Valuation,
    year6EquityAllocation: {
      ...year6EquityAllocation,
      irr: year6IRR
    },
    openingSchedule,
    organicGrowthTimeline,
    storeTracker,

    // Key Metrics Summary
    summary: {
      // DCF Value (TODAY)
      dcfEquityValue: dcfValuation.equityValue,
      dcfEnterpriseValue: dcfValuation.enterpriseValue,

      // Year 6 Value (FUTURE)
      year6ExitValue: year6Valuation.recommendedValuation,
      year6Revenue: year6Valuation.revenue,
      year6EBITDA: year6Valuation.ebitda,
      year6IRR: year6IRR,
      year6MOIC: year6EquityAllocation.moic,

      // Store Metrics
      initialFundedStores: initialFundedStores,
      finalStoreCount: finalStoreCount,
      organicStoresOpened: organicStoresOpened,
      year6StoreCount: year6Valuation.storesOpen,

      // Investment
      totalCapexRequired: openingSchedule.reduce((sum, s) => sum + s.capex, 0),
      totalRaiseNeeded: assumptions.totalRaise
    },

    // For backward compatibility with existing components
    exitScenarios: [year6Valuation],
    equityAllocations: [{
      ...year6EquityAllocation,
      exitYear: 6,
      irr: year6IRR
    }]
  }
}
