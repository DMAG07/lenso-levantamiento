import { motion } from 'framer-motion'
import { Store, Calendar, DollarSign } from 'lucide-react'

function StoreOpeningSchedule({ schedule, totalStores }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const totalCapex = schedule.reduce((sum, s) => sum + s.capex, 0)
  const maxStores = Math.max(...schedule.map(s => s.stores))

  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Cronograma de Aperturas</h3>
          <p className="text-sm text-titanium-400">
            {schedule.length} tiendas nuevas en {schedule[schedule.length - 1].month} meses
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-titanium-400 mb-1">CAPEX Total</p>
          <p className="text-xl font-bold text-white">{formatCurrency(totalCapex)}</p>
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-3 mb-6">
        {schedule.map((period, index) => (
          <motion.div
            key={period.month}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4"
          >
            {/* Month */}
            <div className="w-20 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-titanium-400" />
                <span className="text-sm text-white font-semibold">Mes {period.month}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-12 bg-navy-900/50 rounded-lg overflow-hidden flex items-center px-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(period.stores / maxStores) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="h-8 bg-gradient-to-r from-lenso-green-800 to-lenso-green-900 rounded flex items-center justify-center min-w-[60px]"
              >
                <div className="flex items-center gap-2 px-3">
                  <Store className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">{period.stores}</span>
                </div>
              </motion.div>
            </div>

            {/* CAPEX */}
            <div className="w-32 flex-shrink-0 text-right">
              <div className="flex items-center justify-end gap-2">
                <DollarSign className="w-4 h-4 text-titanium-400" />
                <span className="text-sm text-white font-semibold">
                  {formatCurrency(period.capex)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-titanium-700/30">
        <div className="text-center">
          <p className="text-xs text-titanium-400 mb-1">Tiendas Nuevas</p>
          <p className="text-2xl font-bold text-white">{schedule.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-titanium-400 mb-1">Total Tiendas</p>
          <p className="text-2xl font-bold text-lenso-green-800">{totalStores}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-titanium-400 mb-1">CAPEX Promedio</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(totalCapex / schedule.length)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StoreOpeningSchedule
