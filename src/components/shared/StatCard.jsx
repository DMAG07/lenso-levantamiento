import { motion } from 'framer-motion'

function StatCard({ icon: Icon, label, value, gradient, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-premium"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
                         flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-titanium-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-white truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-titanium-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
