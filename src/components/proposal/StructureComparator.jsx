import { motion } from 'framer-motion'
import { Check, X, Clock, DollarSign } from 'lucide-react'

function StructureComparator({ structures, selectedStructure, onSelect }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {Object.values(structures).map((structure, index) => (
        <StructureCard
          key={structure.id}
          structure={structure}
          index={index}
          isSelected={selectedStructure?.id === structure.id}
          onSelect={() => onSelect(structure)}
        />
      ))}
    </div>
  )
}

function StructureCard({ structure, index, isSelected, onSelect }) {
  const complexityColor = {
    'Baja': 'text-emerald-400',
    'Media-Alta': 'text-amber-400',
    'Alta': 'text-red-400'
  }

  const costColor = {
    'Bajo': 'text-emerald-400',
    'Medio': 'text-amber-400',
    'Alto': 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onSelect}
      className={`card-premium cursor-pointer relative overflow-hidden ${
        isSelected ? 'ring-2 ring-lenso-green-800' : ''
      }`}
    >
      {/* Recommended Badge */}
      {structure.recommended && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-lenso-green-800 text-white rounded-full text-xs font-semibold">
          Recomendada
        </div>
      )}

      {/* Icon & Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-6xl">{structure.icon}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">{structure.name}</h3>
          <p className="text-xs text-titanium-400">{structure.description}</p>
        </div>
      </div>

      {/* Metrics - Enhanced Visual */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <p className="text-xs text-titanium-400">Timeline</p>
          </div>
          <p className="text-sm font-bold text-white">{structure.timeline}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-purple-400" />
            <p className="text-xs text-titanium-400">Costo</p>
          </div>
          <p className={`text-sm font-bold ${costColor[structure.cost]}`}>
            {structure.cost}
          </p>
        </div>
        <div className="bg-navy-900/50 border border-titanium-700/30 rounded-lg p-3">
          <p className="text-xs text-titanium-400 mb-1">Legal</p>
          <p className={`text-sm font-bold ${complexityColor[structure.legalComplexity]}`}>
            {structure.legalComplexity}
          </p>
        </div>
      </div>

      {/* Advantages */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-titanium-300 mb-3">Ventajas</p>
        <ul className="space-y-2">
          {structure.advantages.slice(0, 3).map((advantage, idx) => (
            <li key={idx} className="text-xs text-titanium-400 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {advantage}
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

export default StructureComparator
