import { motion } from 'framer-motion'
import { Store, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts'

function OrganicGrowthTimeline({ annualProjections, openingSchedule, organicGrowthTimeline, summary }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }

  // Prepare data for chart
  const chartData = annualProjections.map(year => ({
    year: `Año ${year.year}`,
    'Tiendas Totales': year.storesOpen,
    'Tiendas Financiadas': year.fundedStores,
    'Tiendas Orgánicas': year.organicStores,
    revenue: year.revenue,
    ebitda: year.ebitda
  }))

  // Count organic stores by year
  const organicStoresByYear = [0, 0, 0, 0, 0, 0, 0, 0]
  organicGrowthTimeline.forEach(store => {
    if (store.year >= 1 && store.year <= 8) {
      organicStoresByYear[store.year - 1]++
    }
  })

  return (
    <div className="card-premium">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Cronograma de Crecimiento - Tiendas Financiadas vs Orgánicas
        </h2>
        <p className="text-titanium-400">
          Primeras {summary.initialFundedStores} tiendas financiadas con $30M, luego crecimiento orgánico con reinversión de flujo
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <p className="text-xs text-titanium-400">Tiendas Financiadas</p>
          </div>
          <p className="text-3xl font-bold text-white">{summary.initialFundedStores}</p>
          <p className="text-xs text-titanium-500 mt-1">Primeros 24 meses</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <p className="text-xs text-titanium-400">Tiendas Orgánicas</p>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{summary.organicStoresOpened}</p>
          <p className="text-xs text-titanium-500 mt-1">Años 3-8</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-5 h-5 text-purple-400" />
            <p className="text-xs text-titanium-400">Total Año 6</p>
          </div>
          <p className="text-3xl font-bold text-white">{summary.year6StoreCount}</p>
          <p className="text-xs text-titanium-500 mt-1">En operación</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <p className="text-xs text-titanium-400">Total Año 8</p>
          </div>
          <p className="text-3xl font-bold text-white">{summary.finalStoreCount}</p>
          <p className="text-xs text-titanium-500 mt-1">Máximo alcanzado</p>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Evolución de Tiendas por Año</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              label={{ value: 'Número de Tiendas', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => {
                if (name === 'revenue' || name === 'ebitda') {
                  return [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'EBITDA']
                }
                return [value, name]
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              dataKey="Tiendas Financiadas"
              stackId="a"
              fill="#3b82f6"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="Tiendas Orgánicas"
              stackId="a"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#fbbf24"
              fill="transparent"
              strokeWidth={2}
              dot={{ fill: '#fbbf24', r: 4 }}
              hide
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Phase Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Phase 1: Funded Growth */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Fase Financiada</h4>
              <p className="text-xs text-titanium-400">Meses 1-24</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">Tiendas a abrir:</span>
              <span className="text-white font-semibold">{summary.initialFundedStores - 2} nuevas + 2 existentes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">CAPEX Requerido:</span>
              <span className="text-white font-semibold">{formatCurrency(summary.totalCapexRequired)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">Financiamiento:</span>
              <span className="text-white font-semibold">{formatCurrency(summary.totalRaiseNeeded)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">Estructura:</span>
              <span className="text-white font-semibold">$24M Equity + $6M Deuda</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-500/20">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Estrategia:</strong> Apertura acelerada de {summary.initialFundedStores - 2} tiendas en 24 meses
              para establecer presencia de mercado y generar flujo de caja rápidamente.
            </p>
          </div>
        </div>

        {/* Phase 2: Organic Growth */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Fase Orgánica</h4>
              <p className="text-xs text-titanium-400">Años 3-8</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">Tiendas Orgánicas:</span>
              <span className="text-emerald-400 font-bold">{summary.organicStoresOpened}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">Financiamiento:</span>
              <span className="text-emerald-400 font-semibold">Free Cash Flow</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">Costo por tienda:</span>
              <span className="text-white font-semibold">$2.5M MXN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-titanium-400">Inicio reinversión:</span>
              <span className="text-white font-semibold">Mes 25</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-500/20">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Estrategia:</strong> Reinversión del flujo de caja libre para abrir
              tiendas adicionales sin necesidad de más capital externo. Crecimiento sostenible y autosuficiente.
            </p>
          </div>
        </div>
      </div>

      {/* Organic Stores by Year */}
      {summary.organicStoresOpened > 0 && (
        <div className="mt-6 bg-navy-800/50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Apertura de Tiendas Orgánicas por Año</h4>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {organicStoresByYear.map((count, index) => (
              <div key={index} className="text-center">
                <div className={`rounded-lg p-3 ${count > 0 ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-navy-900/50'}`}>
                  <p className="text-xs text-titanium-400 mb-1">Año {index + 1}</p>
                  <p className={`text-2xl font-bold ${count > 0 ? 'text-emerald-400' : 'text-titanium-600'}`}>
                    {count}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-titanium-400 mt-4 text-center">
            Total de {summary.organicStoresOpened} tiendas abiertas con reinversión de flujo
          </p>
        </div>
      )}

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-xl p-6"
      >
        <h4 className="text-lg font-bold text-white mb-3">💡 Insight Clave</h4>
        <p className="text-sm text-titanium-300">
          El modelo demuestra que después de la inversión inicial de $30M para abrir {summary.initialFundedStores} tiendas,
          el negocio genera suficiente flujo de caja para <strong className="text-white">autofinanciar la apertura de {summary.organicStoresOpened} tiendas
          adicionales</strong> en los siguientes {8 - Math.ceil(24/12)} años, alcanzando un total de <strong className="text-white">{summary.finalStoreCount} tiendas
          en operación</strong> sin necesidad de más capital externo. Esto valida la rentabilidad del modelo y su capacidad de escalamiento sostenible.
        </p>
      </motion.div>
    </div>
  )
}

export default OrganicGrowthTimeline
