import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

function EquityAllocationChart({ equityAllocation }) {
  const { seed, seriesA, summary } = equityAllocation

  const data = [
    { name: 'Founders', value: summary.foundersEquity, color: '#275b35' },
    { name: 'Seed Investors', value: seed.equityPercentage, color: '#a85636' },
    { name: 'Series A Investors', value: seriesA.equityPercentage, color: '#81598b' }
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }

  return (
    <div className="card-premium">
      <h3 className="text-xl font-bold text-white mb-4">Estructura de Capital - Equity Allocation</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toFixed(2)}%`}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Seed */}
          <div className="bg-navy-900/50 rounded-lg p-4 border-l-4 border-lenso-orange-500">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lenso-orange-500">Seed Round</h4>
              <span className="text-2xl font-bold text-white">{seed.equityPercentage.toFixed(2)}%</span>
            </div>
            <div className="text-sm text-titanium-400 space-y-1">
              <p>Inversión: {formatCurrency(seed.investment)}</p>
              <p>Valor en Exit: {formatCurrency(seed.valueAtExit)}</p>
              <p>IRR: <span className="text-emerald-400 font-semibold">{seed.irr.toFixed(1)}%</span></p>
              <p>ROI: <span className="text-emerald-400 font-semibold">{seed.roi.toFixed(1)}%</span></p>
            </div>
          </div>

          {/* Series A */}
          <div className="bg-navy-900/50 rounded-lg p-4 border-l-4 border-lenso-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lenso-purple-500">Series A</h4>
              <span className="text-2xl font-bold text-white">{seriesA.equityPercentage.toFixed(2)}%</span>
            </div>
            <div className="text-sm text-titanium-400 space-y-1">
              <p>Inversión: {formatCurrency(seriesA.investment)}</p>
              <p>Valor en Exit: {formatCurrency(seriesA.valueAtExit)}</p>
              <p>IRR: <span className="text-emerald-400 font-semibold">{seriesA.irr.toFixed(1)}%</span></p>
              <p>ROI: <span className="text-emerald-400 font-semibold">{seriesA.roi.toFixed(1)}%</span></p>
            </div>
          </div>

          {/* Founders */}
          <div className="bg-navy-900/50 rounded-lg p-4 border-l-4 border-lenso-green-800">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lenso-green-800">Founders Equity</h4>
              <span className="text-2xl font-bold text-white">{summary.foundersEquity.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-titanium-700/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-titanium-400 uppercase mb-1">Total Inversión</p>
            <p className="text-lg font-bold text-white">{formatCurrency(summary.totalInvestment)}</p>
          </div>
          <div>
            <p className="text-xs text-titanium-400 uppercase mb-1">Valor en Exit</p>
            <p className="text-lg font-bold text-emerald-400">{formatCurrency(summary.totalValueAtExit)}</p>
          </div>
          <div>
            <p className="text-xs text-titanium-400 uppercase mb-1">Blended IRR</p>
            <p className="text-lg font-bold text-cyan-400">{summary.blendedIRR.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-titanium-400 uppercase mb-1">Multiple</p>
            <p className="text-lg font-bold text-white">
              {(summary.totalValueAtExit / summary.totalInvestment).toFixed(2)}x
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquityAllocationChart
