import { motion } from 'framer-motion'

function AnnualProjectionsTable({ projections }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value)
  }

  const formatPercent = (value) => `${(value * 100).toFixed(1)}%`

  return (
    <div className="card-premium overflow-x-auto">
      <h3 className="text-2xl font-bold text-white mb-6">Proyecciones Financieras (8 Años)</h3>

      <div className="min-w-[1200px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-titanium-700/50">
              <th className="text-left py-3 px-4 text-titanium-300 font-semibold sticky left-0 bg-navy-800/95 z-10">
                Concepto
              </th>
              {projections.map(year => (
                <th key={year.year} className="text-right py-3 px-4 text-titanium-300 font-semibold">
                  Año {year.year}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-white">
            {/* Stores */}
            <tr className="border-b border-titanium-700/20 bg-navy-900/30">
              <td className="py-3 px-4 font-semibold sticky left-0 bg-navy-900/95 z-10">
                # Tiendas
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 font-semibold">
                  {year.storesOpen}
                </td>
              ))}
            </tr>

            {/* Revenue */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 font-semibold sticky left-0 bg-navy-800/95 z-10">
                Ingresos
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4">
                  {formatCurrency(year.revenue)}
                </td>
              ))}
            </tr>

            {/* COGS */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-red-400 sticky left-0 bg-navy-800/95 z-10">
                Costo de Ventas
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 text-red-400">
                  ({formatCurrency(year.cogs)})
                </td>
              ))}
            </tr>

            {/* Gross Profit */}
            <tr className="border-b border-titanium-700/20 bg-navy-900/30">
              <td className="py-3 px-4 font-semibold sticky left-0 bg-navy-900/95 z-10">
                Utilidad Bruta
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 font-semibold">
                  {formatCurrency(year.grossProfit)}
                  <span className="text-xs text-titanium-400 ml-2">
                    {formatPercent(year.grossMarginPct)}
                  </span>
                </td>
              ))}
            </tr>

            {/* OpEx */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-red-400 sticky left-0 bg-navy-800/95 z-10">
                Gastos Operativos
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 text-red-400">
                  ({formatCurrency(year.opex)})
                </td>
              ))}
            </tr>

            {/* EBITDA */}
            <tr className="border-b border-titanium-700/20 bg-emerald-500/10">
              <td className="py-3 px-4 font-bold text-emerald-400 sticky left-0 bg-emerald-900/20 z-10">
                EBITDA
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 font-bold text-emerald-400">
                  {formatCurrency(year.ebitda)}
                  <span className="text-xs text-emerald-300 ml-2">
                    {formatPercent(year.ebitdaMarginPct)}
                  </span>
                </td>
              ))}
            </tr>

            {/* D&A */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-amber-400 sticky left-0 bg-navy-800/95 z-10">
                Depreciación
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 text-amber-400">
                  ({formatCurrency(year.depreciation)})
                </td>
              ))}
            </tr>

            {/* EBIT */}
            <tr className="border-b border-titanium-700/20 bg-navy-900/30">
              <td className="py-3 px-4 font-semibold sticky left-0 bg-navy-900/95 z-10">
                EBIT
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 font-semibold">
                  {formatCurrency(year.ebit)}
                </td>
              ))}
            </tr>

            {/* Interest */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-red-400 sticky left-0 bg-navy-800/95 z-10">
                Intereses
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 text-red-400">
                  {year.interestExpense > 0 ? `(${formatCurrency(year.interestExpense)})` : '-'}
                </td>
              ))}
            </tr>

            {/* EBT */}
            <tr className="border-b border-titanium-700/20 bg-navy-900/30">
              <td className="py-3 px-4 font-semibold sticky left-0 bg-navy-900/95 z-10">
                EBT
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 font-semibold">
                  {formatCurrency(year.ebt)}
                </td>
              ))}
            </tr>

            {/* Taxes */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-red-400 sticky left-0 bg-navy-800/95 z-10">
                Impuestos (30%)
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 text-red-400">
                  {year.taxes > 0 ? `(${formatCurrency(year.taxes)})` : '-'}
                </td>
              ))}
            </tr>

            {/* Net Income */}
            <tr className="border-b-2 border-lenso-green-800/50 bg-lenso-green-800/10">
              <td className="py-3 px-4 font-bold text-lenso-green-800 sticky left-0 bg-lenso-green-900/20 z-10">
                Utilidad Neta
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 font-bold text-lenso-green-800">
                  {formatCurrency(year.netIncome)}
                  <span className="text-xs text-lenso-green-700 ml-2">
                    {formatPercent(year.netMarginPct)}
                  </span>
                </td>
              ))}
            </tr>

            {/* Spacer */}
            <tr><td colSpan={projections.length + 1} className="h-4"></td></tr>

            {/* Free Cash Flow Section */}
            <tr className="border-b border-titanium-700/20 bg-cyan-500/10">
              <td className="py-3 px-4 font-bold text-cyan-400 sticky left-0 bg-cyan-900/20 z-10">
                Free Cash Flow
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 font-bold text-cyan-400">
                  {formatCurrency(year.freeCashFlow)}
                </td>
              ))}
            </tr>

            {/* CAPEX */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-sm text-titanium-400 sticky left-0 bg-navy-800/95 z-10">
                CAPEX Total
              </td>
              {projections.map(year => (
                <td key={year.year} className="text-right py-3 px-4 text-sm text-titanium-400">
                  ({formatCurrency(year.totalCapex)})
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-titanium-700/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span className="text-titanium-400">EBITDA (35% target)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-lenso-green-800"></div>
          <span className="text-titanium-400">Utilidad Neta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-500"></div>
          <span className="text-titanium-400">Free Cash Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-titanium-400">Costos y Gastos</span>
        </div>
      </div>
    </div>
  )
}

export default AnnualProjectionsTable
