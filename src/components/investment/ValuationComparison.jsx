import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Calendar, Target, ArrowRight } from 'lucide-react'

function ValuationComparison({ dcfValuation, year6Valuation, year6EquityAllocation }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }

  const formatCurrencyFull = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`
  }

  // Calculate growth from DCF to Year 6
  const valuationGrowth = ((year6Valuation.recommendedValuation / dcfValuation.equityValue) - 1) * 100

  return (
    <div className="card-premium">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          Valuación del Negocio - Dos Perspectivas
        </h2>
        <p className="text-titanium-400">
          Comparación entre el valor presente (DCF) y el valor futuro (Exit Año 6)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* DCF Valuation TODAY */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="absolute -top-3 left-4 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-xs font-semibold text-cyan-400">
            VALOR HOY
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/30 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Valuación DCF</h3>
                <p className="text-xs text-titanium-400">Discounted Cash Flow</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-titanium-400 mb-2">Equity Value (Presente)</p>
              <p className="text-4xl font-bold text-white mb-1">
                {formatCurrency(dcfValuation.equityValue)}
              </p>
              <p className="text-xs text-titanium-500">
                {formatCurrencyFull(dcfValuation.equityValue)}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-titanium-400">Enterprise Value:</span>
                <span className="text-white font-semibold">{formatCurrency(dcfValuation.enterpriseValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-titanium-400">PV Cash Flows (8 años):</span>
                <span className="text-white font-semibold">{formatCurrency(dcfValuation.pvOfProjectedCashFlows)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-titanium-400">Terminal Value (PV):</span>
                <span className="text-white font-semibold">{formatCurrency(dcfValuation.terminalValuePV)}</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-cyan-500/20">
                <span className="text-titanium-400">Deuda Neta:</span>
                <span className="text-red-400 font-semibold">-{formatCurrency(dcfValuation.netDebt)}</span>
              </div>
            </div>

            <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <p className="text-xs font-semibold text-cyan-400">MÉTODO DE VALUACIÓN</p>
              </div>
              <p className="text-sm text-titanium-300">
                Flujos futuros descontados a valor presente con WACC 8%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Year 6 Exit Valuation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -top-3 left-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-xs font-semibold text-emerald-400">
            VALOR EN 6 AÑOS
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-2 border-emerald-500/30 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Exit Año 6</h3>
                <p className="text-xs text-titanium-400">Valuación con Múltiplos</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-titanium-400 mb-2">Valuación Proyectada</p>
              <p className="text-4xl font-bold text-white mb-1">
                {formatCurrency(year6Valuation.recommendedValuation)}
              </p>
              <p className="text-xs text-titanium-500">
                {formatCurrencyFull(year6Valuation.recommendedValuation)}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-titanium-400">Tiendas Operando:</span>
                <span className="text-white font-semibold">{year6Valuation.storesOpen}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-titanium-400">Revenue Año 6:</span>
                <span className="text-white font-semibold">{formatCurrency(year6Valuation.revenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-titanium-400">EBITDA Año 6:</span>
                <span className="text-white font-semibold">{formatCurrency(year6Valuation.ebitda)}</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-emerald-500/20">
                <span className="text-titanium-400">IRR Inversionista:</span>
                <span className="text-emerald-400 font-bold">{formatPercent(year6EquityAllocation.irr)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-titanium-400">MOIC:</span>
                <span className="text-emerald-400 font-bold">{year6EquityAllocation.moic.toFixed(2)}x</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-semibold text-emerald-400">MÉTODO DE VALUACIÓN</p>
              </div>
              <p className="text-sm text-titanium-300">
                {year6Valuation.methodology} - {year6Valuation.methodology === 'EBITDA Multiple' ? '8.0x EBITDA' : 'Revenue 1.5x-1.7x'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Growth Arrow & Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-navy-800 to-navy-700 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-titanium-400 mb-2">Crecimiento de Valuación (6 años)</p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <p className="text-2xl font-bold text-white">
                {formatCurrency(dcfValuation.equityValue)}
              </p>
              <ArrowRight className="w-6 h-6 text-titanium-500" />
              <p className="text-2xl font-bold text-emerald-400">
                {formatCurrency(year6Valuation.recommendedValuation)}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 bg-emerald-500/20 border border-emerald-500/50 rounded-xl px-6 py-4">
            <p className="text-sm text-titanium-400 mb-1 text-center">Incremento</p>
            <p className="text-3xl font-bold text-emerald-400 text-center">
              +{formatPercent(valuationGrowth)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-navy-900/50 rounded-xl p-4 text-center">
            <p className="text-xs text-titanium-400 mb-1">Equity Dilution</p>
            <p className="text-lg font-bold text-white">{formatPercent(year6EquityAllocation.equityPercentage)}</p>
          </div>
          <div className="bg-navy-900/50 rounded-xl p-4 text-center">
            <p className="text-xs text-titanium-400 mb-1">Founders Equity</p>
            <p className="text-lg font-bold text-white">{formatPercent(100 - year6EquityAllocation.equityPercentage)}</p>
          </div>
          <div className="bg-navy-900/50 rounded-xl p-4 text-center">
            <p className="text-xs text-titanium-400 mb-1">Value to Investors</p>
            <p className="text-lg font-bold text-emerald-400">{formatCurrency(year6EquityAllocation.valueAtExit)}</p>
          </div>
          <div className="bg-navy-900/50 rounded-xl p-4 text-center">
            <p className="text-xs text-titanium-400 mb-1">Tiendas Orgánicas</p>
            <p className="text-lg font-bold text-lenso-green-800">{year6Valuation.organicStores}</p>
          </div>
        </div>
      </motion.div>

      {/* Interpretation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-xl p-6"
      >
        <h4 className="text-lg font-bold text-white mb-3">📊 Interpretación</h4>
        <div className="space-y-2 text-sm text-titanium-300">
          <p>
            <strong className="text-white">Valor DCF Hoy:</strong> Representa el valor presente de todos los flujos futuros del negocio,
            descontados al 8% (WACC). Este es el valor "intrínseco" del negocio hoy basado en su capacidad de generar flujo.
          </p>
          <p>
            <strong className="text-white">Valor Año 6:</strong> Valuación proyectada usando múltiplos de mercado ({year6Valuation.methodology}).
            Este es el valor que un comprador estratégico pagaría por el negocio en el año 6, con {year6Valuation.storesOpen} tiendas
            operando y generando {formatCurrency(year6Valuation.ebitda)} de EBITDA.
          </p>
          <p>
            <strong className="text-white">Crecimiento:</strong> El negocio crece {formatPercent(valuationGrowth)} en 6 años,
            generando un IRR de {formatPercent(year6EquityAllocation.irr)} para inversionistas.
            Los fundadores retienen {formatPercent(100 - year6EquityAllocation.equityPercentage)} del equity.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ValuationComparison
