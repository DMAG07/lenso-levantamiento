import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  FileText,
  Users,
  ArrowRight,
  BarChart3,
  DollarSign,
  Target
} from 'lucide-react'

// Importar datos centralizados
import { BUSINESS_CONSTANTS } from '../utils/constants'
import {
  DCF_VALUATION,
  VENTURE_CAPITAL_VALUATION,
  EXIT_SCENARIO_6,
  PROYECCION_10_ANOS
} from '../utils/dcfCalculations'

function Home() {
  const navigate = useNavigate()

  // Métricas calculadas desde la fuente de verdad
  const year6Data = PROYECCION_10_ANOS[5]

  const modules = [
    {
      id: 'investment',
      title: 'Análisis de Inversión',
      description: 'Valuación profesional con DCF, proyecciones 10 años y análisis de retornos para inversionistas',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      path: '/investment-analysis',
      features: [
        `DCF Valuation: $${DCF_VALUATION.equityValueDCF.toFixed(2)}M equity value`,
        `Exit Año 6: IRR ${EXIT_SCENARIO_6.irr.toFixed(1)}%, MOIC ${EXIT_SCENARIO_6.moic.toFixed(2)}x`,
        `${BUSINESS_CONSTANTS.TARGET_STORES_TOTAL} tiendas (${BUSINESS_CONSTANTS.TARGET_STORES_FUNDED} financiadas + ${BUSINESS_CONSTANTS.TARGET_STORES_ORGANIC} orgánicas)`,
        `EBITDA Neto ${(BUSINESS_CONSTANTS.EBITDA_NETO_MATURE * 100).toFixed(1)}% (post-fee 8%)`,
        'Proyecciones P&L completas',
        'Comparativa DCF vs VC valuation'
      ],
      metrics: {
        revenue: `$${year6Data.revenue.toFixed(0)}M`,
        irr: `${EXIT_SCENARIO_6.irr.toFixed(1)}%`,
        stores: `${BUSINESS_CONSTANTS.TARGET_STORES_TOTAL}`
      },
      status: 'active'
    },
    {
      id: 'proposal',
      title: 'Propuesta de Servicio',
      description: 'Estructuras de inversión comparadas con retornos reales y fees transparentes',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-600',
      path: '/service-proposal',
      features: [
        'Opción Simple, Control y Fideicomiso',
        `$${BUSINESS_CONSTANTS.EQUITY_CAPITAL / 1000000}M capital + $${BUSINESS_CONSTANTS.DEBT_CAPITAL / 1000000}M deuda = $${BUSINESS_CONSTANTS.TOTAL_RAISE / 1000000}M`,
        `Dilución ${BUSINESS_CONSTANTS.DILUTION * 100}% para inversionistas`,
        `Retornos: ${EXIT_SCENARIO_6.irr.toFixed(1)}% IRR, MOIC ${EXIT_SCENARIO_6.moic.toFixed(2)}x`,
        `Fees totales ${(BUSINESS_CONSTANTS.FEES.TOTAL * 100).toFixed(2)}% del capital`,
        'Timeline 12-16 semanas'
      ],
      metrics: {
        capital: `$${BUSINESS_CONSTANTS.TOTAL_RAISE / 1000000}M`,
        dilution: `${BUSINESS_CONSTANTS.DILUTION * 100}%`,
        fees: `${(BUSINESS_CONSTANTS.FEES.TOTAL * 100).toFixed(2)}%`
      },
      status: 'active'
    },
    {
      id: 'investor',
      title: 'Investor Relations',
      description: 'Portal de seguimiento y comunicación con inversionistas',
      icon: Users,
      gradient: 'from-purple-500 to-pink-600',
      path: '/investor-relations',
      features: [
        'Dashboard de portafolio en tiempo real',
        'Reportes mensuales automáticos',
        'Documentos y comunicados oficiales',
        'Calendario de distribuciones',
        'Métricas de performance detalladas',
        'Comunicación directa con management'
      ],
      metrics: {
        investors: 'TBD',
        aum: 'TBD',
        reports: '12/año'
      },
      status: 'coming-soon'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Hero Header */}
      <div className="border-b border-titanium-700/30 bg-navy-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 bg-lenso-green-800/20 border border-lenso-green-800/30 rounded-full mb-4">
              <span className="text-lenso-green-800 text-sm font-semibold">Investment Banking Platform</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-titanium-300 bg-clip-text text-transparent">
              Lenso Capital Raise
            </h1>
            <p className="text-xl text-titanium-400 max-w-3xl mx-auto mb-8">
              Plataforma completa para estructuración, análisis y gestión del levantamiento de capital para expansión comercial
            </p>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">${BUSINESS_CONSTANTS.TOTAL_RAISE / 1000000}M</p>
              <p className="text-xs text-titanium-400">Capital Total</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{BUSINESS_CONSTANTS.TARGET_STORES_TOTAL}</p>
              <p className="text-xs text-titanium-400">Tiendas Target</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{EXIT_SCENARIO_6.irr.toFixed(1)}%</p>
              <p className="text-xs text-titanium-400">IRR Proyectado</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
              <BarChart3 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">${year6Data.revenue.toFixed(0)}M</p>
              <p className="text-xs text-titanium-400">Revenue Año 6</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Módulos Disponibles</h2>
          <p className="text-titanium-400">Selecciona un módulo para comenzar</p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ModuleCard({ module, index, navigate }) {
  const Icon = module.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card-premium relative overflow-hidden group"
    >
      {/* Gradient Overlay on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />

      {/* Status Badge */}
      {module.status === 'coming-soon' && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded-full text-xs font-semibold z-10">
          Próximamente
        </div>
      )}

      {/* Icon & Title */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{module.title}</h3>
          <p className="text-titanium-400 text-xs">{module.description}</p>
        </div>
      </div>

      {/* Metrics Pills */}
      {module.metrics && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(module.metrics).map(([key, value]) => (
            <div key={key} className="px-3 py-1 bg-navy-900/50 border border-titanium-700/30 rounded-full">
              <span className="text-xs font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Features List */}
      <ul className="space-y-2 mb-6">
        {module.features.map((feature, idx) => (
          <li key={idx} className="text-xs text-titanium-400 flex items-start gap-2">
            <span className={`flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${module.gradient} flex items-center justify-center mt-0.5`}>
              <span className="text-white text-[8px]">✓</span>
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => module.status === 'active' && navigate(module.path)}
        disabled={module.status === 'coming-soon'}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          module.status === 'active'
            ? `bg-gradient-to-r ${module.gradient} hover:shadow-lg hover:shadow-emerald-500/20 text-white`
            : 'bg-navy-900/50 text-titanium-500 cursor-not-allowed'
        }`}
      >
        {module.status === 'active' ? 'Abrir Módulo' : 'Próximamente'}
        {module.status === 'active' && <ArrowRight className="w-4 h-4" />}
      </button>
    </motion.div>
  )
}

export default Home
