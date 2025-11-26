import { motion } from 'framer-motion'
import { Check, AlertCircle, TrendingUp, DollarSign } from 'lucide-react'

function CapitalOptionsComparator({ options, selectedOption, onSelect }) {
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
    <div className="grid md:grid-cols-2 gap-6">
      {Object.values(options).map((option, index) => (
        <CapitalOptionCard
          key={option.id}
          option={option}
          index={index}
          isSelected={selectedOption?.id === option.id}
          onSelect={() => onSelect(option)}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  )
}

function CapitalOptionCard({ option, index, isSelected, onSelect, formatCurrency }) {
  const getDilutionColor = (dilution) => {
    if (dilution.includes('Alta')) return 'text-red-400'
    if (dilution.includes('Media')) return 'text-amber-400'
    if (dilution.includes('Baja')) return 'text-emerald-400'
    return 'text-titanium-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`card-premium cursor-pointer relative ${
        isSelected ? 'ring-2 ring-lenso-green-800' : ''
      }`}
    >
      {/* Recommended Badge */}
      {option.recommended && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-lenso-green-800 text-white rounded-full text-xs font-semibold">
          Recomendada
        </div>
      )}

      {/* Header */}
      <h3 className="text-2xl font-bold text-white mb-4">{option.name}</h3>

      {/* Amount Breakdown */}
      <div className="bg-navy-900/50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-titanium-400">Total a Levantar</span>
          <span className="text-2xl font-bold text-white">{formatCurrency(option.amount)}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-titanium-400">Capital (Equity)</span>
            <span className="text-lenso-purple-500 font-semibold">
              {formatCurrency(option.structure.equity)}
            </span>
          </div>
          {option.structure.debt > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-titanium-400">Deuda</span>
              <span className="text-lenso-orange-500 font-semibold">
                {formatCurrency(option.structure.debt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics - Visual Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <p className="text-xs text-titanium-400">IRR</p>
          </div>
          <p className="text-xl font-bold text-emerald-400">
            {option.irr ? `${option.irr.toFixed(1)}%` : 'N/A'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-cyan-400" />
            <p className="text-xs text-titanium-400">MOIC</p>
          </div>
          <p className="text-xl font-bold text-cyan-400">
            {option.moic ? `${option.moic.toFixed(2)}x` : 'N/A'}
          </p>
        </div>
        <div className="bg-navy-900/50 border border-titanium-700/30 rounded-lg p-3">
          <p className="text-xs text-titanium-400 mb-1">Exit</p>
          <p className="text-xl font-bold text-white">
            {option.exitYear ? `Año ${option.exitYear}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Dilution & Payment */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-navy-900/50 rounded-lg p-3">
          <p className="text-xs text-titanium-400 mb-1">Dilución</p>
          <p className={`text-lg font-semibold ${getDilutionColor(option.dilution)}`}>
            {option.dilution}
          </p>
        </div>
        <div className="bg-navy-900/50 rounded-lg p-3">
          <p className="text-xs text-titanium-400 mb-1">Pago Mensual</p>
          <p className="text-lg font-semibold text-white">
            {option.monthlyPayment > 0 ? formatCurrency(option.monthlyPayment) : '$0'}
          </p>
        </div>
      </div>

      {/* Return Summary */}
      <div className="bg-gradient-to-r from-lenso-green-800/20 to-lenso-green-900/20 border border-lenso-green-800/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-lenso-green-800" />
          <p className="text-sm text-white font-semibold">Retornos Proyectados</p>
        </div>
        <p className="text-xs text-titanium-300 mb-2">{option.returnExpectation}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-titanium-400">Exit Año {option.exitYear || 6}</span>
          <span className="text-lenso-green-800 font-bold">MOIC {option.moic?.toFixed(2)}x</span>
        </div>
        {option.dividendPolicy && (
          <div className="mt-3 pt-3 border-t border-lenso-green-800/20">
            <p className="text-xs text-lenso-green-800 font-semibold mb-1">Política de Dividendos</p>
            <p className="text-xs text-titanium-300">{option.dividendPolicy}</p>
            {option.dividendsYear6 && (
              <p className="text-xs text-titanium-400 mt-1">
                Dividendos años 3-6: {formatCurrency(option.dividendsYear6)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Advantages */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-titanium-300 mb-3">Ventajas</p>
        <ul className="space-y-2">
          {option.advantages.map((advantage, idx) => (
            <li key={idx} className="text-xs text-titanium-400 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {advantage}
            </li>
          ))}
        </ul>
      </div>

      {/* Disadvantages */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-titanium-300 mb-3">Desventajas</p>
        <ul className="space-y-2">
          {option.disadvantages.map((disadvantage, idx) => (
            <li key={idx} className="text-xs text-titanium-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              {disadvantage}
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <button
        className={`w-full py-3 rounded-xl font-semibold transition-all ${
          isSelected
            ? 'bg-lenso-green-800 text-white'
            : 'bg-navy-900/50 text-titanium-300 hover:bg-navy-900'
        }`}
      >
        {isSelected ? 'Seleccionada' : 'Seleccionar'}
      </button>
    </motion.div>
  )
}

export default CapitalOptionsComparator
