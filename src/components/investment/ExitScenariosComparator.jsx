import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Percent, Target } from 'lucide-react'

function ExitScenariosComparator({ exitScenarios, equityAllocations }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const year5 = {
    scenario: exitScenarios[0],
    equity: equityAllocations[0]
  }

  const year8 = {
    scenario: exitScenarios[1],
    equity: equityAllocations[1]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-premium bg-gradient-to-r from-lenso-green-800/20 to-lenso-green-900/20 border-lenso-green-800/30">
        <h3 className="text-2xl font-bold text-white mb-2">Escenarios de Exit - Investment Banker Analysis</h3>
        <p className="text-titanium-300">
          Comparación de exit en Año 5 vs operación continua hasta Año 8
        </p>
      </div>

      {/* Side by Side Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Year 5 Exit */}
        <ExitScenarioCard
          title="Exit Año 5"
          subtitle="Exit estratégico post-maduración"
          scenario={year5.scenario}
          equity={year5.equity}
          recommended={year5.equity.irr > 30} // IRR > 30% is excellent
          formatCurrency={formatCurrency}
          index={0}
        />

        {/* Year 8 Continue */}
        <ExitScenarioCard
          title="Operación Año 8"
          subtitle="Continuar operando + terminal value"
          scenario={year8.scenario}
          equity={year8.equity}
          recommended={year8.equity.irr > year5.equity.irr}
          formatCurrency={formatCurrency}
          index={1}
        />
      </div>

      {/* Recommendation */}
      <div className="card-premium">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-lenso-green-800" />
          Recomendación de Investment Banker
        </h4>

        <div className="space-y-4">
          {year8.equity.irr > year5.equity.irr ? (
            <>
              <div className="bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">
                  ✅ Recomendación: Operación Continua hasta Año 8
                </p>
                <p className="text-sm text-titanium-300">
                  El IRR de {year8.equity.irr.toFixed(1)}% en Año 8 supera el {year5.equity.irr.toFixed(1)}% del exit en Año 5.
                  El valor adicional generado justifica continuar la operación.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-navy-900/50 rounded-lg p-3">
                  <p className="text-titanium-400 mb-1">IRR Incremental</p>
                  <p className="text-xl font-bold text-emerald-400">
                    +{(year8.equity.irr - year5.equity.irr).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-3">
                  <p className="text-titanium-400 mb-1">Valor Adicional</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(year8.equity.valueAtExit - year5.equity.valueAtExit)}
                  </p>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-3">
                  <p className="text-titanium-400 mb-1">MOIC Mejorado</p>
                  <p className="text-xl font-bold text-cyan-400">
                    {year8.equity.moic.toFixed(2)}x
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">
                  ⚠️ Recomendación: Exit Estratégico en Año 5
                </p>
                <p className="text-sm text-titanium-300">
                  El IRR de {year5.equity.irr.toFixed(1)}% en Año 5 supera el del Año 8.
                  Considerar exit temprano para maximizar retornos anualizados.
                </p>
              </div>
            </>
          )}

          {/* Strategic Considerations */}
          <div className="pt-4 border-t border-titanium-700/30">
            <p className="text-sm font-semibold text-titanium-300 mb-3">Consideraciones Estratégicas:</p>
            <ul className="text-sm text-titanium-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-lenso-green-800 mt-0.5">•</span>
                <span>
                  <strong className="text-white">Liquidez de Mercado:</strong> Exits en retail requieren buyer con capacidad de {formatCurrency(Math.max(year5.scenario.recommendedValuation, year8.scenario.recommendedValuation))}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lenso-green-800 mt-0.5">•</span>
                <span>
                  <strong className="text-white">Timing de Mercado:</strong> Múltiplos de retail pueden variar ±20% según ciclo económico
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lenso-green-800 mt-0.5">•</span>
                <span>
                  <strong className="text-white">Riesgo de Ejecución:</strong> {year8.scenario.exitYear} años de operación exitosa vs {year5.scenario.exitYear} años
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lenso-green-800 mt-0.5">•</span>
                <span>
                  <strong className="text-white">Estructura de Exit:</strong> Considerar earn-out de 20-30% para maximizar valuación
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExitScenarioCard({ title, subtitle, scenario, equity, recommended, formatCurrency, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className={`card-premium relative ${
        recommended ? 'ring-2 ring-lenso-green-800' : ''
      }`}
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-lenso-green-800 text-white rounded-full text-xs font-semibold">
          Recomendado
        </div>
      )}

      {/* Header */}
      <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-titanium-400 mb-6">{subtitle}</p>

      {/* Valuation */}
      <div className="mb-6 p-4 bg-navy-900/50 rounded-xl">
        <p className="text-xs text-titanium-400 mb-2">Valuación {scenario.methodology}</p>
        <p className="text-3xl font-bold text-white mb-2">
          {formatCurrency(scenario.recommendedValuation)}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-titanium-400">Revenue Año {scenario.exitYear}</span>
          <span className="text-white font-semibold">{formatCurrency(scenario.revenue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-titanium-400">EBITDA Año {scenario.exitYear}</span>
          <span className="text-white font-semibold">{formatCurrency(scenario.ebitda)}</span>
        </div>
      </div>

      {/* Investor Returns */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-titanium-400" />
            <span className="text-sm text-titanium-400">Equity Allocation</span>
          </div>
          <span className="text-lg font-bold text-white">
            {equity.equityPercentage.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-titanium-400" />
            <span className="text-sm text-titanium-400">Valor para Inversionistas</span>
          </div>
          <span className="text-lg font-bold text-emerald-400">
            {formatCurrency(equity.valueAtExit)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-lenso-green-800/20 border border-lenso-green-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-lenso-green-800" />
            <span className="text-sm text-white font-semibold">IRR</span>
          </div>
          <span className="text-2xl font-bold text-lenso-green-800">
            {equity.irr.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-navy-900/50 rounded-lg">
          <span className="text-sm text-titanium-400">MOIC</span>
          <span className="text-lg font-bold text-cyan-400">
            {equity.moic.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Valuation Range */}
      <div className="mt-4 pt-4 border-t border-titanium-700/30">
        <p className="text-xs text-titanium-400 mb-2">Rango de Valuación</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-titanium-500">Revenue {scenario.revenueMultipleLow}x</span>
            <span className="text-white">{formatCurrency(scenario.revenueValuationLow)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-titanium-500">Revenue {scenario.revenueValuationHigh / scenario.revenue}x</span>
            <span className="text-white">{formatCurrency(scenario.revenueValuationHigh)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-titanium-500">EBITDA 8x</span>
            <span className="text-white">{formatCurrency(scenario.ebitdaValuation)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ExitScenariosComparator
