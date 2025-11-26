import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, DollarSign, Store, Target } from 'lucide-react'
import KeyMetricsVisual from '../components/investment/KeyMetricsVisual'
import OrganicGrowthTimeline from '../components/investment/OrganicGrowthTimeline'
import ValuationComparison from '../components/investment/ValuationComparison'

// ==================== DATOS ====================

// Proyecciones anuales (8 años)
const ANNUAL_PROJECTIONS = [
  { year: 1, revenue: 52000000, ebitda: 18200000, storesOpen: 11, fundedStores: 11, organicStores: 0 },
  { year: 2, revenue: 73400000, ebitda: 25700000, storesOpen: 13, fundedStores: 13, organicStores: 0 },
  { year: 3, revenue: 80600000, ebitda: 28200000, storesOpen: 14, fundedStores: 13, organicStores: 1 },
  { year: 4, revenue: 86400000, ebitda: 30200000, storesOpen: 15, fundedStores: 13, organicStores: 2 },
  { year: 5, revenue: 92200000, ebitda: 32300000, storesOpen: 16, fundedStores: 13, organicStores: 3 },
  { year: 6, revenue: 97200000, ebitda: 34000000, storesOpen: 16, fundedStores: 13, organicStores: 3 },
  { year: 7, revenue: 97200000, ebitda: 34000000, storesOpen: 16, fundedStores: 13, organicStores: 3 },
  { year: 8, revenue: 97200000, ebitda: 34000000, storesOpen: 16, fundedStores: 13, organicStores: 3 }
]

// Cronograma de aperturas
const OPENING_SCHEDULE = [
  { month: 1, store: 'Tienda 1', location: 'Polanco', funded: true },
  { month: 3, store: 'Tienda 2', location: 'Santa Fe', funded: true },
  { month: 6, store: 'Tienda 3', location: 'Condesa', funded: true },
  { month: 9, store: 'Tienda 4', location: 'Roma', funded: true },
  { month: 12, store: 'Tienda 5', location: 'San Ángel', funded: true },
  { month: 15, store: 'Tienda 6', location: 'Coyoacán', funded: true },
  { month: 18, store: 'Tienda 7', location: 'Insurgentes', funded: true },
  { month: 21, store: 'Tienda 8', location: 'Reforma', funded: true },
  { month: 24, store: 'Tienda 9', location: 'Interlomas', funded: true }
]

// Timeline de crecimiento orgánico
const ORGANIC_GROWTH_TIMELINE = [
  { year: 3, month: 36, store: 'Orgánica 1', location: 'Guadalajara' },
  { year: 4, month: 48, store: 'Orgánica 2', location: 'Monterrey' },
  { year: 5, month: 60, store: 'Orgánica 3', location: 'Puebla' }
]

// Valuación DCF
const DCF_VALUATION = {
  equityValue: 370680000, // $370.68M
  enterpriseValue: 375680000, // $375.68M
  pvOfProjectedCashFlows: 131490000,
  terminalValuePV: 244190000,
  netDebt: 5000000,
  wacc: 0.08
}

// Valuación Año 6
const YEAR_6_VALUATION = {
  revenue: 97200000,
  ebitda: 34000000,
  storesOpen: 16,
  organicStores: 3,
  recommendedValuation: 194400000, // 2X Revenue
  methodology: 'Revenue Multiple',
  multiple: 2.0
}

// Asignación de Equity Año 6
const YEAR_6_EQUITY_ALLOCATION = {
  equityPercentage: 25,
  valueAtExit: 48600000, // 25% de $194.4M
  moic: 1.94, // $48.6M / $25M
  irr: 11.8
}

// Resumen
const SUMMARY = {
  initialFundedStores: 13,
  organicStoresOpened: 3,
  year6StoreCount: 16,
  finalStoreCount: 16,
  totalRaiseNeeded: 30000000,
  totalCapexRequired: 27500000,
  year6IRR: 11.8,
  year6MOIC: 1.94
}

function InvestmentAnalysisSimple() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-lg border-b border-titanium-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-titanium-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            <h1 className="text-2xl font-bold text-white">Análisis de Inversión Lenso</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics Visual */}
        <KeyMetricsVisual
          annualProjections={ANNUAL_PROJECTIONS}
          dcfValuation={DCF_VALUATION}
          year6Valuation={YEAR_6_VALUATION}
          summary={SUMMARY}
        />

        {/* Valuation Comparison */}
        <ValuationComparison
          dcfValuation={DCF_VALUATION}
          year6Valuation={YEAR_6_VALUATION}
          year6EquityAllocation={YEAR_6_EQUITY_ALLOCATION}
        />

        {/* Organic Growth Timeline */}
        <OrganicGrowthTimeline
          annualProjections={ANNUAL_PROJECTIONS}
          openingSchedule={OPENING_SCHEDULE}
          organicGrowthTimeline={ORGANIC_GROWTH_TIMELINE}
          summary={SUMMARY}
        />
      </div>
    </div>
  )
}

export default InvestmentAnalysisSimple
