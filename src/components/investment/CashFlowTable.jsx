function CashFlowTable({ cashFlow }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <div className="card-premium">
      <h3 className="text-xl font-bold text-white mb-4">Análisis de Flujo de Efectivo</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-titanium-700/30">
              <th className="text-left py-3 px-4 text-titanium-300 font-semibold">Concepto</th>
              <th className="text-right py-3 px-4 text-titanium-300 font-semibold">Año 1</th>
              <th className="text-right py-3 px-4 text-titanium-300 font-semibold">Año 2</th>
              <th className="text-right py-3 px-4 text-titanium-300 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {/* Revenue */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 font-semibold">Ingresos</td>
              <td className="text-right py-3 px-4">{formatCurrency(cashFlow.year1.revenue)}</td>
              <td className="text-right py-3 px-4">{formatCurrency(cashFlow.year2.revenue)}</td>
              <td className="text-right py-3 px-4">{formatCurrency(cashFlow.cumulative.revenue)}</td>
            </tr>

            {/* Gross Profit */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4">
                Utilidad Bruta
                <span className="text-xs text-titanium-400 ml-2">
                  ({formatPercent(cashFlow.year1.grossMargin)})
                </span>
              </td>
              <td className="text-right py-3 px-4">{formatCurrency(cashFlow.year1.grossProfit)}</td>
              <td className="text-right py-3 px-4">{formatCurrency(cashFlow.year2.grossProfit)}</td>
              <td className="text-right py-3 px-4">
                {formatCurrency(cashFlow.year1.grossProfit + cashFlow.year2.grossProfit)}
              </td>
            </tr>

            {/* Operating Expenses */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-red-400">Gastos Operativos</td>
              <td className="text-right py-3 px-4 text-red-400">
                ({formatCurrency(cashFlow.year1.operatingExpenses)})
              </td>
              <td className="text-right py-3 px-4 text-red-400">
                ({formatCurrency(cashFlow.year2.operatingExpenses)})
              </td>
              <td className="text-right py-3 px-4 text-red-400">
                ({formatCurrency(cashFlow.year1.operatingExpenses + cashFlow.year2.operatingExpenses)})
              </td>
            </tr>

            {/* EBITDA */}
            <tr className="border-b border-titanium-700/20 bg-navy-900/50">
              <td className="py-3 px-4 font-semibold">
                EBITDA
                <span className="text-xs text-titanium-400 ml-2">
                  ({formatPercent(cashFlow.year1.ebitdaMargin)})
                </span>
              </td>
              <td className="text-right py-3 px-4 font-semibold text-emerald-400">
                {formatCurrency(cashFlow.year1.ebitda)}
              </td>
              <td className="text-right py-3 px-4 font-semibold text-emerald-400">
                {formatCurrency(cashFlow.year2.ebitda)}
              </td>
              <td className="text-right py-3 px-4 font-semibold text-emerald-400">
                {formatCurrency(cashFlow.cumulative.ebitda)}
              </td>
            </tr>

            {/* Debt Service */}
            <tr className="border-b border-titanium-700/20">
              <td className="py-3 px-4 text-amber-400">Servicio de Deuda</td>
              <td className="text-right py-3 px-4 text-amber-400">
                ({formatCurrency(cashFlow.year1.debtService)})
              </td>
              <td className="text-right py-3 px-4 text-amber-400">
                ({formatCurrency(cashFlow.year2.debtService)})
              </td>
              <td className="text-right py-3 px-4 text-amber-400">
                ({formatCurrency(cashFlow.year1.debtService + cashFlow.year2.debtService)})
              </td>
            </tr>

            {/* Free Cash Flow */}
            <tr className="bg-lenso-green-800/20">
              <td className="py-3 px-4 font-bold">Flujo de Efectivo Libre</td>
              <td className="text-right py-3 px-4 font-bold text-lenso-green-800">
                {formatCurrency(cashFlow.year1.cashFlow)}
              </td>
              <td className="text-right py-3 px-4 font-bold text-lenso-green-800">
                {formatCurrency(cashFlow.year2.cashFlow)}
              </td>
              <td className="text-right py-3 px-4 font-bold text-lenso-green-800">
                {formatCurrency(cashFlow.cumulative.cashFlow)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CashFlowTable
