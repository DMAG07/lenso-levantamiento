import { TrendingUp, DollarSign } from 'lucide-react'

function DCFValuationSummary({ dcfValuation }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="card-premium">
      <h3 className="text-2xl font-bold text-white mb-6">DCF Valuation (WACC 8%)</h3>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* PV of Cash Flows */}
        <div className="bg-navy-900/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <p className="text-sm text-titanium-400">PV Flujos 8 Años</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(dcfValuation.pvOfProjectedCashFlows)}
          </p>
        </div>

        {/* Terminal Value PV */}
        <div className="bg-navy-900/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-titanium-400">Terminal Value (PV)</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(dcfValuation.terminalValuePV)}
          </p>
          <p className="text-xs text-titanium-500 mt-1">
            Perpetuo 3%: {formatCurrency(dcfValuation.terminalValue)}
          </p>
        </div>

        {/* Enterprise Value */}
        <div className="bg-lenso-green-800/20 border border-lenso-green-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-lenso-green-800" />
            <p className="text-sm text-white font-semibold">Enterprise Value</p>
          </div>
          <p className="text-2xl font-bold text-lenso-green-800">
            {formatCurrency(dcfValuation.enterpriseValue)}
          </p>
        </div>
      </div>

      {/* Equity Value */}
      <div className="bg-gradient-to-r from-lenso-green-800 to-lenso-green-900 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Equity Value (DCF)</p>
            <p className="text-xs text-white/60">EV - Deuda Neta</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">
              {formatCurrency(dcfValuation.equityValue)}
            </p>
          </div>
        </div>
      </div>

      {/* DCF Cash Flows Detail (collapsed table) */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-semibold text-titanium-300 hover:text-white transition-colors">
          Ver flujos descontados por año →
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-titanium-700/30">
                <th className="text-left py-2 text-titanium-400">Año</th>
                <th className="text-right py-2 text-titanium-400">FCF</th>
                <th className="text-right py-2 text-titanium-400">Factor</th>
                <th className="text-right py-2 text-titanium-400">Valor Presente</th>
              </tr>
            </thead>
            <tbody>
              {dcfValuation.discountedCashFlows.map(cf => (
                <tr key={cf.year} className="border-b border-titanium-700/20">
                  <td className="py-2 text-white">{cf.year}</td>
                  <td className="text-right py-2 text-white">{formatCurrency(cf.fcf)}</td>
                  <td className="text-right py-2 text-titanium-400">{cf.discountFactor.toFixed(3)}</td>
                  <td className="text-right py-2 text-cyan-400 font-semibold">
                    {formatCurrency(cf.presentValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

export default DCFValuationSummary
