import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

function TimelineVisual({ timeline }) {
  return (
    <div className="card-premium">
      <h3 className="text-2xl font-bold text-white mb-6">Timeline de Implementación</h3>

      <div className="space-y-8">
        {timeline.map((phase, index) => (
          <TimelinePhase key={phase.phase} phase={phase} index={index} />
        ))}
      </div>

      {/* Total Duration */}
      <div className="mt-8 pt-6 border-t border-titanium-700/30">
        <div className="bg-lenso-green-800/10 border border-lenso-green-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-titanium-300">Duración Total Estimada</span>
            <span className="text-xl font-bold text-lenso-green-800">13-19 semanas</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelinePhase({ phase, index }) {
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lenso-green-800 to-lenso-green-900 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{phase.phase}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xl font-bold text-white">{phase.name}</h4>
            <span className="text-sm font-semibold text-lenso-green-800 bg-lenso-green-800/20 px-3 py-1 rounded-full">
              {phase.duration}
            </span>
          </div>
        </div>
      </div>

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
        <ul className="space-y-2">
          {phase.deliverables.map((deliverable, idx) => (
            <li key={idx} className="text-sm text-titanium-400 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {deliverable}
            </li>
          ))}
        </ul>
      </div>

      {/* Connector Line */}
      {index < 3 && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-lenso-green-800/50 to-transparent" />
      )}
    </motion.div>
  )
}

export default TimelineVisual
