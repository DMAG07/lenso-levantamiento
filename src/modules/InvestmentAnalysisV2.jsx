import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  DollarSign, TrendingUp, Store, Target, ArrowLeft, Calendar,
  CheckCircle2, Award, AlertTriangle, Shield, Users, TrendingDown, ArrowRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Line, Cell } from 'recharts'

// ==================== SUPUESTOS ALINEADOS ====================

const SUPUESTOS_CAPITAL = {
  equity: 25, // $25M
  deuda: 5, // $5M
  total: 30, // $30M
  dilucion: 25, // 25%
  postMoneyValuation: 125, // $125M ($25M / 25% + $25M)
  preMoneyValuation: 100 // $100M ($25M / 25%)
}

// ==================== SUPUESTOS OPERATIVOS DETALLADOS ====================
const SUPUESTOS_OPERATIVOS = {
  // Por Tienda (Promedios)
  perStore: {
    revenue: 6.0, // $6M anual por tienda en steady state
    employees: 5.0, // 5 empleados por tienda (1 gerente + 4 vendedores)
    rentMonthly: 75000, // $75K MXN/mes ($900K/año)
    rentAnnual: 0.9 // $900K/año
  },

  // Salarios
  salaries: {
    gerente: 25000, // $25K/mes
    vendedor: 12000, // $12K/mes
    avgPerEmployee: 15000 // $15K/mes promedio ponderado
  },

  // % del Revenue (Benchmarks Retail México)
  opexPercent: {
    marketing: {
      expansion: 0.08, // 8% durante expansión (años 1-3)
      mature: 0.05 // 5% en madurez (años 4+)
    },
    salaries: 0.15, // 15% del revenue (5 empleados × $15K × 12 / $6M)
    rent: 0.15, // 15% del revenue ($900K / $6M)
    other: 0.025, // 2.5% (utilities, seguros, mantenimiento)
    comisiones: 0.03 // 3% comisiones de venta
  },

  // Márgenes Target
  margins: {
    grossMargin: 0.64, // 64%
    ebitdaBruto: {
      expansion: 0.205, // 20.5% años 1-3 (64% - 43.5% OpEx)
      mature: 0.235 // 23.5% años 4+ (64% - 40.5% OpEx)
    },
    ebitdaNeto: {
      expansion: 0.125, // 12.5% años 1-3 (después de fee 8%)
      mature: 0.155 // 15.5% años 4+ (después de fee 8%)
    }
  }
}

// ==================== DATOS COMPLETOS ====================
// MARGEN BRUTO: 64%
// EBITDA Años 1-3: 20.5% Bruto - Fee Operadora 8% = 12.5% Neto
// EBITDA Años 4+: 23.5% Bruto - Fee Operadora 8% = 15.5% Neto

// Deuda: $5M al 15.5% anual
// Interés anual: $0.775M
// Pago capital: Años 4-6 ($1.67M/año) para liquidar deuda
const DEBT_SERVICE = {
  principal: 5.0, // $5M
  rate: 0.155, // 15.5%
  interestAnnual: 0.775, // $775K
  capitalPayment: 1.67, // $1.67M/año (años 4-6)
  years: [
    { year: 1, interest: 0.775, principal: 0, total: 0.775 },
    { year: 2, interest: 0.775, principal: 0, total: 0.775 },
    { year: 3, interest: 0.775, principal: 0, total: 0.775 },
    { year: 4, interest: 0.775, principal: 1.67, total: 2.44 },
    { year: 5, interest: 0.775, principal: 1.67, total: 2.44 },
    { year: 6, interest: 0.775, principal: 1.66, total: 2.44 }, // $1.66M para completar $5M
    { year: 7, interest: 0, principal: 0, total: 0 },
    { year: 8, interest: 0, principal: 0, total: 0 },
    { year: 9, interest: 0, principal: 0, total: 0 },
    { year: 10, interest: 0, principal: 0, total: 0 }
  ]
}

// Impuesto del 30% sobre utilidad neta (después de intereses)
const TAX_RATE = 0.30 // 30%

// Proyecciones con crecimiento 3.5% anual por tienda (Renta $75K/mes, 5 empleados, Impuestos 30%)
// Años 1-3: Marketing 8%, Total OpEx 43.5%, EBITDA Bruto 20.5%, EBITDA Neto 12.5%
// Años 4+: Marketing 5%, Total OpEx 40.5%, EBITDA Bruto 23.5%, EBITDA Neto 15.5%
// Impuestos: 30% sobre EBIT
// FCF incluye: Net Income - Pago Capital Deuda - Inversión Tiendas Orgánicas
// NUEVO: Revenue por tienda crece 3.5% anual (año 1: $6M, año 10: $8.18M)
const PROYECCION_10_ANOS = [
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

// Cálculo DCF con WACC 20%, growth 3.5% anual, impuestos 30%
// FCF = Net Income - Capital Payment - Inversión Tiendas Orgánicas
const DCF_DETAIL = [
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

const DCF_VALUATION = {
  // Flujos descontados
  year1to10Flows: DCF_DETAIL,
  pvCashFlows10Years: 33.26, // Suma de PV años 1-10

  // Terminal Value
  year10FCF: 15.97,
  perpetualGrowth: 0.03, // 3%
  wacc: 0.20, // 20%
  terminalValue: 96.76, // 15.97 * 1.03 / (0.20 - 0.03)
  terminalValuePV: 15.63, // TV / 1.20^10

  // Valuación total
  enterpriseValue: 48.88, // 33.26 + 15.63
  deudaNeta: 0, // Deuda liquidada en año 6
  equityValueDCF: 48.88 // EV - Deuda (deuda ya pagada en proyección)
}

const VENTURE_CAPITAL_VALUATION = {
  year6Revenue: 128.27,
  year10Revenue: 147.19,
  multiploVentas: 2.0, // 2X ventas (conservador para retail)
  valuationYear6: 256.54, // 2.0 × $128.27M
  valuationYear10: 294.38, // 2.0 × $147.19M
  methodology: '2X Revenue Multiple'
}

// POLÍTICA DE DIVIDENDOS: 50% del FCF distribuible a partir del año 3
// El 50% restante se retiene como cash en la empresa (buffer operativo)
const DIVIDEND_POLICY = {
  startYear: 3,
  distributionRate: 0.50 // 50% del FCF distribuible
}

// ESCENARIOS DE EXIT (dilución 25%, distribución 50%, incluye cash acumulado)
const calculateExitScenario6 = () => {
  const exitValue = VENTURE_CAPITAL_VALUATION.valuationYear6

  // Calcular cash acumulado (años 1-2: 100% retenido, años 3-6: 50% retenido)
  const cashAccumulated = PROYECCION_10_ANOS.slice(0, 6).reduce((sum, y) => {
    const isDistributing = y.year >= DIVIDEND_POLICY.startYear
    return sum + (isDistributing ? y.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : y.distribuible)
  }, 0)

  // Valuación total = Empresa + Cash
  const totalValue = exitValue + cashAccumulated
  const investorShare = totalValue * (SUPUESTOS_CAPITAL.dilucion / 100)

  // Calcular dividendos recibidos años 3-6
  const dividends = PROYECCION_10_ANOS.slice(2, 6).reduce((sum, y) => {
    return sum + (y.distribuible * DIVIDEND_POLICY.distributionRate * (SUPUESTOS_CAPITAL.dilucion / 100))
  }, 0)

  const totalReturn = investorShare + dividends
  const moic = totalReturn / SUPUESTOS_CAPITAL.equity
  const irr = (Math.pow(moic, 1/6) - 1) * 100

  return {
    year: 6,
    exitValue,
    cashAccumulated,
    totalValue,
    investorValue: investorShare,
    founderValue: totalValue * (1 - SUPUESTOS_CAPITAL.dilucion / 100),
    dividendsReceived: dividends,
    totalReturn,
    moic,
    irr
  }
}

const calculateExitScenario10 = () => {
  const exitValue = VENTURE_CAPITAL_VALUATION.valuationYear10

  // Calcular cash acumulado (años 1-2: 100% retenido, años 3-10: 50% retenido)
  const cashAccumulated = PROYECCION_10_ANOS.slice(0, 10).reduce((sum, y) => {
    const isDistributing = y.year >= DIVIDEND_POLICY.startYear
    return sum + (isDistributing ? y.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : y.distribuible)
  }, 0)

  // Valuación total = Empresa + Cash
  const totalValue = exitValue + cashAccumulated
  const investorShare = totalValue * (SUPUESTOS_CAPITAL.dilucion / 100)

  // Calcular dividendos recibidos años 3-10 (50% del FCF distribuible)
  const dividends = PROYECCION_10_ANOS.slice(2, 10).reduce((sum, y) => {
    return sum + (y.distribuible * DIVIDEND_POLICY.distributionRate * (SUPUESTOS_CAPITAL.dilucion / 100))
  }, 0)

  const totalReturn = investorShare + dividends
  const moic = totalReturn / SUPUESTOS_CAPITAL.equity
  const irr = (Math.pow(moic, 1/10) - 1) * 100

  return {
    year: 10,
    exitValue,
    cashAccumulated,
    totalValue,
    investorValue: investorShare,
    founderValue: totalValue * (1 - SUPUESTOS_CAPITAL.dilucion / 100),
    dividendsReceived: dividends,
    totalReturn,
    moic,
    irr
  }
}

const EXIT_SCENARIO_6 = calculateExitScenario6()
const EXIT_SCENARIO_10 = calculateExitScenario10()

// P&L con growth 3.5% anual (Renta $75K/mes, 5 empleados, OpEx salarios 15%, renta 15%, Impuestos 30%)
const PL_PROYECCIONES = [
  { year: 1, revenue: 66.00, cogs: 23.76, gross_profit: 42.24, gross_margin: 64, opex_marketing: 5.28, opex_salaries: 9.90, opex_rent: 9.90, opex_comisiones: 1.98, opex_other: 1.65, total_opex: 28.71, ebitdaBruto: 13.53, ebitdaBrutoMargin: 20.5, feeOperadora: 5.28, ebitdaNeto: 8.25, ebitdaNetoMargin: 12.5, interestExpense: 0.775, ebit: 7.475, taxes: 2.242, netIncome: 5.23, capitalPayment: 0, debtService: 0.775 },
  { year: 2, revenue: 80.73, cogs: 29.06, gross_profit: 51.67, gross_margin: 64, opex_marketing: 6.46, opex_salaries: 12.11, opex_rent: 12.11, opex_comisiones: 2.42, opex_other: 2.02, total_opex: 35.12, ebitdaBruto: 16.55, ebitdaBrutoMargin: 20.5, feeOperadora: 6.46, ebitdaNeto: 10.09, ebitdaNetoMargin: 12.5, interestExpense: 0.775, ebit: 9.316, taxes: 2.795, netIncome: 6.52, capitalPayment: 0, debtService: 0.775 },
  { year: 3, revenue: 89.98, cogs: 32.39, gross_profit: 57.59, gross_margin: 64, opex_marketing: 7.20, opex_salaries: 13.50, opex_rent: 13.50, opex_comisiones: 2.70, opex_other: 2.25, total_opex: 39.14, ebitdaBruto: 18.45, ebitdaBrutoMargin: 20.5, feeOperadora: 7.20, ebitdaNeto: 11.25, ebitdaNetoMargin: 12.5, interestExpense: 0.775, ebit: 10.473, taxes: 3.142, netIncome: 7.33, capitalPayment: 0, debtService: 0.775 },
  { year: 4, revenue: 106.44, cogs: 38.32, gross_profit: 68.12, gross_margin: 64, opex_marketing: 5.32, opex_salaries: 15.97, opex_rent: 15.97, opex_comisiones: 3.19, opex_other: 2.66, total_opex: 43.11, ebitdaBruto: 25.01, ebitdaBrutoMargin: 23.5, feeOperadora: 8.52, ebitdaNeto: 16.50, ebitdaNetoMargin: 15.5, interestExpense: 0.775, ebit: 15.723, taxes: 4.717, netIncome: 11.01, capitalPayment: 1.67, debtService: 2.445 },
  { year: 5, revenue: 123.93, cogs: 44.61, gross_profit: 79.32, gross_margin: 64, opex_marketing: 6.20, opex_salaries: 18.59, opex_rent: 18.59, opex_comisiones: 3.72, opex_other: 3.10, total_opex: 50.19, ebitdaBruto: 29.12, ebitdaBrutoMargin: 23.5, feeOperadora: 9.91, ebitdaNeto: 19.21, ebitdaNetoMargin: 15.5, interestExpense: 0.775, ebit: 18.434, taxes: 5.530, netIncome: 12.90, capitalPayment: 1.67, debtService: 2.445 },
  { year: 6, revenue: 128.27, cogs: 46.18, gross_profit: 82.09, gross_margin: 64, opex_marketing: 6.41, opex_salaries: 19.24, opex_rent: 19.24, opex_comisiones: 3.85, opex_other: 3.21, total_opex: 51.95, ebitdaBruto: 30.14, ebitdaBrutoMargin: 23.5, feeOperadora: 10.26, ebitdaNeto: 19.88, ebitdaNetoMargin: 15.5, interestExpense: 0.775, ebit: 19.107, taxes: 5.732, netIncome: 13.37, capitalPayment: 1.66, debtService: 2.435 },
  { year: 7, revenue: 132.76, cogs: 47.79, gross_profit: 84.97, gross_margin: 64, opex_marketing: 6.64, opex_salaries: 19.91, opex_rent: 19.91, opex_comisiones: 3.98, opex_other: 3.32, total_opex: 53.77, ebitdaBruto: 31.20, ebitdaBrutoMargin: 23.5, feeOperadora: 10.62, ebitdaNeto: 20.58, ebitdaNetoMargin: 15.5, interestExpense: 0, ebit: 20.578, taxes: 6.173, netIncome: 14.40, capitalPayment: 0, debtService: 0 },
  { year: 8, revenue: 137.41, cogs: 49.47, gross_profit: 87.94, gross_margin: 64, opex_marketing: 6.87, opex_salaries: 20.61, opex_rent: 20.61, opex_comisiones: 4.12, opex_other: 3.44, total_opex: 55.65, ebitdaBruto: 32.29, ebitdaBrutoMargin: 23.5, feeOperadora: 10.99, ebitdaNeto: 21.30, ebitdaNetoMargin: 15.5, interestExpense: 0, ebit: 21.299, taxes: 6.390, netIncome: 14.91, capitalPayment: 0, debtService: 0 }
]

const RISK_MATRIX = [
  {
    id: 0,
    riesgo: 'Track Record del Equipo Fundador',
    nivel: 'FORTALEZA',
    impacto: 'Factor de éxito crítico - Experiencia probada ejecutando exits en la categoría',
    mitigacion: ['Equipo fundador con exits exitosos previos en retail óptico', 'Metodología comprobada de selección de ubicaciones (métricas: foot traffic, demographics, competencia)', 'Red establecida de proveedores y socios estratégicos', 'Capacidad demostrada de escalar operaciones rentablemente'],
    color: 'blue',
    isPositive: true
  },
  {
    id: 1,
    riesgo: 'Márgenes Operativos Superiores',
    nivel: 'FORTALEZA',
    impacto: 'EBITDA neto 15.5% vs 10-12% promedio retail specialty en México',
    mitigacion: ['Arquitectura de AI para optimización de inventario y pricing dinámico', 'Modelo operativo eficiente validado en tiendas existentes', 'Negociación de rentas con cláusulas variables (protege downside)', 'Automatización de procesos back-office reduce OpEx en escala'],
    color: 'blue',
    isPositive: true
  },
  {
    id: 2,
    riesgo: 'Adaptación a Ecommerce',
    nivel: 'OPORTUNIDAD',
    impacto: 'Canal digital complementa retail físico sin canibalización',
    mitigacion: ['1 de las 18 tiendas será formato híbrido retail + ecommerce hub', 'Estrategia omnicanal: web muestra catálogo, customer recoge/prueba en tienda', 'Menor inversión CAPEX que tienda física (~40% costo)', 'Datos de ecommerce informan decisiones de inventario en físico'],
    color: 'green',
    isPositive: true
  },
  {
    id: 3,
    riesgo: 'Rendimiento de Nuevos Puntos de Venta',
    nivel: 'MEDIO',
    impacto: 'Performance individual de tiendas puede variar vs proyecciones',
    mitigacion: ['Equipo tiene metodología validada de site selection con métricas claras', 'Plan contempla ramp-up de 6-12 meses por ubicación (conservador)', 'Cláusulas de salida en contratos de renta (reducen downside)', 'Diversificación geográfica (13 ubicaciones) mitiga riesgo de concentración'],
    color: 'yellow'
  },
  {
    id: 4,
    riesgo: 'Ejecución del Plan de Apertura',
    nivel: 'MEDIO',
    impacto: 'Delays en aperturas impactan timeline de revenue ramp',
    mitigacion: ['Project manager dedicado con experiencia en retail rollouts', 'Procesos estandarizados de apertura (45 días por tienda)', 'Buffer de 2 meses en plan financiero', 'Proveedores de fit-out pre-negociados'],
    color: 'yellow'
  },
  {
    id: 5,
    riesgo: 'Retención de Talento Clave',
    nivel: 'BAJO',
    impacto: 'Rotación de management afecta ejecución',
    mitigacion: ['Equity pool 5% para management clave (alineación largo plazo)', 'Bonos atados a KPIs: revenue/tienda, EBITDA margin, NPS', 'Career path claro con plan de sucesión documentado', 'Compensación competitiva vs mercado'],
    color: 'green'
  }
]

// ==================== COMPONENTE ====================

function InvestmentAnalysisV2() {
  const navigate = useNavigate()

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
    }).format(value * 1000000)
  }

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
            <h1 className="text-2xl font-bold text-white">Análisis de Oportunidad de Inversión - Lenso</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* ========== EXECUTIVE SUMMARY ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-2 border-emerald-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl font-bold text-white">Executive Summary</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-2">Equity</p>
              <p className="text-2xl font-bold text-white">${SUPUESTOS_CAPITAL.equity}M</p>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-2">Deuda</p>
              <p className="text-2xl font-bold text-white">${SUPUESTOS_CAPITAL.deuda}M</p>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-2">Total Raise</p>
              <p className="text-2xl font-bold text-emerald-400">${SUPUESTOS_CAPITAL.total}M</p>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-2">Dilución</p>
              <p className="text-2xl font-bold text-white">{SUPUESTOS_CAPITAL.dilucion}%</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <p className="text-sm text-titanium-400 mb-1">Pre-Money Valuation</p>
              <p className="text-3xl font-bold text-white">${SUPUESTOS_CAPITAL.preMoneyValuation}M</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-sm text-titanium-400 mb-1">Post-Money Valuation</p>
              <p className="text-3xl font-bold text-white">${SUPUESTOS_CAPITAL.postMoneyValuation}M</p>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">¿Por Qué Esta Oportunidad?</h3>
            <ul className="space-y-2 text-sm text-titanium-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Equipo Probado:</strong> Fundadores con exits exitosos previos en retail óptico y experiencia comprobada en selección de ubicaciones de alto rendimiento</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Modelo Rentable:</strong> Márgenes EBITDA neto 15.5% (post-fee) en steady state, superiores a retail specialty promedio en México (10-12%)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Dividendos desde Año 3:</strong> Flujo de caja recurrente (50% FCF distribuible) genera retorno tangible antes del exit. Proyección {formatCurrency(EXIT_SCENARIO_6.dividendsReceived)} acumulados años 3-6</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Expansión Inteligente:</strong> 13 tiendas iniciales + 5 orgánicas autofinanciadas + 1 canal ecommerce. Crecimiento controlado basado en métricas claras del equipo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Eficiencia Operativa:</strong> Arquitectura de AI para optimizar inventario, pricing y customer experience. Mejora márgenes y reduce OpEx en el tiempo</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* ========== POLÍTICA DE DIVIDENDOS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-premium bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-2 border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Política de Dividendos</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-2">Inicio Distribución</p>
              <p className="text-3xl font-bold text-white">Año {DIVIDEND_POLICY.startYear}</p>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-2">% FCF Distribuible</p>
              <p className="text-3xl font-bold text-purple-400">{(DIVIDEND_POLICY.distributionRate * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <p className="text-xs text-titanium-400 mb-2">Para Inversionistas ({SUPUESTOS_CAPITAL.dilucion}%)</p>
              <p className="text-3xl font-bold text-emerald-400">{(DIVIDEND_POLICY.distributionRate * SUPUESTOS_CAPITAL.dilucion).toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Cómo Funciona:</h3>
            <ul className="space-y-2 text-sm text-titanium-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Años 1-2:</strong> Todo el FCF se reinvierte en el negocio para financiar expansión inicial</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Año 3+:</strong> Se distribuye 50% del FCF disponible a todos los accionistas proporcionalmente</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Inversionistas reciben:</strong> {(DIVIDEND_POLICY.distributionRate * SUPUESTOS_CAPITAL.dilucion).toFixed(1)}% del FCF ({SUPUESTOS_CAPITAL.dilucion}% de equity × {(DIVIDEND_POLICY.distributionRate * 100).toFixed(0)}% distribución)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Fundadores reciben:</strong> {(DIVIDEND_POLICY.distributionRate * (100 - SUPUESTOS_CAPITAL.dilucion)).toFixed(1)}% del FCF ({100 - SUPUESTOS_CAPITAL.dilucion}% de equity × {(DIVIDEND_POLICY.distributionRate * 100).toFixed(0)}% distribución)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Dividendos Año 6:</strong> {formatCurrency(EXIT_SCENARIO_6.dividendsReceived)} acumulados (años 3-6)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Dividendos Año 10:</strong> {formatCurrency(EXIT_SCENARIO_10.dividendsReceived)} acumulados (años 3-10)</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Beneficio Clave:</strong> Esta política permite a los inversionistas recuperar capital gradualmente
              mientras el negocio opera, generando flujo de caja positivo incluso antes del exit. El 50% restante del FCF se retiene como
              cash en la empresa, disponible para buffer operativo, oportunidades de expansión, o pagos adicionales de deuda si fuera necesario.
              Este cash acumulado se incluye en el valor total al momento del exit.
            </p>
          </div>
        </motion.div>

        {/* ========== DESGLOSE DE FLUJOS: DISTRIBUCIÓN VS RETENCIÓN ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="card-premium bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-2 border-indigo-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-white">Desglose de Flujos de Caja - Distribución vs Retención</h2>
          </div>

          <p className="text-titanium-400 mb-4">
            Análisis detallado año por año de cómo se distribuye el FCF: 50% para accionistas (dividendos) y 50% retenido como cash en balance.
          </p>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Aclaración: Retenido ≠ Reinvertido
            </h4>
            <div className="space-y-2 text-sm text-titanium-300">
              <p>
                <strong className="text-white">Reinversión en CAPEX:</strong> Ya está capturada en la columna "Inversión Tiendas" del P&L.
                Se resta del Net Income ANTES de llegar al FCF Distribuible. Por ejemplo, Año 3 invierte $2.5M en tiendas orgánicas.
              </p>
              <p>
                <strong className="text-white">Cash Retenido:</strong> Es el 50% del FCF que NO se distribuye como dividendo.
                Este cash se queda en el balance de la empresa como reserva/buffer operativo. NO se reinvierte en CAPEX específico,
                simplemente aumenta el cash disponible en la empresa.
              </p>
              <p className="text-amber-300">
                <strong>En el exit:</strong> Exit Value + Cash Acumulado = Total Value. El cash retenido suma valor directo a la transacción.
              </p>
            </div>
          </div>

          {/* Tabla Detallada */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900/50">
                  <th className="px-4 py-3 text-left text-titanium-400">Año</th>
                  <th className="px-4 py-3 text-right text-cyan-400 font-semibold">FCF Distribuible</th>
                  <th className="px-4 py-3 text-right text-emerald-400 font-semibold">Distribuido 50%</th>
                  <th className="px-4 py-3 text-right text-purple-400 font-semibold">Inversionistas ({SUPUESTOS_CAPITAL.dilucion}%)</th>
                  <th className="px-4 py-3 text-right text-blue-400 font-semibold">Fundadores ({100 - SUPUESTOS_CAPITAL.dilucion}%)</th>
                  <th className="px-4 py-3 text-right text-amber-400 font-semibold">Retenido 50%</th>
                  <th className="px-4 py-3 text-right text-orange-400 font-semibold">Cash Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {PROYECCION_10_ANOS.map((row, idx) => {
                  const isDistributing = row.year >= DIVIDEND_POLICY.startYear
                  const distributed = isDistributing ? row.distribuible * DIVIDEND_POLICY.distributionRate : 0
                  const investorShare = distributed * (SUPUESTOS_CAPITAL.dilucion / 100)
                  const founderShare = distributed * ((100 - SUPUESTOS_CAPITAL.dilucion) / 100)
                  const retained = isDistributing ? row.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : row.distribuible
                  const cashAccumulated = PROYECCION_10_ANOS.slice(0, idx + 1).reduce((sum, y) => {
                    const isD = y.year >= DIVIDEND_POLICY.startYear
                    return sum + (isD ? y.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : y.distribuible)
                  }, 0)

                  return (
                    <tr key={row.year} className={`border-t border-titanium-800 hover:bg-navy-800/30 ${row.year === 6 || row.year === 10 ? 'bg-indigo-500/10 font-semibold' : ''}`}>
                      <td className="px-4 py-3 text-white font-semibold">
                        Año {row.year}
                        {row.year === 6 && <span className="ml-2 text-xs text-purple-400">(Exit Target)</span>}
                        {row.year === 10 && <span className="ml-2 text-xs text-amber-400">(Exit Alt.)</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-cyan-400 font-semibold">${row.distribuible.toFixed(2)}M</td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-semibold">
                        {isDistributing ? `$${distributed.toFixed(2)}M` : '$0.00M'}
                      </td>
                      <td className="px-4 py-3 text-right text-purple-400 font-semibold">
                        {isDistributing ? `$${investorShare.toFixed(2)}M` : '$0.00M'}
                      </td>
                      <td className="px-4 py-3 text-right text-blue-400 font-semibold">
                        {isDistributing ? `$${founderShare.toFixed(2)}M` : '$0.00M'}
                      </td>
                      <td className="px-4 py-3 text-right text-amber-400 font-semibold">${retained.toFixed(2)}M</td>
                      <td className="px-4 py-3 text-right text-orange-400 font-bold">${cashAccumulated.toFixed(2)}M</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen Visual - Año 6 y Año 10 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Resumen Año 6 */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Acumulado al Año 6</h3>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                  EXIT TARGET
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-navy-800/50 rounded-lg p-4">
                  <p className="text-xs text-titanium-400 mb-1">Total FCF Generado (Años 1-6)</p>
                  <p className="text-2xl font-bold text-white">
                    ${PROYECCION_10_ANOS.slice(0, 6).reduce((sum, y) => sum + y.distribuible, 0).toFixed(2)}M
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
                    <p className="text-xs text-titanium-400 mb-1">Distribuido (50%)</p>
                    <p className="text-lg font-bold text-emerald-400">
                      ${PROYECCION_10_ANOS.slice(0, 6).reduce((sum, y) => {
                        const isD = y.year >= DIVIDEND_POLICY.startYear
                        return sum + (isD ? y.distribuible * DIVIDEND_POLICY.distributionRate : 0)
                      }, 0).toFixed(2)}M
                    </p>
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                    <p className="text-xs text-titanium-400 mb-1">Retenido (50%)</p>
                    <p className="text-lg font-bold text-amber-400">
                      ${PROYECCION_10_ANOS.slice(0, 6).reduce((sum, y) => {
                        const isD = y.year >= DIVIDEND_POLICY.startYear
                        return sum + (isD ? y.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : y.distribuible)
                      }, 0).toFixed(2)}M
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-titanium-400">Dividendos Inversionistas:</span>
                    <span className="text-lg font-bold text-purple-400">${EXIT_SCENARIO_6.dividendsReceived.toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-titanium-400">Cash en Empresa:</span>
                    <span className="text-lg font-bold text-orange-400">${EXIT_SCENARIO_6.cashAccumulated.toFixed(2)}M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen Año 10 */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Acumulado al Año 10</h3>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold">
                  EXIT ALT.
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-navy-800/50 rounded-lg p-4">
                  <p className="text-xs text-titanium-400 mb-1">Total FCF Generado (Años 1-10)</p>
                  <p className="text-2xl font-bold text-white">
                    ${PROYECCION_10_ANOS.slice(0, 10).reduce((sum, y) => sum + y.distribuible, 0).toFixed(2)}M
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
                    <p className="text-xs text-titanium-400 mb-1">Distribuido (50%)</p>
                    <p className="text-lg font-bold text-emerald-400">
                      ${PROYECCION_10_ANOS.slice(0, 10).reduce((sum, y) => {
                        const isD = y.year >= DIVIDEND_POLICY.startYear
                        return sum + (isD ? y.distribuible * DIVIDEND_POLICY.distributionRate : 0)
                      }, 0).toFixed(2)}M
                    </p>
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                    <p className="text-xs text-titanium-400 mb-1">Retenido (50%)</p>
                    <p className="text-lg font-bold text-amber-400">
                      ${PROYECCION_10_ANOS.slice(0, 10).reduce((sum, y) => {
                        const isD = y.year >= DIVIDEND_POLICY.startYear
                        return sum + (isD ? y.distribuible * (1 - DIVIDEND_POLICY.distributionRate) : y.distribuible)
                      }, 0).toFixed(2)}M
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-titanium-400">Dividendos Inversionistas:</span>
                    <span className="text-lg font-bold text-purple-400">${EXIT_SCENARIO_10.dividendsReceived.toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-titanium-400">Cash en Empresa:</span>
                    <span className="text-lg font-bold text-orange-400">${EXIT_SCENARIO_10.cashAccumulated.toFixed(2)}M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota Explicativa */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white mb-2">Interpretación de los Flujos:</h4>
            <ul className="space-y-2 text-sm text-titanium-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">▸</span>
                <span><strong className="text-white">FCF Distribuible:</strong> Net Income - Pago Deuda - Inversión Tiendas. Las reinversiones en CAPEX YA fueron restadas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">▸</span>
                <span><strong className="text-white">Distribuido (50%):</strong> Cash pagado como dividendos a inversionistas ({SUPUESTOS_CAPITAL.dilucion}%) y fundadores ({100 - SUPUESTOS_CAPITAL.dilucion}%) proporcionalmente.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">▸</span>
                <span><strong className="text-white">Retenido (50%):</strong> Cash que permanece en el balance de la empresa como reserva/buffer. NO se reinvierte en CAPEX adicional (esas inversiones ya fueron contabilizadas).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">▸</span>
                <span><strong className="text-white">Cash Acumulado:</strong> Suma de todo el cash retenido desde año 1. En un exit: Exit Value + Cash Acumulado = Total Value para accionistas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">▸</span>
                <span><strong className="text-white">Años 1-2:</strong> 100% del FCF se retiene (no hay distribución, por eso retenido ≠ distribuido en el total). A partir del año 3 inicia la política 50/50.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* ========== COMPARATIVA DE VALUACIONES ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Comparativa de Valuaciones: DCF vs Venture Capital</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* DCF Valuation */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Valuación DCF</h3>
                  <p className="text-xs text-titanium-400">Valor Intrínseco Hoy</p>
                </div>
              </div>

              <p className="text-4xl font-bold text-white mb-4">{formatCurrency(DCF_VALUATION.equityValueDCF)}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-titanium-400">PV Cash Flows (10 años):</span>
                  <span className="text-white font-semibold">{formatCurrency(DCF_VALUATION.pvCashFlows10Years)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Terminal Value (PV):</span>
                  <span className="text-white font-semibold">{formatCurrency(DCF_VALUATION.terminalValuePV)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Enterprise Value:</span>
                  <span className="text-white font-semibold">{formatCurrency(DCF_VALUATION.enterpriseValue)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-cyan-500/20">
                  <span className="text-titanium-400">- Deuda Neta:</span>
                  <span className="text-red-400 font-semibold">-{formatCurrency(DCF_VALUATION.deudaNeta)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-cyan-500/30">
                  <span className="text-white">Equity Value:</span>
                  <span className="text-cyan-400">{formatCurrency(DCF_VALUATION.equityValueDCF)}</span>
                </div>
              </div>

              <div className="mt-4 bg-cyan-500/10 rounded-lg p-3 text-xs text-titanium-300">
                <strong className="text-white">Método:</strong> DCF con WACC 20%, perpetuidad 3%
              </div>
            </div>

            {/* Venture Capital Valuation */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-2 border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Valuación VC</h3>
                  <p className="text-xs text-titanium-400">Múltiplos de Mercado</p>
                </div>
              </div>

              <p className="text-4xl font-bold text-white mb-4">{formatCurrency(VENTURE_CAPITAL_VALUATION.valuationYear6)}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-titanium-400">Revenue Año 6:</span>
                  <span className="text-white font-semibold">{formatCurrency(VENTURE_CAPITAL_VALUATION.year6Revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Múltiplo Aplicado:</span>
                  <span className="text-white font-semibold">{VENTURE_CAPITAL_VALUATION.multiploVentas}X</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">EBITDA Neto Año 6:</span>
                  <span className="text-white font-semibold">{formatCurrency(PROYECCION_10_ANOS[5].ebitdaNeto)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">EBITDA Neto Margin:</span>
                  <span className="text-emerald-400 font-semibold">~15.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Fee Operadora (8%):</span>
                  <span className="text-red-400 font-semibold">{formatCurrency(PROYECCION_10_ANOS[5].feeOperadora)}</span>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t border-emerald-500/30">
                  <span className="text-white">Valuación Año 6:</span>
                  <span className="text-emerald-400">{formatCurrency(VENTURE_CAPITAL_VALUATION.valuationYear6)}</span>
                </div>
              </div>

              <div className="mt-4 bg-emerald-500/10 rounded-lg p-3 text-xs text-titanium-300">
                <strong className="text-white">Método:</strong> {VENTURE_CAPITAL_VALUATION.multiploVentas}X Revenue (conservador para retail specialty). EBITDA Neto ~15.5% después de fee operadora 8%.
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Nota:</strong> DCF refleja el valor intrínseco presente del negocio.
              La valuación VC refleja el valor de mercado al momento del exit usando múltiplos conservadores.
              La diferencia muestra el potencial de creación de valor en 6 años.
            </p>
          </div>
        </motion.div>

        {/* ========== TABLA DCF DETALLADA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Tabla DCF Detallada - Flujos Descontados (10 Años)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900/50">
                  <th className="px-4 py-3 text-left text-titanium-400">Año</th>
                  <th className="px-4 py-3 text-right text-titanium-400">FCF (M)</th>
                  <th className="px-4 py-3 text-right text-titanium-400">PV Factor (20%)</th>
                  <th className="px-4 py-3 text-right text-emerald-400 font-semibold">Valor Presente (M)</th>
                </tr>
              </thead>
              <tbody>
                {DCF_DETAIL.map((row) => (
                  <tr key={row.year} className="border-t border-titanium-800 hover:bg-navy-800/30">
                    <td className="px-4 py-3 text-white font-semibold">Año {row.year}</td>
                    <td className="px-4 py-3 text-right text-white">${row.fcf.toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right text-titanium-300">{row.pvFactor.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold">${row.pv.toFixed(2)}M</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-cyan-500/30 bg-cyan-500/10">
                  <td className="px-4 py-3 text-white font-bold" colSpan="3">Suma PV Flujos (Años 1-10)</td>
                  <td className="px-4 py-3 text-right text-cyan-400 font-bold">${DCF_VALUATION.pvCashFlows10Years.toFixed(2)}M</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {/* Terminal Value Calculation */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Cálculo Terminal Value</h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-titanium-400">FCF Año 10:</span>
                  <span className="text-white font-semibold">${DCF_VALUATION.year10FCF.toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Crecimiento Perpetuo:</span>
                  <span className="text-white font-semibold">{(DCF_VALUATION.perpetualGrowth * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">WACC:</span>
                  <span className="text-white font-semibold">{(DCF_VALUATION.wacc * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-purple-500/20">
                  <span className="text-titanium-400">Terminal Value Año 10:</span>
                  <span className="text-purple-400 font-bold">${DCF_VALUATION.terminalValue.toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Terminal Value (PV):</span>
                  <span className="text-emerald-400 font-bold">${DCF_VALUATION.terminalValuePV.toFixed(2)}M</span>
                </div>
              </div>

              <div className="mt-4 bg-purple-500/10 rounded-lg p-3 text-xs text-titanium-300">
                <strong className="text-white">Fórmula Gordon Growth:</strong><br/>
                TV = FCF<sub>año10</sub> × (1 + g) / (WACC - g)<br/>
                TV = ${DCF_VALUATION.year10FCF}M × 1.03 / (0.20 - 0.03) = ${DCF_VALUATION.terminalValue.toFixed(2)}M
              </div>
            </div>

            {/* Enterprise & Equity Value */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Valuación Total</h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-titanium-400">PV Flujos (1-10):</span>
                  <span className="text-white font-semibold">${DCF_VALUATION.pvCashFlows10Years.toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Terminal Value (PV):</span>
                  <span className="text-white font-semibold">${DCF_VALUATION.terminalValuePV.toFixed(2)}M</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-cyan-500/20">
                  <span className="text-white font-bold">Enterprise Value:</span>
                  <span className="text-cyan-400 font-bold">${DCF_VALUATION.enterpriseValue.toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">(-) Deuda Neta:</span>
                  <span className="text-red-400 font-semibold">${DCF_VALUATION.deudaNeta.toFixed(2)}M</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-emerald-500/30 bg-emerald-500/10 -mx-2 px-2 py-2 rounded">
                  <span className="text-white font-bold">Equity Value DCF:</span>
                  <span className="text-emerald-400 font-bold text-lg">${DCF_VALUATION.equityValueDCF.toFixed(2)}M</span>
                </div>
              </div>

              <div className="mt-4 bg-cyan-500/10 rounded-lg p-3 text-xs text-titanium-300">
                <strong className="text-white">Nota:</strong> Esta valuación representa el valor intrínseco del negocio hoy, descontando todos los flujos futuros al WACC de 20%. Los flujos incluyen EBITDA neto después del fee operadora 8% e impuestos 30%.
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white mb-3">Supuestos Clave del DCF:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-titanium-400 mb-1">WACC (Weighted Avg Cost of Capital)</p>
                <p className="text-white font-semibold">20%</p>
                <p className="text-xs text-titanium-500">Conservador para retail MX</p>
              </div>
              <div>
                <p className="text-titanium-400 mb-1">Crecimiento Perpetuo</p>
                <p className="text-white font-semibold">3%</p>
                <p className="text-xs text-titanium-500">Inflación de largo plazo</p>
              </div>
              <div>
                <p className="text-titanium-400 mb-1">FCF Base (post-fee, post-tax 30%)</p>
                <p className="text-white font-semibold">$4M - $12M</p>
                <p className="text-xs text-titanium-500">Años 1-10 (neto CAPEX + deuda)</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Investment Banking Perspective: ¿Por qué DCF ${DCF_VALUATION.equityValueDCF.toFixed(0)}M vs Exit ${VENTURE_CAPITAL_VALUATION.valuationYear6}M?
            </h4>
            <div className="space-y-2 text-sm text-titanium-300">
              <p>
                <strong className="text-white">DCF ({formatCurrency(DCF_VALUATION.equityValueDCF)}):</strong> Valor intrínseco PASIVO si mantienes el negocio operando a perpetuidad.
                Descuenta flujos al 20% WACC conservador. Años 1-6 tienen FCF bajo por inversión pesada ($12.5M CAPEX + $5M deuda).
              </p>
              <p>
                <strong className="text-white">VC Valuation ({formatCurrency(VENTURE_CAPITAL_VALUATION.valuationYear6)}):</strong> Valor de EXIT ACTIVO basado en múltiplos de mercado (2X revenue).
                Captura premium de transacción estratégica, brand value, y comparables del momento.
              </p>
              <p className="text-emerald-300">
                <strong>Este "gap" ({((VENTURE_CAPITAL_VALUATION.valuationYear6 / DCF_VALUATION.equityValueDCF) - 1).toFixed(1)}X) es NORMAL y SALUDABLE</strong> en deals de growth equity.
                Muestra potencial de creación de valor. Si DCF ≈ Exit → No hay upside. La diferencia valida la tesis de inversión.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========== COMPARATIVA ESCENARIOS DE EXIT ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Escenarios de Valor para el Inversionista</h2>
          <p className="text-titanium-400 mb-6">
            Proyecciones de retorno basadas en múltiplos conservadores de mercado (2X revenue). El equipo tiene experiencia ejecutando exits,
            pero estos escenarios son ilustrativos - el retorno principal proviene de dividendos recurrentes + upside del exit.
          </p>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Nota Importante:</strong> Los exits no son garantía. El equipo fundador tiene track record de exits exitosos
              en retail óptico, pero el timing y valuación final dependerán de condiciones de mercado. El foco del deal es generar
              <strong className="text-emerald-300"> cash flow recurrente vía dividendos</strong>, con el exit como upside adicional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Exit Año 6 */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-2 border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Exit Año 6</h3>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                  2X VENTAS
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-navy-800/50 rounded-lg p-4">
                  <p className="text-xs text-titanium-400 mb-1">Valuación del Negocio</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(EXIT_SCENARIO_6.exitValue)}</p>
                  <p className="text-xs text-titanium-500 mt-1">
                    {VENTURE_CAPITAL_VALUATION.multiploVentas}X × {formatCurrency(VENTURE_CAPITAL_VALUATION.year6Revenue)} revenue
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 bg-navy-800/30 rounded-lg">
                    <span className="text-titanium-400">Valor en Exit ({SUPUESTOS_CAPITAL.dilucion}%):</span>
                    <span className="text-white font-semibold">{formatCurrency(EXIT_SCENARIO_6.investorValue)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <span className="text-white font-semibold">+ Dividendos Años 3-6:</span>
                    <span className="text-purple-400 font-bold">{formatCurrency(EXIT_SCENARIO_6.dividendsReceived)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                    <span className="text-white font-bold">= Retorno Total:</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(EXIT_SCENARIO_6.totalReturn)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-navy-800/30 rounded-lg">
                    <span className="text-titanium-400">Valor para Fundadores ({100 - SUPUESTOS_CAPITAL.dilucion}%):</span>
                    <span className="text-white font-semibold">{formatCurrency(EXIT_SCENARIO_6.founderValue)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-500/20">
                  <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-titanium-400 mb-1">IRR</p>
                    <p className="text-2xl font-bold text-purple-300">{EXIT_SCENARIO_6.irr.toFixed(1)}%</p>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-titanium-400 mb-1">MOIC</p>
                    <p className="text-2xl font-bold text-purple-300">{EXIT_SCENARIO_6.moic.toFixed(2)}x</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exit Año 10 */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-2 border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Exit Año 10</h3>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold">
                  + DIVIDENDOS
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-navy-800/50 rounded-lg p-4">
                  <p className="text-xs text-titanium-400 mb-1">Valuación del Negocio</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(EXIT_SCENARIO_10.exitValue)}</p>
                  <p className="text-xs text-titanium-500 mt-1">
                    {VENTURE_CAPITAL_VALUATION.multiploVentas}X × {formatCurrency(VENTURE_CAPITAL_VALUATION.year6Revenue)} revenue
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 bg-navy-800/30 rounded-lg">
                    <span className="text-titanium-400">Valor en Exit ({SUPUESTOS_CAPITAL.dilucion}%):</span>
                    <span className="text-white font-semibold">{formatCurrency(EXIT_SCENARIO_10.investorValue)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                    <span className="text-white font-semibold">+ Dividendos Años 3-10:</span>
                    <span className="text-amber-400 font-bold">{formatCurrency(EXIT_SCENARIO_10.dividendsReceived)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                    <span className="text-white font-bold">= Retorno Total:</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(EXIT_SCENARIO_10.totalReturn)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-navy-800/30 rounded-lg">
                    <span className="text-titanium-400">Valor para Fundadores ({100 - SUPUESTOS_CAPITAL.dilucion}%):</span>
                    <span className="text-white font-semibold">{formatCurrency(EXIT_SCENARIO_10.founderValue)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-amber-500/20">
                  <div className="bg-amber-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-titanium-400 mb-1">IRR</p>
                    <p className="text-2xl font-bold text-amber-300">{EXIT_SCENARIO_10.irr.toFixed(1)}%</p>
                  </div>
                  <div className="bg-amber-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-titanium-400 mb-1">MOIC</p>
                    <p className="text-2xl font-bold text-amber-300">{EXIT_SCENARIO_10.moic.toFixed(2)}x</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-6 bg-gradient-to-r from-navy-800 to-navy-700 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Análisis Comparativo
            </h4>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-navy-900/50 rounded-lg p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">Diferencia IRR</p>
                <p className="text-2xl font-bold text-white">
                  {(EXIT_SCENARIO_6.irr - EXIT_SCENARIO_10.irr).toFixed(1)}%
                </p>
                <p className="text-xs text-titanium-500 mt-1">Año 6 vs Año 10</p>
              </div>
              <div className="bg-navy-900/50 rounded-lg p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">Cash Adicional Año 10</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(EXIT_SCENARIO_10.dividendsReceived)}
                </p>
                <p className="text-xs text-titanium-500 mt-1">Dividendos años 7-10</p>
              </div>
              <div className="bg-navy-900/50 rounded-lg p-4 text-center">
                <p className="text-xs text-titanium-400 mb-1">MOIC Superior</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {EXIT_SCENARIO_10.moic.toFixed(2)}x
                </p>
                <p className="text-xs text-titanium-500 mt-1">Año 10 strategy</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-titanium-300">
                <strong className="text-white">Conclusión:</strong> Exit Año 6 ofrece mayor IRR ({EXIT_SCENARIO_6.irr.toFixed(1)}% vs {EXIT_SCENARIO_10.irr.toFixed(1)}%)
                mientras que operación hasta Año 10 maximiza MOIC ({EXIT_SCENARIO_10.moic.toFixed(2)}x vs {EXIT_SCENARIO_6.moic.toFixed(2)}x) gracias a
                {formatCurrency(EXIT_SCENARIO_10.dividendsReceived)} en dividendos. La decisión dependerá del perfil de liquidez del inversionista.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========== PROYECCIÓN FINANCIERA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Proyección Financiera 10 Años</h2>

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
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
                dataKey="ebitdaNeto"
                name="EBITDA Neto (post-fee)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="feeOperadora"
                name="Fee Operadora 8%"
                fill="#ef4444"
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

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-white font-semibold mb-2">Año 6 (Exit Point)</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-titanium-400">Revenue</p>
                  <p className="text-white font-bold">{formatCurrency(PROYECCION_10_ANOS[5].revenue)}</p>
                </div>
                <div>
                  <p className="text-titanium-400">EBITDA Neto</p>
                  <p className="text-emerald-400 font-bold">{formatCurrency(PROYECCION_10_ANOS[5].ebitdaNeto)}</p>
                </div>
                <div>
                  <p className="text-titanium-400">Tiendas</p>
                  <p className="text-white font-bold">{PROYECCION_10_ANOS[5].tiendas}</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-sm text-white font-semibold mb-2">Año 10 (Operación Extendida)</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-titanium-400">Revenue</p>
                  <p className="text-white font-bold">{formatCurrency(PROYECCION_10_ANOS[9].revenue)}</p>
                </div>
                <div>
                  <p className="text-titanium-400">EBITDA Neto</p>
                  <p className="text-emerald-400 font-bold">{formatCurrency(PROYECCION_10_ANOS[9].ebitdaNeto)}</p>
                </div>
                <div>
                  <p className="text-titanium-400">FCF Acum</p>
                  <p className="text-amber-400 font-bold">{formatCurrency(PROYECCION_10_ANOS.slice(6, 10).reduce((sum, y) => sum + y.distribuible, 0))}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== SUPUESTOS OPERATIVOS DETALLADOS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium bg-gradient-to-br from-blue-500/5 to-purple-500/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Supuestos Operativos Detallados</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Por Tienda */}
            <div className="bg-navy-800/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-cyan-400" />
                Métricas por Tienda (Steady State)
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-navy-900/50 rounded-lg">
                  <span className="text-titanium-400">Revenue Anual:</span>
                  <span className="text-white font-semibold">${SUPUESTOS_OPERATIVOS.perStore.revenue}M</span>
                </div>
                <div className="flex justify-between p-3 bg-navy-900/50 rounded-lg">
                  <span className="text-titanium-400">Empleados Promedio:</span>
                  <span className="text-white font-semibold">{SUPUESTOS_OPERATIVOS.perStore.employees}</span>
                </div>
                <div className="flex justify-between p-3 bg-navy-900/50 rounded-lg">
                  <span className="text-titanium-400">Renta Mensual:</span>
                  <span className="text-white font-semibold">${(SUPUESTOS_OPERATIVOS.perStore.rentMonthly / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between p-3 bg-navy-900/50 rounded-lg">
                  <span className="text-titanium-400">Renta Anual:</span>
                  <span className="text-white font-semibold">${SUPUESTOS_OPERATIVOS.perStore.rentAnnual}M</span>
                </div>
              </div>
            </div>

            {/* Salarios */}
            <div className="bg-navy-800/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Estructura Salarial
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-navy-900/50 rounded-lg">
                  <span className="text-titanium-400">Gerente (mensual):</span>
                  <span className="text-white font-semibold">${(SUPUESTOS_OPERATIVOS.salaries.gerente / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between p-3 bg-navy-900/50 rounded-lg">
                  <span className="text-titanium-400">Vendedor (mensual):</span>
                  <span className="text-white font-semibold">${(SUPUESTOS_OPERATIVOS.salaries.vendedor / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between p-3 bg-navy-900/50 rounded-lg">
                  <span className="text-titanium-400">Promedio Ponderado:</span>
                  <span className="text-white font-semibold">${(SUPUESTOS_OPERATIVOS.salaries.avgPerEmployee / 1000).toFixed(0)}K/mes</span>
                </div>
                <div className="flex justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <span className="text-white font-semibold">Costo Anual por Empleado:</span>
                  <span className="text-emerald-400 font-bold">${(SUPUESTOS_OPERATIVOS.salaries.avgPerEmployee * 12 / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          </div>

          {/* OpEx como % del Revenue */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">OpEx como % del Revenue (Benchmarks Retail México)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-navy-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-titanium-400">Marketing</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xs text-titanium-500 mb-2">Expansión (Años 1-3)</p>
                <p className="text-2xl font-bold text-purple-400">{(SUPUESTOS_OPERATIVOS.opexPercent.marketing.expansion * 100).toFixed(1)}%</p>
                <p className="text-xs text-titanium-500 mt-2">Madurez (Años 4+)</p>
                <p className="text-2xl font-bold text-purple-300">{(SUPUESTOS_OPERATIVOS.opexPercent.marketing.mature * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-titanium-400">Salarios</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-cyan-400 mt-4">{(SUPUESTOS_OPERATIVOS.opexPercent.salaries * 100).toFixed(1)}%</p>
                <p className="text-xs text-titanium-500 mt-2">Consistente todos los años</p>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-titanium-400">Renta</span>
                  <Store className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-emerald-400 mt-4">{(SUPUESTOS_OPERATIVOS.opexPercent.rent * 100).toFixed(1)}%</p>
                <p className="text-xs text-titanium-500 mt-2">Conservador vs benchmark 6-10%</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-navy-800/50 rounded-lg p-4">
                <p className="text-xs text-titanium-400 mb-2">Other OpEx (Utilities, Seguros, Mantenimiento)</p>
                <p className="text-xl font-bold text-amber-400">{(SUPUESTOS_OPERATIVOS.opexPercent.other * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-4">
                <p className="text-xs text-titanium-400 mb-2">Comisiones de Venta</p>
                <p className="text-xl font-bold text-emerald-400">{(SUPUESTOS_OPERATIVOS.opexPercent.comisiones * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Márgenes Target */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Márgenes Target</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              <div className="text-center">
                <p className="text-sm text-titanium-400 mb-2">Gross Margin</p>
                <p className="text-4xl font-bold text-white mb-1">{(SUPUESTOS_OPERATIVOS.margins.grossMargin * 100).toFixed(0)}%</p>
                <p className="text-xs text-titanium-500">Revenue - COGS</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-titanium-400 mb-2">EBITDA Bruto</p>
                <p className="text-4xl font-bold text-cyan-400 mb-1">{(SUPUESTOS_OPERATIVOS.margins.ebitdaBruto.expansion * 100).toFixed(1)}% - {(SUPUESTOS_OPERATIVOS.margins.ebitdaBruto.mature * 100).toFixed(1)}%</p>
                <p className="text-xs text-titanium-500">Expansión → Madurez</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-titanium-400 mb-2">EBITDA Neto</p>
                <p className="text-4xl font-bold text-emerald-400 mb-1">{(SUPUESTOS_OPERATIVOS.margins.ebitdaNeto.expansion * 100).toFixed(1)}% - {(SUPUESTOS_OPERATIVOS.margins.ebitdaNeto.mature * 100).toFixed(1)}%</p>
                <p className="text-xs text-titanium-500">Después de fee 8%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Nota Metodológica:</strong> Los % de OpEx están basados en benchmarks de retail specialty en México.
              Marketing más alto en expansión (8%) vs madurez (5%) refleja mayor inversión en brand awareness para nuevas ubicaciones.
              Total OpEx 43.5% (expansión) / 40.5% (madurez) incluyendo salarios 15%, renta 15%, comisiones 3%, y otros gastos operativos.
            </p>
          </div>
        </motion.div>

        {/* ========== PROYECCIONES P&L ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Proyecciones P&L (Profit & Loss) - 8 Años</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900/50">
                  <th className="px-4 py-3 text-left text-titanium-400">Año</th>
                  <th className="px-4 py-3 text-right text-titanium-400">Revenue</th>
                  <th className="px-4 py-3 text-right text-titanium-400">COGS</th>
                  <th className="px-4 py-3 text-right text-titanium-400">Gross Profit</th>
                  <th className="px-4 py-3 text-right text-titanium-400">Total OpEx</th>
                  <th className="px-4 py-3 text-right text-cyan-400 font-semibold">EBITDA Bruto</th>
                  <th className="px-4 py-3 text-right text-red-400 font-semibold">Fee Operadora</th>
                  <th className="px-4 py-3 text-right text-emerald-400 font-semibold">EBITDA Neto</th>
                  <th className="px-4 py-3 text-right text-orange-400 font-semibold">Interest</th>
                  <th className="px-4 py-3 text-right text-amber-400 font-semibold">Tax (30%)</th>
                  <th className="px-4 py-3 text-right text-purple-400 font-semibold">Net Income</th>
                  <th className="px-4 py-3 text-right text-red-400 font-semibold">Capital Payment</th>
                </tr>
              </thead>
              <tbody>
                {PL_PROYECCIONES.map((row) => (
                  <tr key={row.year} className="border-t border-titanium-800 hover:bg-navy-800/30">
                    <td className="px-4 py-3 text-white font-semibold">{row.year}</td>
                    <td className="px-4 py-3 text-right text-white">${row.revenue}M</td>
                    <td className="px-4 py-3 text-right text-red-400">${row.cogs}M</td>
                    <td className="px-4 py-3 text-right text-emerald-400">${row.gross_profit}M</td>
                    <td className="px-4 py-3 text-right text-titanium-300">${row.total_opex}M</td>
                    <td className="px-4 py-3 text-right text-cyan-400 font-semibold">${row.ebitdaBruto.toFixed(1)}M</td>
                    <td className="px-4 py-3 text-right text-red-400 font-semibold">${row.feeOperadora}M</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold">${row.ebitdaNeto.toFixed(1)}M</td>
                    <td className="px-4 py-3 text-right text-orange-400 font-semibold">${row.interestExpense.toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right text-amber-400 font-semibold">${row.taxes.toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right text-purple-400 font-semibold">${row.netIncome.toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right text-red-400 font-semibold">${row.capitalPayment.toFixed(2)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-3">Estructura de Márgenes:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-titanium-400">Gross Margin:</span>
                  <span className="text-white font-semibold">64%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">EBITDA Bruto:</span>
                  <span className="text-cyan-400 font-semibold">20.5% - 23.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">EBITDA Neto (post-fee 8%):</span>
                  <span className="text-emerald-400 font-semibold">12.5% - 15.5%</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-500/20">
                  <span className="text-titanium-400">Total OpEx:</span>
                  <span className="text-white font-semibold">40.5% - 43.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Pago de Capital - Deuda
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-titanium-400">Años 1-3:</span>
                  <span className="text-white font-semibold">$0 (solo interés)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Años 4-6:</span>
                  <span className="text-red-400 font-semibold">$1.67M/año</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-red-500/20">
                  <span className="text-white font-semibold">Total Pagado:</span>
                  <span className="text-red-400 font-bold">$5.0M</span>
                </div>
                <p className="text-titanium-400 pt-2">
                  El pago de capital NO afecta el P&L pero SÍ reduce el FCF disponible para distribución.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Fee Operadora (8% del Revenue):</strong> Cubre gestión profesional del portafolio de tiendas, incluyendo supervisión operativa, optimización de procesos, y reporting estratégico para inversionistas. Este fee alinea incentivos entre operadora e inversionistas.
            </p>
          </div>
        </motion.div>

        {/* ========== SEMÁFORO DE RIESGOS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Análisis de Riesgos y Fortalezas</h2>
          </div>

          <div className="space-y-4">
            {RISK_MATRIX.map((risk) => (
              <div
                key={risk.id}
                className={`rounded-xl p-6 border-2 ${
                  risk.color === 'blue'
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : risk.color === 'red'
                    ? 'bg-red-500/10 border-red-500/30'
                    : risk.color === 'yellow'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-4 h-4 rounded-full mt-1 ${
                      risk.color === 'blue'
                        ? 'bg-blue-500'
                        : risk.color === 'red'
                        ? 'bg-red-500'
                        : risk.color === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {risk.isPositive && <Users className="w-5 h-5 text-blue-400" />}
                      <h3 className="text-lg font-bold text-white">{risk.riesgo}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          risk.color === 'blue'
                            ? 'bg-blue-500/20 text-blue-300'
                            : risk.color === 'red'
                            ? 'bg-red-500/20 text-red-300'
                            : risk.color === 'yellow'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}
                      >
                        {risk.nivel}
                      </span>
                    </div>
                    <p className="text-sm text-titanium-400 mb-3">
                      <strong className="text-white">Impacto:</strong> {risk.impacto}
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-white mb-2">
                        {risk.isPositive ? 'Ventajas Competitivas:' : 'Mitigación:'}
                      </p>
                      <ul className="space-y-1">
                        {risk.mitigacion.map((item, idx) => (
                          <li key={idx} className="text-sm text-titanium-300 flex items-start gap-2">
                            <span className={risk.isPositive ? 'text-blue-400 mt-0.5' : 'text-emerald-400 mt-0.5'}>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ========== CONCLUSIÓN FINAL ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-premium bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-2 border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Conclusión - Investment Banking Recommendation</h2>
          </div>

          <div className="space-y-4 text-sm text-titanium-300">
            <p>
              <strong className="text-white">Estructura Óptima:</strong> La combinación de ${SUPUESTOS_CAPITAL.equity}M equity + ${SUPUESTOS_CAPITAL.deuda}M deuda por {SUPUESTOS_CAPITAL.dilucion}%
              del negocio (post-money ${SUPUESTOS_CAPITAL.postMoneyValuation}M) permite financiar la expansión inicial de 13 tiendas nuevas en 24 meses,
              manteniendo dilución controlada para fundadores (retienen {100 - SUPUESTOS_CAPITAL.dilucion}%).
            </p>

            <p>
              <strong className="text-white">Valuación del Negocio:</strong> DCF intrínseco de {formatCurrency(DCF_VALUATION.equityValueDCF)} hoy,
              con potencial de {formatCurrency(VENTURE_CAPITAL_VALUATION.valuationYear6)} en año 6 usando múltiplos conservadores de {VENTURE_CAPITAL_VALUATION.multiploVentas}X revenue.
              El negocio genera {formatCurrency(PROYECCION_10_ANOS[5].ebitdaNeto)} EBITDA neto anual (margen ~15.5%) después del fee operadora 8% del revenue e impuestos 30%.
            </p>

            <p>
              <strong className="text-white">Estructura de Fees:</strong> La operadora cobra 8% del revenue ({formatCurrency(PROYECCION_10_ANOS[5].feeOperadora)} en año 6)
              por gestión profesional del portafolio, optimización operativa y reporting. Los inversionistas reciben EBITDA neto de ~15.5% post-fee,
              alineando incentivos entre todas las partes.
            </p>

            <p>
              <strong className="text-white">Política de Dividendos:</strong> A partir del año 3, se distribuye 50% del FCF disponible a todos los accionistas,
              permitiendo a inversionistas recuperar capital gradualmente ({formatCurrency(EXIT_SCENARIO_6.dividendsReceived)} años 3-6,
              {formatCurrency(EXIT_SCENARIO_10.dividendsReceived)} años 3-10) mientras el 50% restante se retiene como cash en la empresa para buffer operativo y oportunidades de expansión.
            </p>

            <p>
              <strong className="text-white">Retornos Proyectados:</strong> Dividendos recurrentes generan {formatCurrency(EXIT_SCENARIO_6.dividendsReceived)} cash años 3-6.
              Escenario exit año 6 (ilustrativo, no garantizado) proyecta {EXIT_SCENARIO_6.irr.toFixed(1)}% IRR total. El equipo tiene experiencia ejecutando
              exits pero timing dependerá de condiciones de mercado. <strong className="text-emerald-300">El retorno principal es cash flow operativo recurrente,
              con exit como upside adicional.</strong>
            </p>

            <p>
              <strong className="text-white">Crecimiento Orgánico:</strong> El modelo demuestra capacidad de autofinanciar
              5 tiendas adicionales (1 en año 3, 2 en años 4 y 5) con FCF, alcanzando 18 tiendas totales sin necesidad de más capital externo.
              Esto valida la rentabilidad y escalabilidad del concepto.
            </p>

            <p>
              <strong className="text-white">Factor Diferenciador:</strong> El equipo fundador cuenta con track record probado y exits exitosos
              previos en la categoría, reduciendo significativamente el riesgo de ejecución y aumentando la probabilidad de alcanzar las proyecciones.
            </p>

            <p>
              <strong className="text-white">Siguiente Paso:</strong> <span className="text-emerald-400 font-semibold text-lg">REUNIÓN CON FUNDADORES + TERM SHEET</span>
            </p>

            <p className="mt-4 text-sm">
              Esta oportunidad combina un <strong className="text-white">equipo probado con exits previos</strong>, un
              <strong className="text-white"> modelo operativo rentable validado</strong> (márgenes superiores al mercado), y
              <strong className="text-white"> dividendos recurrentes desde año 3</strong> como retorno principal.
            </p>

            <ul className="space-y-2 ml-6 mt-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Track Record:</strong> Fundadores con experiencia ejecutando exits en retail óptico y metodología validada de site selection</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Márgenes Superiores:</strong> EBITDA neto 15.5% vs 10-12% promedio retail specialty. AI optimiza operación continuamente</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Cash Flow Recurrente:</strong> Dividendos {(DIVIDEND_POLICY.distributionRate * 100).toFixed(0)}% FCF desde año 3. Proyección ${EXIT_SCENARIO_6.dividendsReceived.toFixed(1)}M acumulados años 3-6</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Expansión Inteligente:</strong> 13 tiendas + 5 orgánicas + 1 ecommerce. Crecimiento controlado basado en métricas claras</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Incentivos Alineados:</strong> {SUPUESTOS_CAPITAL.dilucion}% equity por ${SUPUESTOS_CAPITAL.equity}M. Fee operadora 8% alinea intereses. Fundadores retienen {100 - SUPUESTOS_CAPITAL.dilucion}%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Exit como Upside:</strong> Proyección ilustrativa {EXIT_SCENARIO_6.irr.toFixed(1)}% IRR total (dividendos + exit año 6), pero retorno principal es cash flow operativo</span>
              </li>
            </ul>

            <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <p className="text-sm text-white font-semibold mb-2">Próximos Pasos Sugeridos:</p>
              <ol className="text-sm text-titanium-300 space-y-1 ml-4">
                <li>1. Reunión con equipo fundador (presentación track record + métricas actuales)</li>
                <li>2. Site visit a tiendas existentes (validar modelo operativo)</li>
                <li>3. Due diligence financiera (auditoría P&L últimos 3 años)</li>
                <li>4. Firma de term sheet (estructura {SUPUESTOS_CAPITAL.dilucion}% por ${SUPUESTOS_CAPITAL.equity}M equity + ${SUPUESTOS_CAPITAL.deuda}M deuda)</li>
              </ol>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-500/30 text-center">
            <p className="text-xs text-titanium-500">
              Análisis preparado con estándares Investment Banking | Todas las proyecciones sujetas a supuestos detallados
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InvestmentAnalysisV2
