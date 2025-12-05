import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Calendar, DollarSign, AlertCircle } from 'lucide-react'

function TimelineVisual({ timeline }) {
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
      <h3 className="text-2xl font-bold text-white mb-6">Fases del Proyecto</h3>

      <div className="space-y-8">
        {timeline.map((phase, index) => (
          <TimelinePhase
            key={phase.phase}
            phase={phase}
            index={index}
            isLast={index === timeline.length - 1}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
    </div>
  )
}

function TimelinePhase({ phase, index, isLast, formatCurrency }) {
  const phaseColors = [
    { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    { bg: 'from-cyan-500 to-blue-500', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400', border: 'border-purple-500/30' }
  ]

  const colors = phaseColors[index] || phaseColors[0]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Phase Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">{phase.phase}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h4 className="text-xl font-bold text-white">{phase.name}</h4>
              {phase.subtitle && (
                <p className="text-sm text-titanium-400">{phase.subtitle}</p>
              )}
            </div>
            {phase.targetDate && (
              <span className={`text-sm font-semibold ${colors.text} bg-navy-800/50 px-3 py-1 rounded-full flex items-center gap-1`}>
                <Calendar className="w-3 h-3" />
                {phase.targetDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fee Information */}
      {phase.fee && (
        <div className="ml-16 mb-4">
          <div className={`bg-navy-800/50 border ${colors.border} rounded-lg p-3`}>
            <p className="text-xs text-titanium-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Pagos en esta fase
            </p>
            <div className="space-y-2">
              {phase.fee.start && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-titanium-400">{phase.fee.start.moment}</span>
                  <span className={`font-semibold ${colors.text}`}>
                    {phase.fee.start.percentage} ({formatCurrency(phase.fee.start.amount)})
                  </span>
                </div>
              )}
              {phase.fee.milestone && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-titanium-400">{phase.fee.milestone.moment}</span>
                  <span className={`font-semibold ${colors.text}`}>
                    {phase.fee.milestone.percentage} ({formatCurrency(phase.fee.milestone.amount)})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activities */}
      <div className="ml-16 mb-4">
        <p className="text-sm font-semibold text-titanium-300 mb-3">Actividades</p>
        <ul className="space-y-2">
          {phase.activities.map((activity, idx) => (
            <li key={idx} className="text-sm text-titanium-400 flex items-start gap-2">
              <Circle className="w-4 h-4 text-titanium-600 flex-shrink-0 mt-0.5" />
              {activity}
            </li>
          ))}
        </ul>
      </div>

      {/* Deliverables */}
      <div className="ml-16">
        <p className="text-sm font-semibold text-titanium-300 mb-3">Entregables</p>
        <div className="flex flex-wrap gap-2">
          {phase.deliverables.map((deliverable, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1.5 bg-navy-800/50 border border-titanium-700/30 rounded-lg text-titanium-300 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {deliverable}
            </span>
          ))}
        </div>
      </div>

      {/* Phase Note */}
      {phase.note && (
        <div className="ml-16 mt-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-titanium-300">{phase.note}</p>
          </div>
        </div>
      )}

      {/* Connector Line */}
      {!isLast && (
        <div className={`absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b ${colors.bg} opacity-30`} />
      )}
    </motion.div>
  )
}

export default TimelineVisual
