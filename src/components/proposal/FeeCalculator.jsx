import { motion } from 'framer-motion'
import { DollarSign, FileText, UserCheck, Briefcase } from 'lucide-react'

function FeeCalculator({ fees, capitalAmount }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const feeItems = [
    {
      key: 'structuring',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'placement',
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    },
    {
      key: 'finders',
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-500'
    }
  ]

  return (
    <div className="card-premium">
      <h3 className="text-2xl font-bold text-white mb-6">Estructura de Fees</h3>

      {/* Fee Breakdown */}
      <div className="space-y-4 mb-6">
        {feeItems.map((item, index) => {
          const feeData = fees.breakdown[item.key]
          const Icon = item.icon

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-navy-900/50 rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">
                      {item.key === 'structuring' && 'Fee de Estructuración'}
                      {item.key === 'placement' && 'Fee de Levantamiento y Cierre'}
                      {item.key === 'finders' && 'Finder\'s Fee'}
                    </h4>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(feeData.amount)}
                    </span>
                  </div>
                  <p className="text-sm text-titanium-400 mb-2">
                    {feeData.percentage.toFixed(2)}% del capital levantado
                  </p>
                  {item.key === 'structuring' && (
                    <p className="text-xs text-titanium-500">
                      Diseño de estructura legal, fiscal y corporativa óptima
                    </p>
                  )}
                  {item.key === 'placement' && (
                    <p className="text-xs text-titanium-500">
                      Búsqueda de inversionistas, negociación y cierre
                    </p>
                  )}
                  {item.key === 'finders' && (
                    <p className="text-xs text-titanium-500">
                      Compensación para quien atraiga al inversionista
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-lenso-green-800 to-lenso-green-900 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 mb-1">Total Fees</p>
            <p className="text-xs text-white/60">
              {fees.totalPercentage.toFixed(2)}% del capital levantado
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">
              {formatCurrency(fees.totalFees)}
            </p>
          </div>
        </div>
      </div>

      {/* Capital Amount Reference */}
      <div className="mt-4 p-4 bg-navy-900/30 rounded-lg border border-titanium-700/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-titanium-400">Capital a Levantar</span>
          <span className="text-white font-semibold">{formatCurrency(capitalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

export default FeeCalculator
