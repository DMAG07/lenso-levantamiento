import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Store,
  Target,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  Percent,
  TrendingDown,
  GitCompare,
  Zap,
  AlertTriangle,
  Shield,
  Cpu,
  Bot,
  LineChart
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, Area, PieChart, Pie, Cell } from 'recharts'

// ==================== CÁLCULOS COMPLETOS ====================

// Estructura de Capital
const CAPITAL = {
  equity: 25000000,
  deuda: 5000000,
  total: 30000000,
  tasa_deuda: 0.16,
  plazo_deuda: 5
}

// Proyecciones 10 años (millones MXN) - Incluye E-commerce como 1 tienda adicional
const PROYECCION_10_ANOS = [
  { year: 1, revenue: 52, ebitda: 18.2, fcf: 9, tiendas: 11, tiendasFisicas: 10, ecommerce: 1, organicas: 0, distribuible: 0 },
  { year: 2, revenue: 73.4, ebitda: 25.7, fcf: 15.5, tiendas: 13, tiendasFisicas: 12, ecommerce: 1, organicas: 0, distribuible: 0 },
  { year: 3, revenue: 80.6, ebitda: 28.2, fcf: 17.8, tiendas: 14, tiendasFisicas: 13, ecommerce: 1, organicas: 1, distribuible: 15.3 },
  { year: 4, revenue: 86.4, ebitda: 30.2, fcf: 19.5, tiendas: 15, tiendasFisicas: 14, ecommerce: 1, organicas: 2, distribuible: 17 },
  { year: 5, revenue: 92.2, ebitda: 32.3, fcf: 21, tiendas: 16, tiendasFisicas: 15, ecommerce: 1, organicas: 3, distribuible: 18.5 },
  { year: 6, revenue: 97.2, ebitda: 34, fcf: 22.5, tiendas: 16, tiendasFisicas: 15, ecommerce: 1, organicas: 3, distribuible: 22.5 },
  { year: 7, revenue: 97.2, ebitda: 34, fcf: 23, tiendas: 16, tiendasFisicas: 15, ecommerce: 1, organicas: 3, distribuible: 23 },
  { year: 8, revenue: 97.2, ebitda: 34, fcf: 23.5, tiendas: 16, tiendasFisicas: 15, ecommerce: 1, organicas: 3, distribuible: 23.5 },
  { year: 9, revenue: 97.2, ebitda: 34, fcf: 24, tiendas: 16, tiendasFisicas: 15, ecommerce: 1, organicas: 3, distribuible: 24 },
  { year: 10, revenue: 97.2, ebitda: 34, fcf: 24.5, tiendas: 16, tiendasFisicas: 15, ecommerce: 1, organicas: 3, distribuible: 24.5 }
]

// Flujos DCF detallados - Con E-commerce incluido
const DCF_CASH_FLOWS = [
  { year: 1, revenue: 52, ebitda: 18.2, depreciation: 3.1, ebit: 15.1, tax: 4.53, nopat: 10.57, capex: 5, nwc: 2, fcf: 6.67, pv_factor: 0.926, pv: 6.18 },
  { year: 2, revenue: 73.4, ebitda: 25.7, depreciation: 4.8, ebit: 20.9, tax: 6.27, nopat: 14.63, capex: 3, nwc: 1.5, fcf: 14.93, pv_factor: 0.857, pv: 12.79 },
  { year: 3, revenue: 80.6, ebitda: 28.2, depreciation: 5.2, ebit: 23, tax: 6.9, nopat: 16.1, capex: 2.5, nwc: 1, fcf: 17.8, pv_factor: 0.794, pv: 14.13 },
  { year: 4, revenue: 86.4, ebitda: 30.2, depreciation: 5.5, ebit: 24.7, tax: 7.41, nopat: 17.29, capex: 2.5, nwc: 0.8, fcf: 19.49, pv_factor: 0.735, pv: 14.33 },
  { year: 5, revenue: 92.2, ebitda: 32.3, depreciation: 5.8, ebit: 26.5, tax: 7.95, nopat: 18.55, capex: 2.5, nwc: 0.5, fcf: 21.35, pv_factor: 0.681, pv: 14.54 },
  { year: 6, revenue: 97.2, ebitda: 34, depreciation: 6, ebit: 28, tax: 8.4, nopat: 19.6, capex: 0, nwc: 0, fcf: 25.6, pv_factor: 0.630, pv: 16.13 },
  { year: 7, revenue: 97.2, ebitda: 34, depreciation: 6, ebit: 28, tax: 8.4, nopat: 19.6, capex: 0, nwc: 0, fcf: 25.6, pv_factor: 0.583, pv: 14.92 },
  { year: 8, revenue: 97.2, ebitda: 34, depreciation: 6, ebit: 28, tax: 8.4, nopat: 19.6, capex: 0, nwc: 0, fcf: 25.6, pv_factor: 0.540, pv: 13.82 },
  { year: 9, revenue: 97.2, ebitda: 34, depreciation: 6, ebit: 28, tax: 8.4, nopat: 19.6, capex: 0, nwc: 0, fcf: 25.6, pv_factor: 0.500, pv: 12.8 },
  { year: 10, revenue: 97.2, ebitda: 34, depreciation: 6, ebit: 28, tax: 8.4, nopat: 19.6, capex: 0, nwc: 0, fcf: 25.6, pv_factor: 0.463, pv: 11.85 }
]

const DCF_SUMMARY = {
  sum_pv_flows: 131.49, // Suma de PV años 1-10
  terminal_fcf: 26.37, // FCF año 10 * (1 + 3% growth) = 25.6 * 1.03
  terminal_value: 527.4, // terminal_fcf / (WACC - g) = 26.37 / (0.08 - 0.03)
  pv_terminal: 244.19, // terminal_value * pv_factor año 10 (0.463)
  enterprise_value: 375.68, // sum_pv_flows + pv_terminal
  less_debt: 5,
  equity_value_dcf: 370.68, // Valor teórico DCF
  // Pre-money = $75M basado en 25% equity para inversionistas
  pre_money_negociacion: 75, // $25M = 25% → Pre-money $75M
  post_money: 100 // Pre-money + Inversión
}

// Valuación del Deal - 25% Equity Fijo
const DEAL_VALUATION = {
  equity_dilution: 25, // % fijo para inversionistas
  inversion: CAPITAL.equity, // $25M
  pre_money: 75000000, // $25M = 25% → Pre-money $75M
  post_money: 100000000, // $75M + $25M
  founders_equity: 75, // % que retienen fundadores
  enterprise_value_dcf: 375680000, // NPV completo de flujos DCF (referencia)
  equity_value_dcf: 370680000 // Enterprise Value - Deuda (referencia)
}

// Exit Año 6 - Con E-commerce incluido
const YEAR_6_DATA = {
  revenue: 97.2,
  ebitda: 34,
  tiendas: 16,
  tiendasFisicas: 15,
  ecommerce: 1,

  // Exit 2X Revenue (PRINCIPAL)
  exit_2x_revenue: {
    valuacion: 97.2 * 2, // $194.4M
    valor_inversionistas: (97.2 * 2) * 0.25, // 25% equity
    valor_fundadores: (97.2 * 2) * 0.75, // 75% equity
    moic: ((97.2 * 2) * 0.25) / 25, // 1.94x
    irr: 11.8 // IRR para inversionistas
  },

  // Exit 8X EBITDA (COMPARATIVO)
  exit_8x_ebitda: {
    valuacion: 34 * 8, // $272M
    valor_inversionistas: (34 * 8) * 0.25,
    valor_fundadores: (34 * 8) * 0.75,
    moic: ((34 * 8) * 0.25) / 25, // 2.72x
    irr: 18.1
  }
}

// Escenario Operar 10 años - Con E-commerce
const YEAR_10_SCENARIO = {
  distribuciones_acumuladas: 167, // Suma de distribuibles años 3-10 (con e-commerce)
  valor_terminal_year_10: 97.2 * 2, // 2X Revenue año 10

  // Con 25% equity
  distribuciones_inversionistas: 167 * 0.25, // $41.75M
  valor_terminal_inversionistas: (97.2 * 2) * 0.25, // $48.6M
  total_inversionistas: (167 * 0.25) + ((97.2 * 2) * 0.25), // $90.35M
  moic: ((167 * 0.25) + ((97.2 * 2) * 0.25)) / 25, // 3.61x
  irr: 13.9,

  // Para fundadores (75% equity)
  distribuciones_fundadores: 167 * 0.75,
  valor_terminal_fundadores: (97.2 * 2) * 0.75,
  total_fundadores: (167 * 0.75) + ((97.2 * 2) * 0.75)
}

// P&L (Profit & Loss) Proyecciones 10 años - Con E-commerce incluido
const PL_PROYECCIONES = [
  { year: 1, revenue: 52, cogs: 26, gross_profit: 26, gross_margin: 50, opex_marketing: 1.6, opex_salaries: 6.2, opex_rent: 4.2, opex_other: 1.2, total_opex: 13.2, ebitda: 18.2, ebitda_margin: 35 },
  { year: 2, revenue: 73.4, cogs: 36.7, gross_profit: 36.7, gross_margin: 50, opex_marketing: 2.2, opex_salaries: 8.8, opex_rent: 5.9, opex_other: 1.6, total_opex: 18.5, ebitda: 25.7, ebitda_margin: 35 },
  { year: 3, revenue: 80.6, cogs: 40.3, gross_profit: 40.3, gross_margin: 50, opex_marketing: 2.4, opex_salaries: 9.7, opex_rent: 6.4, opex_other: 1.8, total_opex: 20.3, ebitda: 28.2, ebitda_margin: 35 },
  { year: 4, revenue: 86.4, cogs: 43.2, gross_profit: 43.2, gross_margin: 50, opex_marketing: 2.6, opex_salaries: 10.4, opex_rent: 6.9, opex_other: 1.9, total_opex: 21.8, ebitda: 30.2, ebitda_margin: 35 },
  { year: 5, revenue: 92.2, cogs: 46.1, gross_profit: 46.1, gross_margin: 50, opex_marketing: 2.8, opex_salaries: 11.1, opex_rent: 7.4, opex_other: 2.0, total_opex: 23.3, ebitda: 32.3, ebitda_margin: 35 },
  { year: 6, revenue: 97.2, cogs: 48.6, gross_profit: 48.6, gross_margin: 50, opex_marketing: 2.9, opex_salaries: 11.7, opex_rent: 7.8, opex_other: 2.1, total_opex: 24.5, ebitda: 34, ebitda_margin: 35 },
  { year: 7, revenue: 97.2, cogs: 48.6, gross_profit: 48.6, gross_margin: 50, opex_marketing: 2.9, opex_salaries: 11.7, opex_rent: 7.8, opex_other: 2.1, total_opex: 24.5, ebitda: 34, ebitda_margin: 35 },
  { year: 8, revenue: 97.2, cogs: 48.6, gross_profit: 48.6, gross_margin: 50, opex_marketing: 2.9, opex_salaries: 11.7, opex_rent: 7.8, opex_other: 2.1, total_opex: 24.5, ebitda: 34, ebitda_margin: 35 },
  { year: 9, revenue: 97.2, cogs: 48.6, gross_profit: 48.6, gross_margin: 50, opex_marketing: 2.9, opex_salaries: 11.7, opex_rent: 7.8, opex_other: 2.1, total_opex: 24.5, ebitda: 34, ebitda_margin: 35 },
  { year: 10, revenue: 97.2, cogs: 48.6, gross_profit: 48.6, gross_margin: 50, opex_marketing: 2.9, opex_salaries: 11.7, opex_rent: 7.8, opex_other: 2.1, total_opex: 24.5, ebitda: 34, ebitda_margin: 35 }
]

// SPV (Special Purpose Vehicle) - Estructura con 15% management fee - Con E-commerce
const SPV_STRUCTURE = {
  management_fee_percent: 15,
  descripcion: 'Todo el negocio (marketing, empleados, OpEx) opera en el SPV. La unidad operadora recibe 15% de fee por administrar y controlar el negocio.',
  impact: {
    opex_en_spv: true,
    fee_a_operadora: 'Revenue * 15%',
    distribuciones: 'FCF después de fee se distribuye según % equity',
    ventaja_inversionistas: 'Visibilidad completa de todos los gastos en el SPV',
    ventaja_operadora: 'Fee garantizado por management, incentivo alineado con crecimiento'
  },
  year_6_example: {
    revenue: 97.2,
    management_fee: 97.2 * 0.15, // $14.58M
    ebitda_spv: 34, // EBITDA antes de fee
    ebitda_after_fee: 34 - (97.2 * 0.15), // $19.42M disponible para inversionistas
    fee_operadora: 14.58
  }
}

// Riesgos
const RISK_MATRIX = [
  {
    id: 1,
    riesgo: 'Éxito Comercial de Nuevos Puntos de Venta',
    nivel: 'ALTO',
    impacto: 'Crítico para revenue projections',
    mitigacion: [
      'Análisis detallado de locaciones (foot traffic, demographics, competencia)',
      'Pilotos en 2-3 ubicaciones antes de expansión completa',
      'Métricas de éxito definidas: revenue/m², conversión, ticket promedio',
      'Plan B: pivote a locaciones alternativas si KPIs no se cumplen en 3 meses'
    ],
    color: 'red'
  },
  {
    id: 2,
    riesgo: 'Gastos Operativos Mayores a Proyectados',
    nivel: 'MEDIO',
    impacto: 'Comprime márgenes EBITDA (35% target)',
    mitigacion: [
      'Budget control mensual con varianza analysis',
      'Negociación de rentas con cláusulas de variable (% de ventas)',
      'Automatización de procesos operativos (ver sección Tech)',
      'Outsourcing de funciones no-core para convertir fixed en variable costs'
    ],
    color: 'yellow'
  },
  {
    id: 3,
    riesgo: 'Ejecución del Plan de Apertura (24 meses)',
    nivel: 'MEDIO',
    impacto: 'Delays impactan timeline de FCF y exit',
    mitigacion: [
      'Project manager dedicado para rollout',
      'Procesos estandarizados de apertura (playbook)',
      'Proveedores pre-calificados para CAPEX',
      'Buffer de 2 meses en plan (10 tiendas en 22 meses real)'
    ],
    color: 'yellow'
  },
  {
    id: 4,
    riesgo: 'Retención de Talento Clave',
    nivel: 'BAJO',
    impacto: 'Rotación afecta consistencia operativa',
    mitigacion: [
      'Equity pool para management team (5% del negocio)',
      'Bonos atados a performance de tienda',
      'Career path claro para store managers',
      'Cultura y valores bien definidos desde inicio'
    ],
    color: 'green'
  }
]

// ==================== COMPONENTE ====================

function InvestmentAnalysis() {
  const [expandedSections, setExpandedSections] = useState({})
  const [columnExplanation, setColumnExplanation] = useState(null)

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const showColumnExplanation = (column) => {
    setColumnExplanation(column)
  }

  const closeColumnExplanation = () => {
    setColumnExplanation(null)
  }

  // DCF Column Explanations
  const dcfColumnExplanations = {
    revenue: {
      title: 'Revenue',
      formula: 'Tiendas en operación × Revenue/tienda × 12 meses',
      explanation: 'Ingresos totales del año basados en $450K MXN/mes por tienda. Años 1-2: ramp-up de aperturas. Años 3-5: +3 tiendas orgánicas. Años 6-10: estable 15 tiendas.'
    },
    ebitda: {
      title: 'EBITDA',
      formula: 'Revenue × 35% (margen EBITDA target)',
      explanation: 'Earnings Before Interest, Taxes, Depreciation & Amortization. Margen 35% sostenible mediante control de OpEx (rentas 8%, salaries 12%, marketing 3%, otros 2%).'
    },
    depreciation: {
      title: 'D&A (Depreciation & Amortization)',
      formula: '~6% del revenue',
      explanation: 'Depreciación de mobiliario, equipos y adecuaciones de tiendas. Basado en CAPEX inicial de $2.5M por tienda con vida útil de 5-7 años.'
    },
    ebit: {
      title: 'EBIT',
      formula: 'EBITDA - D&A',
      explanation: 'Earnings Before Interest and Taxes. Utilidad operativa después de depreciación, pero antes de impuestos e intereses.'
    },
    tax: {
      title: 'Tax (ISR)',
      formula: 'EBIT × 30%',
      explanation: 'Impuesto Sobre la Renta en México. Tasa efectiva 30% aplicada sobre EBIT.'
    },
    nopat: {
      title: 'NOPAT',
      formula: 'EBIT - Tax = EBIT × (1 - 30%)',
      explanation: 'Net Operating Profit After Tax. Utilidad operativa después de impuestos, pero antes de considerar deuda.'
    },
    capex: {
      title: 'CAPEX',
      formula: '$2.5M por tienda nueva',
      explanation: 'Capital Expenditures. Años 1-2: aperturas de 10 tiendas ($25M). Años 3-5: 3 tiendas orgánicas ($7.5M). Años 6-10: solo mantenimiento.'
    },
    nwc: {
      title: '∆NWC (Change in Net Working Capital)',
      formula: 'Inventario + Cuentas por cobrar - Cuentas por pagar',
      explanation: 'Cambio en capital de trabajo. Aumenta con crecimiento de revenue (más inventario requerido). Estable en años 6-10.'
    },
    fcf: {
      title: 'FCF (Free Cash Flow)',
      formula: 'NOPAT + D&A - CAPEX - ∆NWC',
      explanation: 'Flujo de caja libre disponible para inversionistas. Este es el cash que el negocio genera después de todas las inversiones necesarias.'
    },
    pv_factor: {
      title: 'PV Factor (Present Value Factor)',
      formula: '1 / (1 + WACC)^año = 1 / (1.08)^año',
      explanation: 'Factor de descuento para traer flujos futuros a valor presente. WACC = 8% refleja costo de capital (risk-adjusted).'
    },
    pv: {
      title: 'PV (Present Value)',
      formula: 'FCF × PV Factor',
      explanation: 'Valor presente del flujo de caja de ese año. Suma de todos los PV + Terminal Value = Enterprise Value del negocio.'
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value * 1000000)
  }

  const formatCurrencyFull = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getRiskColor = (color) => {
    const colors = {
      red: 'border-red-500/50 bg-red-500/10',
      yellow: 'border-amber-500/50 bg-amber-500/10',
      green: 'border-emerald-500/50 bg-emerald-500/10'
    }
    return colors[color] || colors.yellow
  }

  const getRiskBadgeColor = (nivel) => {
    const colors = {
      ALTO: 'bg-red-500/20 text-red-400 border-red-500/50',
      MEDIO: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      BAJO: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
    }
    return colors[nivel] || colors.MEDIO
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-lg border-b border-titanium-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-titanium-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Análisis de Oportunidad de Inversión - Lenso</h1>
              <p className="text-sm text-titanium-400">
                Análisis Comparativo: SAFE vs DCF | Exit Año 6 vs Operar 10 Años
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* ========== RECOMENDACIÓN EJECUTIVA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Estructura del Deal - Lenso</h2>
              <p className="text-sm text-cyan-300">$25M por 25% equity - Control mayoritario para fundadores</p>
            </div>
          </div>

          <div className="bg-navy-900/50 rounded-2xl p-8 mb-6">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-titanium-400 mb-2">Inversión</p>
                <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-xl px-4 py-3">
                  <p className="text-2xl font-bold text-white">{formatCurrencyFull(CAPITAL.equity)}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-titanium-400 mb-2">Equity Inversionistas</p>
                <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-xl px-4 py-3">
                  <p className="text-2xl font-bold text-cyan-400">25%</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-titanium-400 mb-2">Equity Fundadores</p>
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl px-4 py-3">
                  <p className="text-2xl font-bold text-emerald-400">75%</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-titanium-400 mb-2">Post-Money Valuation</p>
                <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-xl px-4 py-3">
                  <p className="text-2xl font-bold text-white">{formatCurrencyFull(DEAL_VALUATION.post_money)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-xl font-semibold text-white">Inversión</span>
              <div className="bg-cyan-500/20 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-cyan-400">{formatCurrencyFull(CAPITAL.equity)}</span>
              </div>
              <ArrowRight className="w-8 h-8 text-titanium-500" />
              <span className="text-xl font-semibold text-white">Exit Año 6 (2X Revenue)</span>
              <div className="bg-emerald-500/20 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-emerald-400">{formatCurrency(YEAR_6_DATA.exit_2x_revenue.valor_inversionistas)}</span>
              </div>
            </div>

            <div className="border-t border-cyan-500/20 pt-4">
              <h4 className="font-bold text-white mb-3">💡 Beneficios Clave del Deal:</h4>
              <ul className="space-y-2 text-sm text-titanium-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Dilución conservadora:</strong> 25% inversionistas → Fundadores retienen 75% y control total</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Incluye E-commerce:</strong> 16 tiendas totales (15 físicas + 1 e-commerce) en año 6</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Exit conservador año 6:</strong> Valuación $194.4M (2X Revenue), retorno inversionistas 1.94x MOIC, 11.8% IRR</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Upside fundadores:</strong> 75% × $194.4M = <strong className="text-emerald-400">$145.8M</strong> en año 6</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300 text-center">
              <strong className="text-emerald-400">Win-Win:</strong> Inversionistas obtienen retorno atractivo (1.94x en 6 años),
              mientras Lenso mantiene control mayoritario (75%) y captura la mayor parte del upside.
            </p>
          </div>
        </motion.div>

        {/* ========== ESTRUCTURA DE CAPITAL ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">💰 Estructura de Capital</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-titanium-400">Equity</p>
                  <p className="text-3xl font-bold text-white">{formatCurrencyFull(CAPITAL.equity)}</p>
                </div>
              </div>
              <p className="text-xs text-titanium-500">83.3% del total</p>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-sm text-titanium-400">Deuda</p>
                  <p className="text-3xl font-bold text-white">{formatCurrencyFull(CAPITAL.deuda)}</p>
                </div>
              </div>
              <p className="text-xs text-titanium-500">16% anual, 5 años plazo</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-sm text-titanium-400">Total</p>
                  <p className="text-3xl font-bold text-white">{formatCurrencyFull(CAPITAL.total)}</p>
                </div>
              </div>
              <p className="text-xs text-titanium-500">Para 12 tiendas + capital trabajo</p>
            </div>
          </div>

          <div className="mt-6 bg-navy-900/50 rounded-xl p-4">
            <p className="text-sm text-titanium-300 text-center">
              <strong className="text-white">Objetivo:</strong> Abrir 10 tiendas nuevas + 2 existentes en primeros 24 meses,
              luego crecer orgánicamente 3 tiendas con FCF
            </p>
          </div>
        </motion.div>

        {/* ========== VALUACIÓN DEL NEGOCIO ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-lenso-green-800" />
            <h2 className="text-2xl font-bold text-white">Valuación del Negocio</h2>
            <div className="ml-auto px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full">
              <span className="text-sm font-semibold text-cyan-400">Pre-Money: {formatCurrencyFull(DEAL_VALUATION.pre_money)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Términos del Deal</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <span className="text-sm text-titanium-400">Inversión Total:</span>
                    <span className="text-lg font-bold text-white">{formatCurrencyFull(CAPITAL.total)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <span className="text-sm text-titanium-400">Equity:</span>
                    <span className="text-lg font-bold text-cyan-400">{formatCurrencyFull(CAPITAL.equity)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <span className="text-sm text-titanium-400">Deuda:</span>
                    <span className="text-lg font-bold text-white">{formatCurrencyFull(CAPITAL.deuda)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <span className="text-sm text-titanium-400">Pre-Money Valuation:</span>
                    <span className="text-lg font-bold text-cyan-400">{formatCurrencyFull(DEAL_VALUATION.pre_money)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <span className="text-sm text-titanium-400">Post-Money Valuation:</span>
                    <span className="text-lg font-bold text-white">{formatCurrencyFull(DEAL_VALUATION.post_money)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-titanium-400">Equity Inversionistas:</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-cyan-400">{DEAL_VALUATION.equity_dilution}%</span>
                      <p className="text-xs text-titanium-500">Fundadores retienen {DEAL_VALUATION.founders_equity}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-6">Referencia DCF (Valor Intrínseco)</h3>

                <div className="bg-navy-900/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-titanium-400">Enterprise Value (DCF):</span>
                    <span className="text-sm font-bold text-white">{formatCurrencyFull(DEAL_VALUATION.enterprise_value_dcf)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-titanium-400">Equity Value (DCF):</span>
                    <span className="text-sm font-bold text-emerald-400">{formatCurrencyFull(DEAL_VALUATION.equity_value_dcf)}</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                  <p className="text-xs text-titanium-300 mb-2">
                    <strong className="text-amber-400">Nota:</strong> DCF teórico ($370.7M) vs Pre-money negociado ($75M)
                  </p>
                  <p className="text-xs text-titanium-400">
                    La diferencia refleja descuento por early-stage, iliquidez, y riesgo de ejecución.
                    Pre-money $75M es conservador y alineado con multiples de mercado (≈2X Revenue proyectado año 2).
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">✅ Ventaja para Lenso:</p>
                  <p className="text-xs text-titanium-300">
                    25% dilución = Control total (75%) + Upside significativo en exit
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300 text-center">
              <strong className="text-white">Estructura Final:</strong> $25M equity (25%) + $5M deuda → Post-money $100M.
              Fundadores retienen 75% y control total del negocio.
            </p>
          </div>
        </motion.div>

        {/* ========== ESCENARIOS DE EXIT AÑO 6 ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Exit Año 6 - Proyecciones (16 Tiendas: 15 Físicas + 1 E-commerce)</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">Revenue Año 6</p>
              <p className="text-2xl font-bold text-white">${YEAR_6_DATA.revenue}M</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">EBITDA Año 6</p>
              <p className="text-2xl font-bold text-emerald-400">${YEAR_6_DATA.ebitda}M</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">Tiendas Físicas</p>
              <p className="text-2xl font-bold text-white">{YEAR_6_DATA.tiendasFisicas}</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">E-commerce</p>
              <p className="text-2xl font-bold text-cyan-400">{YEAR_6_DATA.ecommerce}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 2X Revenue (PRINCIPAL) */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Exit: 2X Revenue</h3>
                <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-xs font-semibold text-cyan-400">
                  PRINCIPAL
                </div>
              </div>

              <div className="bg-navy-900/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-titanium-400 mb-1">Valuación Exit</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(YEAR_6_DATA.exit_2x_revenue.valuacion)}</p>
                <p className="text-xs text-titanium-500 mt-1">Revenue Año 6: {formatCurrency(YEAR_6_DATA.revenue)} × 2</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-titanium-400">Valor Inversionistas (25%):</span>
                    <span className="text-xl font-bold text-cyan-400">{formatCurrency(YEAR_6_DATA.exit_2x_revenue.valor_inversionistas)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-cyan-500/10 rounded px-3 py-2 text-center">
                      <p className="text-xs text-titanium-400">MOIC</p>
                      <p className="text-lg font-bold text-white">{YEAR_6_DATA.exit_2x_revenue.moic.toFixed(2)}x</p>
                    </div>
                    <div className="bg-cyan-500/10 rounded px-3 py-2 text-center">
                      <p className="text-xs text-titanium-400">IRR</p>
                      <p className="text-lg font-bold text-white">{YEAR_6_DATA.exit_2x_revenue.irr.toFixed(1)}%</p>
                    </div>
                    <div className="bg-cyan-500/10 rounded px-3 py-2 text-center">
                      <p className="text-xs text-titanium-400">Equity</p>
                      <p className="text-lg font-bold text-white">25%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-cyan-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-titanium-400">Valor Fundadores (75%):</span>
                    <span className="text-xl font-bold text-emerald-400">{formatCurrency(YEAR_6_DATA.exit_2x_revenue.valor_fundadores)}</span>
                  </div>
                  <p className="text-xs text-titanium-300">Fundadores retienen la mayor parte del upside</p>
                </div>
              </div>
            </div>

            {/* 8X EBITDA (COMPARATIVO) */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Exit: 8X EBITDA</h3>
                <div className="px-3 py-1 bg-titanium-700/50 border border-titanium-600/50 rounded-full text-xs font-semibold text-titanium-400">
                  COMPARATIVO
                </div>
              </div>

              <div className="bg-navy-900/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-titanium-400 mb-1">Valuación Exit</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(YEAR_6_DATA.exit_8x_ebitda.valuacion)}</p>
                <p className="text-xs text-titanium-500 mt-1">EBITDA Año 6: {formatCurrency(YEAR_6_DATA.ebitda)} × 8</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-titanium-400">Valor Inversionistas (25%):</span>
                    <span className="text-xl font-bold text-emerald-400">{formatCurrency(YEAR_6_DATA.exit_8x_ebitda.valor_inversionistas)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-500/10 rounded px-3 py-2 text-center">
                      <p className="text-xs text-titanium-400">MOIC</p>
                      <p className="text-lg font-bold text-white">{YEAR_6_DATA.exit_8x_ebitda.moic.toFixed(2)}x</p>
                    </div>
                    <div className="bg-emerald-500/10 rounded px-3 py-2 text-center">
                      <p className="text-xs text-titanium-400">IRR</p>
                      <p className="text-lg font-bold text-white">{YEAR_6_DATA.exit_8x_ebitda.irr.toFixed(1)}%</p>
                    </div>
                    <div className="bg-emerald-500/10 rounded px-3 py-2 text-center">
                      <p className="text-xs text-titanium-400">Equity</p>
                      <p className="text-lg font-bold text-white">25%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-titanium-400">Valor Fundadores (75%):</span>
                    <span className="text-xl font-bold text-emerald-400">{formatCurrency(YEAR_6_DATA.exit_8x_ebitda.valor_fundadores)}</span>
                  </div>
                  <p className="text-xs text-titanium-300">Si márgenes EBITDA se mantienen &gt; 30%, este múltiplo genera valuación superior</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">📊 Análisis de Exit:</h4>
            <div className="space-y-2 text-sm text-titanium-300">
              <p>
                <strong className="text-white">2X Revenue (Conservador):</strong> Valuación $194.4M → Inversionistas $48.6M (25%), Fundadores $145.8M (75%)
              </p>
              <p>
                <strong className="text-white">8X EBITDA (Upside):</strong> Valuación $272M → Inversionistas $68M (25%), Fundadores $204M (75%)
              </p>
              <p>
                <strong className="text-white">Incluye E-commerce:</strong> 16 tiendas totales (15 físicas + 1 e-commerce) generando $97.2M revenue en año 6
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========== ESCENARIO OPERAR 10 AÑOS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📈 Escenario: Operar 10 Años (Sin Exit Año 6)</h2>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50 rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-bold text-white mb-6">Retorno Total: Distribuciones + Valor Terminal</h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Para Inversionistas (25%)</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <span className="text-sm text-titanium-400">Distribuciones Años 3-10:</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(YEAR_10_SCENARIO.distribuciones_inversionistas)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                    <span className="text-sm text-titanium-400">Valor Terminal Año 10 (2X Rev):</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(YEAR_10_SCENARIO.valor_terminal_inversionistas)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-titanium-400">Total Retorno:</span>
                    <span className="text-3xl font-bold text-cyan-400">{formatCurrency(YEAR_10_SCENARIO.total_inversionistas)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Para Fundadores (75%)</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-emerald-500/20">
                    <span className="text-sm text-titanium-400">Distribuciones Años 3-10:</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(YEAR_10_SCENARIO.distribuciones_fundadores)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-emerald-500/20">
                    <span className="text-sm text-titanium-400">Valor Terminal Año 10 (2X Rev):</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(YEAR_10_SCENARIO.valor_terminal_fundadores)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-titanium-400">Total Retorno:</span>
                    <span className="text-3xl font-bold text-emerald-400">{formatCurrency(YEAR_10_SCENARIO.total_fundadores)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-cyan-500/10 rounded-xl p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">MOIC Inversionistas</p>
                <p className="text-3xl font-bold text-white">{YEAR_10_SCENARIO.moic.toFixed(2)}x</p>
              </div>
              <div className="bg-cyan-500/10 rounded-xl p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">IRR Inversionistas</p>
                <p className="text-3xl font-bold text-white">{YEAR_10_SCENARIO.irr.toFixed(1)}%</p>
              </div>
              <div className="bg-emerald-500/10 rounded-xl p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">Equity Split</p>
                <p className="text-lg font-bold text-white">25% / 75%</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Nota:</strong> Distribuciones calculadas DESPUÉS de reinvertir en 3 tiendas orgánicas
              ($7.5M total). Free Cash Flow restante se distribuye a inversionistas según su % equity.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <h4 className="font-bold text-white mb-2">⚖️ Comparación vs Exit Año 6:</h4>
            <p className="text-sm text-titanium-300">
              Exit año 6 con DCF (IRR 12.8%) vs operar 10 años (IRR 13.2%) tiene retornos similares, pero
              <strong className="text-white"> exit año 6 preferible</strong> por: (1) Liquidez más temprana, (2) Menor riesgo operativo largo plazo.
            </p>
          </div>
        </motion.div>

        {/* ========== PROYECCIÓN FINANCIERA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📊 Proyección Financiera 10 Años</h2>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={PROYECCION_10_ANOS}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="year"
                stroke="#94a3b8"
                label={{ value: 'Año', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                tickFormatter={(value) => `Año ${value}`}
              />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                label={{ value: 'Millones MXN', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                label={{ value: 'Tiendas', angle: 90, position: 'insideRight', fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                formatter={(value, name) => {
                  if (name === 'Tiendas') return [value, name]
                  return [`$${value}M`, name]
                }}
                labelFormatter={(label) => `Año ${label}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>{value}</span>}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#3b82f6"
                fill="url(#revenueGrad)"
                strokeWidth={3}
              />
              <Bar
                yAxisId="left"
                dataKey="ebitda"
                name="EBITDA"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="distribuible"
                name="FCF Distribuible"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
              <Line
                yAxisId="right"
                type="stepAfter"
                dataKey="tiendas"
                name="Tiendas"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Chart Legend Explanation */}
          <div className="mt-6 bg-navy-800/50 rounded-xl p-4 border border-titanium-700/30">
            <h4 className="text-sm font-bold text-white mb-3">📖 Explicación de la Gráfica:</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 mt-1 rounded-full bg-blue-500"></div>
                <div>
                  <strong className="text-blue-400">Área Azul (Revenue):</strong>
                  <span className="text-titanium-300"> Ingresos totales anuales. Crece de $52M en Año 1 a $97.2M en Año 6.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 mt-1 rounded-full bg-emerald-500"></div>
                <div>
                  <strong className="text-emerald-400">Barras Verdes (EBITDA):</strong>
                  <span className="text-titanium-300"> Utilidad operativa (35% margen). Crece de $18.2M a $34M.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 mt-1 rounded-full bg-amber-500"></div>
                <div>
                  <strong className="text-amber-400">Línea Naranja (FCF Distribuible):</strong>
                  <span className="text-titanium-300"> Flujo de caja disponible para distribuir a inversionistas después de CAPEX y deuda.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3 h-3 mt-1 rounded-full bg-purple-500"></div>
                <div>
                  <strong className="text-purple-400">Línea Morada (Tiendas - eje derecho):</strong>
                  <span className="text-titanium-300"> Número total de tiendas operando. Crece de 11 a 16 (incluye 3 orgánicas).</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-navy-900/50 rounded-lg p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">Año 6 Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(YEAR_6_DATA.revenue)}</p>
            </div>
            <div className="bg-navy-900/50 rounded-lg p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">Año 6 EBITDA</p>
              <p className="text-xl font-bold text-emerald-400">{formatCurrency(YEAR_6_DATA.ebitda)}</p>
            </div>
            <div className="bg-navy-900/50 rounded-lg p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">Margen EBITDA</p>
              <p className="text-xl font-bold text-white">35%</p>
            </div>
            <div className="bg-navy-900/50 rounded-lg p-4 text-center">
              <p className="text-xs text-titanium-400 mb-1">Tiendas Orgánicas</p>
              <p className="text-xl font-bold text-purple-400">3</p>
            </div>
          </div>
        </motion.div>

        {/* ========== DCF DETALLADO (EXPANDIBLE) ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">💼 Detalle DCF - Cash Flows & Supuestos</h2>

          <div className="mb-4 bg-navy-900/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('dcf_detail')}
              className="w-full flex items-center justify-between p-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LineChart className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Ver Flujos de Caja Descontados (10 años)</span>
              </div>
              {expandedSections.dcf_detail ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
            </button>

            <AnimatePresence>
              {expandedSections.dcf_detail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-navy-800/50 rounded-lg p-4 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-titanium-700">
                          <th className="text-left py-2 px-2 text-titanium-400">Año</th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('revenue')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              Revenue
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('ebitda')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              EBITDA
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('depreciation')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              D&A
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('ebit')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              EBIT
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('tax')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              Tax
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('nopat')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              NOPAT
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('capex')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              CAPEX
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('nwc')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              ∆NWC
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('fcf')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              FCF
                            </button>
                          </th>
                          <th className="text-right py-2 px-2">
                            <button onClick={() => showColumnExplanation('pv_factor')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted">
                              PV Factor
                            </button>
                          </th>
                          <th className="text-right py-2 px-2 font-bold">
                            <button onClick={() => showColumnExplanation('pv')} className="text-titanium-400 hover:text-cyan-400 transition-colors underline decoration-dotted font-bold">
                              PV
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {DCF_CASH_FLOWS.map((row, idx) => (
                          <tr key={idx} className="border-b border-titanium-800 hover:bg-navy-700/30">
                            <td className="py-2 px-2 text-white">{row.year}</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.revenue}M</td>
                            <td className="py-2 px-2 text-right text-emerald-400">${row.ebitda}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.depreciation}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.ebit}M</td>
                            <td className="py-2 px-2 text-right text-red-400">${row.tax}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.nopat}M</td>
                            <td className="py-2 px-2 text-right text-orange-400">${row.capex}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.nwc}M</td>
                            <td className="py-2 px-2 text-right text-cyan-400">${row.fcf}M</td>
                            <td className="py-2 px-2 text-right text-titanium-400">{row.pv_factor.toFixed(3)}</td>
                            <td className="py-2 px-2 text-right text-white font-bold">${row.pv}M</td>
                          </tr>
                        ))}
                        <tr className="bg-cyan-500/10 font-bold">
                          <td colSpan="11" className="py-2 px-2 text-right text-white">Suma PV Flujos (Años 1-10):</td>
                          <td className="py-2 px-2 text-right text-cyan-400">${DCF_SUMMARY.sum_pv_flows}M</td>
                        </tr>
                        <tr className="border-t-2 border-cyan-500/30">
                          <td colSpan="11" className="py-2 px-2 text-right text-titanium-400">Terminal Value (PV):</td>
                          <td className="py-2 px-2 text-right text-white">${DCF_SUMMARY.pv_terminal}M</td>
                        </tr>
                        <tr className="bg-emerald-500/10 font-bold">
                          <td colSpan="11" className="py-2 px-2 text-right text-white">Enterprise Value:</td>
                          <td className="py-2 px-2 text-right text-emerald-400">${DCF_SUMMARY.enterprise_value}M</td>
                        </tr>
                        <tr>
                          <td colSpan="11" className="py-2 px-2 text-right text-titanium-400">Menos: Deuda Neta:</td>
                          <td className="py-2 px-2 text-right text-red-400">-$5M</td>
                        </tr>
                        <tr className="bg-emerald-500/10 font-bold">
                          <td colSpan="11" className="py-2 px-2 text-right text-white">Equity Value (DCF Teórico):</td>
                          <td className="py-2 px-2 text-right text-emerald-400">${DCF_SUMMARY.equity_value_dcf}M</td>
                        </tr>
                        <tr className="border-t-2 border-amber-500/30">
                          <td colSpan="11" className="py-2 px-2 text-right text-titanium-400 text-xs">
                            Descuento por Early Stage ({DCF_SUMMARY.discount_applied}%):
                          </td>
                          <td className="py-2 px-2 text-right text-amber-400 text-xs">-${(DCF_SUMMARY.equity_value_dcf - DCF_SUMMARY.pre_money_conservador).toFixed(2)}M</td>
                        </tr>
                        <tr className="bg-cyan-500/10 font-bold text-lg">
                          <td colSpan="11" className="py-3 px-2 text-right text-white">Pre-Money para Negociación:</td>
                          <td className="py-3 px-2 text-right text-cyan-400">${DCF_SUMMARY.pre_money_conservador}M</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Terminal Value Explanation */}
                    <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-purple-400" />
                        Cálculo de Terminal Value (Valor Perpetuo)
                      </h4>

                      <div className="bg-navy-900/50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-titanium-300 mb-3">
                          El Terminal Value representa el valor del negocio al final del período de proyección (año 10), asumiendo que opera en perpetuidad.
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-500/20 rounded px-3 py-2 flex-shrink-0">
                              <p className="text-xs text-titanium-400">Paso 1</p>
                              <p className="font-mono text-sm text-white">FCF Año 10</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-titanium-500" />
                            <div className="bg-purple-500/20 rounded px-3 py-2">
                              <p className="font-mono text-sm text-white">$24.21M</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="bg-purple-500/20 rounded px-3 py-2 flex-shrink-0">
                              <p className="text-xs text-titanium-400">Paso 2</p>
                              <p className="font-mono text-sm text-white">× (1 + g)</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-titanium-500" />
                            <div className="bg-purple-500/20 rounded px-3 py-2">
                              <p className="font-mono text-sm text-white">$24.21M × 1.03 = $24.95M</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="bg-purple-500/20 rounded px-3 py-2 flex-shrink-0">
                              <p className="text-xs text-titanium-400">Paso 3</p>
                              <p className="font-mono text-sm text-white">÷ (WACC - g)</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-titanium-500" />
                            <div className="bg-purple-500/20 rounded px-3 py-2">
                              <p className="font-mono text-sm text-white">$24.95M ÷ (8% - 3%) = $24.95M ÷ 5%</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded px-3 py-2 flex-shrink-0">
                              <p className="text-xs text-titanium-400">Terminal Value</p>
                              <p className="font-mono text-lg font-bold text-emerald-400">$498.9M</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-titanium-500" />
                            <div className="bg-cyan-500/20 border border-cyan-500/50 rounded px-3 py-2">
                              <p className="text-xs text-titanium-400">PV (Año 0)</p>
                              <p className="font-mono text-lg font-bold text-cyan-400">$230.95M</p>
                              <p className="text-xs text-titanium-400 mt-1">× 0.463 factor</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-500/5 rounded-lg p-3">
                        <p className="text-xs text-titanium-300">
                          <strong className="text-white">Fórmula:</strong> TV = FCF<sub>terminal</sub> / (WACC - g) donde:
                          <br/>• FCF<sub>terminal</sub> = $24.95M (FCF año 10 creciendo 3%)
                          <br/>• WACC = 8% (costo de capital)
                          <br/>• g = 3% (crecimiento perpetuo)
                          <br/>• PV Factor año 10 = 1 / (1.08)<sup>10</sup> = 0.463
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-navy-900/50 rounded p-3">
                        <p className="text-titanium-400 mb-2"><strong className="text-white">Supuestos DCF:</strong></p>
                        <ul className="text-titanium-300 space-y-1">
                          <li>• WACC: 8% (costo capital ponderado)</li>
                          <li>• Tax Rate: 30% (ISR México)</li>
                          <li>• Terminal Growth: 3% perpetuo</li>
                          <li>• D&A: 5-6% de revenue</li>
                        </ul>
                      </div>
                      <div className="bg-navy-900/50 rounded p-3">
                        <p className="text-titanium-400 mb-2"><strong className="text-white">CAPEX & NWC:</strong></p>
                        <ul className="text-titanium-300 space-y-1">
                          <li>• CAPEX años 1-5: Nuevas tiendas + orgánicas</li>
                          <li>• CAPEX años 6-10: Mantenimiento mínimo</li>
                          <li>• NWC: Inventario + cuentas por cobrar</li>
                          <li>• Terminal FCF: $24.95M año 10</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ========== PROYECCIONES P&L (PROFIT & LOSS) ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📈 Proyecciones P&L (Profit & Loss) - 10 Años</h2>
          <p className="text-sm text-titanium-400 mb-6">
            Estado de resultados proyectado para comprometer márgenes EBITDA 35% y control de OpEx
          </p>

          <div className="mb-4 bg-navy-900/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('pl_detail')}
              className="w-full flex items-center justify-between p-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-white">Ver Proyecciones P&L Completas (10 años)</span>
              </div>
              {expandedSections.pl_detail ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
            </button>

            <AnimatePresence>
              {expandedSections.pl_detail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-navy-800/50 rounded-lg p-4 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-titanium-700">
                          <th className="text-left py-2 px-2 text-titanium-400">Año</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Revenue</th>
                          <th className="text-right py-2 px-2 text-titanium-400">COGS</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Gross Profit</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Marketing</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Salaries</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Rent</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Other OpEx</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Total OpEx</th>
                          <th className="text-right py-2 px-2 text-titanium-400 font-bold">EBITDA</th>
                          <th className="text-right py-2 px-2 text-titanium-400">Margin %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PL_PROYECCIONES.map((row, idx) => (
                          <tr key={idx} className="border-b border-titanium-800 hover:bg-navy-700/30">
                            <td className="py-2 px-2 text-white">{row.year}</td>
                            <td className="py-2 px-2 text-right text-white font-semibold">${row.revenue}M</td>
                            <td className="py-2 px-2 text-right text-red-400">${row.cogs}M</td>
                            <td className="py-2 px-2 text-right text-emerald-400">${row.gross_profit}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.opex_marketing}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.opex_salaries}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.opex_rent}M</td>
                            <td className="py-2 px-2 text-right text-titanium-300">${row.opex_other}M</td>
                            <td className="py-2 px-2 text-right text-amber-400">${row.total_opex}M</td>
                            <td className="py-2 px-2 text-right text-cyan-400 font-bold">${row.ebitda}M</td>
                            <td className="py-2 px-2 text-right text-white">{row.ebitda_margin}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                        <p className="text-xs text-titanium-400 mb-2">Compromiso de Margen Bruto</p>
                        <p className="text-3xl font-bold text-emerald-400">50%</p>
                        <p className="text-xs text-titanium-300 mt-2">Consistente 10 años</p>
                      </div>
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                        <p className="text-xs text-titanium-400 mb-2">Compromiso EBITDA Margin</p>
                        <p className="text-3xl font-bold text-cyan-400">35%</p>
                        <p className="text-xs text-titanium-300 mt-2">Target mínimo operativo</p>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <p className="text-xs text-titanium-400 mb-2">OpEx como % Revenue</p>
                        <p className="text-3xl font-bold text-amber-400">~25%</p>
                        <p className="text-xs text-titanium-300 mt-2">Control estricto requerido</p>
                      </div>
                    </div>

                    <div className="mt-4 bg-navy-900/50 rounded p-3 text-sm text-titanium-300">
                      <p><strong className="text-white">Desglose OpEx:</strong></p>
                      <ul className="mt-2 space-y-1">
                        <li>• <strong className="text-white">Marketing:</strong> ~3% de revenue (digital, content, paid ads)</li>
                        <li>• <strong className="text-white">Salaries:</strong> ~12% de revenue (store staff, management, tech team)</li>
                        <li>• <strong className="text-white">Rent:</strong> ~8% de revenue (15 tiendas promedio, ubicaciones premium)</li>
                        <li>• <strong className="text-white">Other OpEx:</strong> ~2% de revenue (utilities, insurance, software, misc)</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300 text-center">
              <strong className="text-white">Compromiso Clave:</strong> Mantener EBITDA margin 35% mediante control estricto de OpEx,
              especialmente rentas (negociar % de ventas) y nómina (automatización + tech). Ver sección de Tech Stack para estrategias.
            </p>
          </div>
        </motion.div>

        {/* ========== ESTRUCTURA SPV con 15% FEE ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68 }}
          className="card-premium bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">🏢 Estructura SPV con Management Fee 15%</h2>
              <p className="text-sm text-blue-300">Special Purpose Vehicle para inversión</p>
            </div>
          </div>

          <div className="bg-navy-900/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Estructura Propuesta:</h3>
            <p className="text-sm text-titanium-300 mb-4">{SPV_STRUCTURE.descripcion}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">SPV (Inversionistas)</h4>
                <ul className="space-y-2 text-sm text-titanium-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Todos los gastos operativos (marketing, empleados, rentas, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Visibilidad completa de P&L y cash flows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Recibe todo el revenue de ventas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Paga 15% fee a unidad operadora</span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Unidad Operadora (Lenso Team)</h4>
                <ul className="space-y-2 text-sm text-titanium-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Recibe 15% de revenue como management fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Responsable de operación, gestión y control del negocio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Incentivo alineado con crecimiento (más revenue = más fee)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Mantiene equity stake en el SPV</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-navy-900/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Ejemplo Año 6 con SPV Structure:</h3>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">Revenue Total</p>
                <p className="text-2xl font-bold text-white">${SPV_STRUCTURE.year_6_example.revenue}M</p>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">Management Fee (15%)</p>
                <p className="text-2xl font-bold text-emerald-400">${SPV_STRUCTURE.year_6_example.management_fee.toFixed(2)}M</p>
              </div>
              <div className="bg-cyan-500/10 rounded-lg p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">EBITDA (antes de fee)</p>
                <p className="text-2xl font-bold text-white">${SPV_STRUCTURE.year_6_example.ebitda_spv}M</p>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">EBITDA SPV (después fee)</p>
                <p className="text-2xl font-bold text-amber-400">${SPV_STRUCTURE.year_6_example.ebitda_after_fee.toFixed(2)}M</p>
              </div>
            </div>

            <div className="bg-blue-500/5 rounded-lg p-4">
              <p className="text-sm text-titanium-300">
                <strong className="text-white">Flow de dinero:</strong> Revenue ($91.8M) → SPV paga 15% fee a operadora ($13.77M) →
                SPV retiene revenue neto → Paga todos los OpEx → EBITDA disponible para inversionistas: $18.33M
                <br/><br/>
                <strong className="text-white">Ventaja:</strong> Operadora tiene ingreso garantizado ($13.77M/año en año 6) + equity upside.
                Inversionistas tienen visibilidad total de gastos y control de distribuciones.
              </p>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300 text-center">
              <strong className="text-cyan-400">Recomendación:</strong> Esta estructura es común en levantamientos con PE/VC.
              Alinea incentivos (operadora quiere crecer revenue) y da transparencia a inversionistas.
              El 15% fee es competitivo para management de retail multi-tienda.
            </p>
          </div>
        </motion.div>

        {/* ========== SEMÁFORO DE RIESGOS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">🚦 Matriz de Riesgos & Mitigación</h2>
          </div>

          <div className="space-y-4">
            {RISK_MATRIX.map((risk, idx) => (
              <div key={risk.id} className={`border rounded-xl overflow-hidden ${getRiskColor(risk.color)}`}>
                <button
                  onClick={() => toggleSection(`risk_${risk.id}`)}
                  className="w-full flex items-center justify-between p-4 hover:bg-navy-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 border rounded-full text-xs font-semibold ${getRiskBadgeColor(risk.nivel)}`}>
                      {risk.nivel}
                    </div>
                    <span className="font-semibold text-white text-left">{risk.riesgo}</span>
                  </div>
                  {expandedSections[`risk_${risk.id}`] ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
                </button>

                <AnimatePresence>
                  {expandedSections[`risk_${risk.id}`] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="bg-navy-900/50 rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-white mb-1">Impacto:</p>
                          <p className="text-sm text-titanium-300">{risk.impacto}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            Estrategias de Mitigación:
                          </p>
                          <ul className="space-y-1">
                            {risk.mitigacion.map((item, i) => (
                              <li key={i} className="text-sm text-titanium-300 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ========== ARQUITECTURA TECH & AGENTES ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-premium bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">🤖 Tech Stack & AI Agents para Maximizar Éxito</h2>
              <p className="text-sm text-purple-300">Automatización y tecnología como ventaja competitiva</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Arquitectura de Agentes AI */}
            <div className="bg-navy-900/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">1. Arquitectura de Agentes AI</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">Customer Service Agent</p>
                  <p className="text-xs text-titanium-300">Chatbot 24/7 para consultas, seguimiento pedidos, recomendaciones personalizadas</p>
                  <p className="text-xs text-purple-400 mt-1">Impacto: Reduce costo nómina ~30%, mejora NPS</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">Inventory Optimization Agent</p>
                  <p className="text-xs text-titanium-300">Predicción demanda por SKU/tienda, reorder automático, minimiza stock-outs</p>
                  <p className="text-xs text-purple-400 mt-1">Impacto: Reduce inventario 20%, aumenta sell-through</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">Marketing Personalization Agent</p>
                  <p className="text-xs text-titanium-300">Segmentación automática, campaigns personalizados, A/B testing continuo</p>
                  <p className="text-xs text-purple-400 mt-1">Impacto: Aumenta conversión 15-25%</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">Financial Planning Agent</p>
                  <p className="text-xs text-titanium-300">Forecast revenue, budget variance analysis, alertas de gastos anormales</p>
                  <p className="text-xs text-purple-400 mt-1">Impacto: Control OpEx, protege márgenes EBITDA</p>
                </div>
              </div>
            </div>

            {/* Stack Tecnológico */}
            <div className="bg-navy-900/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">2. Stack Tecnológico Core</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">POS + CRM Integrado</p>
                  <p className="text-xs text-titanium-300">Sistema de ventas cloud, captura datos clientes, loyalty program automático</p>
                  <p className="text-xs text-cyan-400 mt-1">Herramientas: Shopify POS, Lightspeed</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">Business Intelligence</p>
                  <p className="text-xs text-titanium-300">Dashboards en tiempo real: revenue/tienda, margen, foot traffic, conversión</p>
                  <p className="text-xs text-cyan-400 mt-1">Herramientas: Tableau, Power BI</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">Gestión de Inventario</p>
                  <p className="text-xs text-titanium-300">Multi-tienda sync, reorder points automáticos, visibilidad full SKU-level</p>
                  <p className="text-xs text-cyan-400 mt-1">Herramientas: TradeGecko, NetSuite</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-semibold text-white mb-1">E-commerce + Omnichannel</p>
                  <p className="text-xs text-titanium-300">Tienda online integrada, BOPIS (buy online pick in-store), unified inventory</p>
                  <p className="text-xs text-cyan-400 mt-1">Herramientas: Shopify, WooCommerce</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ROI de Inversión Tech:
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-titanium-300">
              <div>
                <p className="font-semibold text-white mb-1">Reducción OpEx</p>
                <p>15-20% ahorro en nómina y gastos operativos vía automatización</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Aumento Revenue</p>
                <p>10-15% incremento por mejor conversión, personalización, omnichannel</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Protección Márgenes</p>
                <p>Mantiene EBITDA 35% target incluso con presión en costos</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300 text-center">
              <strong className="text-purple-400">Inversión Tech estimada:</strong> $3-5M en primeros 2 años.
              <strong className="text-white"> Payback:</strong> 18-24 meses vía reducción costos y aumento ventas.
            </p>
          </div>
        </motion.div>

        {/* ========== SUPUESTOS (COLLAPSIBLE) ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📋 Supuestos del Modelo</h2>

          {/* Supuesto 1 */}
          <div className="mb-4 bg-navy-900/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('revenue')}
              className="w-full flex items-center justify-between p-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Revenue por Tienda: $450K MXN/mes</span>
              </div>
              {expandedSections.revenue ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
            </button>

            <AnimatePresence>
              {expandedSections.revenue && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-navy-800/50 rounded-lg p-4 text-sm text-titanium-300 space-y-2">
                    <p><strong className="text-white">Fuente:</strong> Performance actual de tiendas existentes (Plaza Patria y La Perla)</p>
                    <p><strong className="text-white">Ramp-up:</strong> Nuevas tiendas alcanzan $450K/mes después de 6 meses de operación (S-curve)</p>
                    <p><strong className="text-white">Conservador:</strong> No asume crecimiento same-store sales, solo apertura de nuevas unidades</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Supuesto 2 */}
          <div className="mb-4 bg-navy-900/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('margins')}
              className="w-full flex items-center justify-between p-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Percent className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-white">Márgenes: 50% Bruto, 35% EBITDA</span>
              </div>
              {expandedSections.margins ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
            </button>

            <AnimatePresence>
              {expandedSections.margins && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-navy-800/50 rounded-lg p-4 text-sm text-titanium-300 space-y-2">
                    <p><strong className="text-white">Margen Bruto 50%:</strong> Estándar retail óptico fashion (costo producto + logística)</p>
                    <p><strong className="text-white">EBITDA 35%:</strong> Incluye renta (~8%), nómina (~12%), marketing (~3%), otros OpEx (~2%)</p>
                    <p><strong className="text-white">Benchmark:</strong> Comparable con Warby Parker y otros retail ópticos exitosos (30-40%)</p>
                    <p><strong className="text-white">Nota inventario:</strong> Costo inventario bajo (~10% COGS), riesgo principal está en OpEx (rentas, nómina)</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Supuesto 3 */}
          <div className="mb-4 bg-navy-900/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('multiples')}
              className="w-full flex items-center justify-between p-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">Múltiplo Exit: 2X Revenue (principal)</span>
              </div>
              {expandedSections.multiples ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
            </button>

            <AnimatePresence>
              {expandedSections.multiples && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-navy-800/50 rounded-lg p-4 text-sm text-titanium-300 space-y-2">
                    <p><strong className="text-white">2X Revenue:</strong> Múltiplo conservador común en retail specialty con presencia establecida</p>
                    <p><strong className="text-white">8X EBITDA (comparativo):</strong> Si EBITDA margins se mantienen &gt;30%, este múltiplo genera valuación superior</p>
                    <p><strong className="text-white">Recomendación:</strong> Usar 2X Revenue como base, pero negociar hacia 8X EBITDA si márgenes demuestran ser sostenibles</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Supuesto 4 */}
          <div className="mb-4 bg-navy-900/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('organico')}
              className="w-full flex items-center justify-between p-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-white">Crecimiento Orgánico: 3 Tiendas con FCF</span>
              </div>
              {expandedSections.organico ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
            </button>

            <AnimatePresence>
              {expandedSections.organico && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-navy-800/50 rounded-lg p-4 text-sm text-titanium-300 space-y-2">
                    <p><strong className="text-white">CAPEX por tienda:</strong> $2.5M MXN (mobiliario, inventario inicial, adecuaciones)</p>
                    <p><strong className="text-white">Timing:</strong> Años 3, 4 y 5 - cuando FCF es suficiente para autofinanciar</p>
                    <p><strong className="text-white">Distribuciones:</strong> FCF restante DESPUÉS de reinversión orgánica se distribuye a inversionistas</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Supuesto 5 */}
          <div className="bg-navy-900/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('dilution')}
              className="w-full flex items-center justify-between p-4 hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-white">Dilución: Por qué DCF es mejor para Lenso</span>
              </div>
              {expandedSections.dilution ? <ChevronUp className="w-5 h-5 text-titanium-400" /> : <ChevronDown className="w-5 h-5 text-titanium-400" />}
            </button>

            <AnimatePresence>
              {expandedSections.dilution && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-navy-800/50 rounded-lg p-4 text-sm text-titanium-300 space-y-2">
                    <p><strong className="text-white">DCF 21.7% dilución:</strong> Fundadores retienen 78.3% - Control total y mayor upside</p>
                    <p><strong className="text-white">SAFE 33.9% dilución:</strong> Fundadores retienen 66.1% - Pierden 12.2 puntos adicionales</p>
                    <p><strong className="text-white">Impacto en exit:</strong> Con 2X Revenue ($183.6M), DCF da fundadores $143.8M vs $121.4M con SAFE = $22.4M diferencia</p>
                    <p><strong className="text-white">Conclusión:</strong> A menos que inversionistas demanden SAFE, DCF maximiza valor para Lenso</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ========== CONCLUSIÓN FINAL ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card-premium bg-gradient-to-r from-navy-800 to-navy-700 border-2 border-cyan-500/50"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">✅ Resumen Ejecutivo - Recomendación para Lenso</h2>

          <div className="space-y-6">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Escenario Óptimo:</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-navy-900/50 rounded-lg p-4">
                  <p className="text-sm text-titanium-400 mb-2">Método</p>
                  <p className="text-lg font-bold text-cyan-400">DCF Tradicional</p>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-4">
                  <p className="text-sm text-titanium-400 mb-2">Exit</p>
                  <p className="text-lg font-bold text-cyan-400">2X Revenue Año 6</p>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-4">
                  <p className="text-sm text-titanium-400 mb-2">Dilución</p>
                  <p className="text-lg font-bold text-white">21.7%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-titanium-400">Valuación Exit</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(YEAR_6_DATA.exit_2x_revenue.valuacion)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-titanium-400">Valor Fundadores</p>
                  <p className="text-2xl font-bold text-emerald-400">$143.8M</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-titanium-400">Valor Inversionistas</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(YEAR_6_DATA.exit_2x_revenue.valor_inversionistas_dcf)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-titanium-400">IRR Inversionistas</p>
                  <p className="text-2xl font-bold text-white">{YEAR_6_DATA.exit_2x_revenue.irr_dcf.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-navy-900/50 rounded-xl p-6">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  Ventajas para Lenso:
                </h4>
                <ul className="space-y-2 text-sm text-titanium-300">
                  <li>• Retienen 78.3% del negocio = control total</li>
                  <li>• Capturan $143.8M en exit vs $121.4M con SAFE</li>
                  <li>• Menos presión de inversionistas VC</li>
                  <li>• Flexibilidad para reinvertir o distribuir según estrategia</li>
                </ul>
              </div>

              <div className="bg-navy-900/50 rounded-xl p-6">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Factores de Éxito:
                </h4>
                <ul className="space-y-2 text-sm text-titanium-300">
                  <li>• Validación locaciones antes de apertura</li>
                  <li>• Control estricto OpEx (automatización + tech)</li>
                  <li>• Arquitectura de agentes AI para escalar eficientemente</li>
                  <li>• Exit preparado año 5-6 con métricas sólidas</li>
                </ul>
              </div>
            </div>

            <div className="bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-xl p-6 text-center">
              <p className="text-lg text-white mb-2">
                <strong>Recomendación Final:</strong> Levantar $25M via DCF con dilución 21.7%, usar tech/AI para proteger márgenes,
                ejecutar plan de apertura en 24 meses, y preparar exit año 6 con múltiplo 2X Revenue mínimo.
                <strong className="text-cyan-400"> Lenso captura $143.8M, inversionistas obtienen IRR 12.8% sólido.</strong>
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ========== MODAL: COLUMN EXPLANATION ========== */}
      <AnimatePresence>
        {columnExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeColumnExplanation}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-navy-900 border-2 border-cyan-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {dcfColumnExplanations[columnExplanation]?.title}
                  </h3>
                </div>
                <button
                  onClick={closeColumnExplanation}
                  className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors"
                >
                  <span className="text-titanium-400 text-xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-cyan-400 mb-2">Fórmula:</p>
                  <p className="font-mono text-white">{dcfColumnExplanations[columnExplanation]?.formula}</p>
                </div>

                <div className="bg-navy-800/50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-white mb-2">Explicación:</p>
                  <p className="text-sm text-titanium-300">{dcfColumnExplanations[columnExplanation]?.explanation}</p>
                </div>

                <button
                  onClick={closeColumnExplanation}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InvestmentAnalysis
