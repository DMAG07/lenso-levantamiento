import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Store, Calendar, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, Area } from 'recharts'

function KeyMetricsVisual({ annualProjections, dcfValuation, year6Valuation, summary }) {
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

  // Prepare chart data for revenue and EBITDA growth
  const growthChartData = annualProjections.map(year => ({
    year: `Año ${year.year}`,
    yearNum: year.year,
    'Revenue': year.revenue / 1000000, // Convert to millions
    'EBITDA': year.ebitda / 1000000,
    'Tiendas': year.storesOpen
  }))

  // Valuation comparison data
  const valuationData = [
    {
      name: 'DCF Hoy',
      value: dcfValuation.equityValue / 1000000,
      fill: '#06b6d4' // cyan
    },
    {
      name: 'Año 6',
      value: year6Valuation.recommendedValuation / 1000000,
      fill: '#10b981' // emerald
    }
  ]

  return (
    <div className="space-y-6">
      {/* Hero Metrics - Big Numbers */}
      <div className="card-premium bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          📊 Valuación del Negocio Lenso
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* DCF Today */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/50 rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-titanium-400 mb-2">VALOR HOY (DCF)</p>
            <p className="text-5xl md:text-6xl font-bold text-white mb-2">
              {formatCurrency(dcfValuation.equityValue)}
            </p>
            <p className="text-sm text-titanium-500">
              {formatCurrencyFull(dcfValuation.equityValue)}
            </p>
            <div className="mt-4 pt-4 border-t border-cyan-500/30">
              <p className="text-xs text-titanium-400">Método: DCF con WACC 8%</p>
            </div>
          </motion.div>

          {/* Year 6 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/50 rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-titanium-400 mb-2">VALOR AÑO 6</p>
            <p className="text-5xl md:text-6xl font-bold text-white mb-2">
              {formatCurrency(year6Valuation.recommendedValuation)}
            </p>
            <p className="text-sm text-titanium-500">
              {formatCurrencyFull(year6Valuation.recommendedValuation)}
            </p>
            <div className="mt-4 pt-4 border-t border-emerald-500/30">
              <p className="text-xs text-titanium-400">Método: {year6Valuation.methodology}</p>
            </div>
          </motion.div>
        </div>

        {/* Growth Arrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-900/50 rounded-xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-2xl font-bold text-white">{formatCurrency(dcfValuation.equityValue)}</span>
            <ArrowRight className="w-8 h-8 text-titanium-500" />
            <span className="text-2xl font-bold text-emerald-400">{formatCurrency(year6Valuation.recommendedValuation)}</span>
          </div>
          <p className="text-sm text-titanium-400">Incremento en 6 años</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">
            +{(((year6Valuation.recommendedValuation / dcfValuation.equityValue) - 1) * 100).toFixed(1)}%
          </p>
        </motion.div>
      </div>

      {/* Valuation Bar Chart */}
      <div className="card-premium">
        <h3 className="text-xl font-bold text-white mb-4">Comparación Visual de Valuaciones</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={valuationData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <YAxis
              type="number"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              label={{ value: 'Millones MXN', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`${formatCurrency(value * 1000000)}`, 'Valuación']}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {valuationData.map((entry, index) => (
                <Bar key={`bar-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue & EBITDA Growth Chart */}
      <div className="card-premium">
        <h3 className="text-xl font-bold text-white mb-4">Crecimiento de Revenue y EBITDA (8 años)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={growthChartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              label={{ value: 'Millones MXN', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              label={{ value: 'Tiendas', angle: 90, position: 'insideRight', fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => {
                if (name === 'Tiendas') return [value, name]
                return [`${formatCurrency(value * 1000000)}`, name]
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Revenue"
              stroke="#3b82f6"
              fill="url(#revenueGradient)"
              strokeWidth={3}
            />
            <Bar
              yAxisId="left"
              dataKey="EBITDA"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Tiendas"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Year 6 Highlight */}
        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-titanium-400">Año 6 (Exit Point)</p>
              <p className="text-xl font-bold text-white">
                Revenue: {formatCurrency(year6Valuation.revenue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-titanium-400">EBITDA Año 6</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(year6Valuation.ebitda)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-titanium-400">Tiendas</p>
              <p className="text-xl font-bold text-white">
                {year6Valuation.storesOpen}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card-premium bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-6 h-6 text-purple-400" />
            <p className="text-sm text-titanium-400">Tiendas Año 6</p>
          </div>
          <p className="text-3xl font-bold text-white">{summary.year6StoreCount}</p>
          <p className="text-xs text-titanium-500 mt-1">
            {summary.initialFundedStores} financiadas + {summary.organicStoresOpened} orgánicas
          </p>
        </div>

        <div className="card-premium bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <p className="text-sm text-titanium-400">IRR Año 6</p>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{summary.year6IRR.toFixed(1)}%</p>
          <p className="text-xs text-titanium-500 mt-1">Retorno anualizado</p>
        </div>

        <div className="card-premium bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-amber-400" />
            <p className="text-sm text-titanium-400">MOIC</p>
          </div>
          <p className="text-3xl font-bold text-white">{summary.year6MOIC.toFixed(2)}x</p>
          <p className="text-xs text-titanium-500 mt-1">Multiple on Invested Capital</p>
        </div>

        <div className="card-premium bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <p className="text-sm text-titanium-400">Timeline</p>
          </div>
          <p className="text-3xl font-bold text-white">6 años</p>
          <p className="text-xs text-titanium-500 mt-1">Hasta exit potencial</p>
        </div>
      </div>
    </div>
  )
}

export default KeyMetricsVisual
