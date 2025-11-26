import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, TrendingUp, Shield, Target } from 'lucide-react'

function InvestmentBankerRecommendations({ analysis }) {
  const { summary, exitScenarios, equityAllocations } = analysis

  const bestExit = equityAllocations[0].irr > equityAllocations[1].irr ? exitScenarios[0] : exitScenarios[1]
  const bestEquity = equityAllocations[0].irr > equityAllocations[1].irr ? equityAllocations[0] : equityAllocations[1]

  const recommendations = [
    {
      category: 'Estructura de Capital',
      icon: Shield,
      level: 'positive',
      items: [
        {
          title: 'Estructura 70/30 (Equity/Debt) es óptima',
          description: `Minimiza dilución (${bestEquity.equityPercentage.toFixed(1)}% vs ~32% con 100% equity) mientras mantiene serviceable el costo de deuda.`,
          action: 'Proceder con $24M equity + $6M debt'
        },
        {
          title: 'SAFE Agreement con 35% discount es market standard',
          description: 'Para retail expansion con activos tangibles, 30-40% discount es normal. 35% está en el punto medio.',
          action: 'Usar 35% discount en term sheet'
        }
      ]
    },
    {
      category: 'Timing de Exit',
      icon: Target,
      level: bestExit.exitYear === 5 ? 'warning' : 'positive',
      items: [
        {
          title: bestExit.exitYear === 5 ? 'Exit temprano maximiza IRR anualizado' : 'Continuar operando genera más valor absoluto',
          description: `Año ${bestExit.exitYear} ofrece ${bestEquity.irr.toFixed(1)}% IRR vs ${bestExit.exitYear === 5 ? equityAllocations[1].irr.toFixed(1) : equityAllocations[0].irr.toFixed(1)}% en el escenario alternativo.`,
          action: `Target exit window: Año ${bestExit.exitYear - 1} a ${bestExit.exitYear + 1}`
        },
        {
          title: 'Opción de earn-out para cerrar valuation gap',
          description: 'Estructurar 70% cash upfront + 30% earn-out basado en EBITDA Year ${bestExit.exitYear + 1}',
          action: 'Incluir earn-out clause en SHA desde inicio'
        }
      ]
    },
    {
      category: 'Riesgos Clave',
      icon: AlertTriangle,
      level: 'warning',
      items: [
        {
          title: 'Ejecución de expansión',
          description: `${analysis.inputs.totalStores - 2} tiendas en ${analysis.inputs.openingMonths} meses es agresivo. Requiere team experimentado en real estate y ops.`,
          action: 'Contratar Head of Expansion antes de primer cierre'
        },
        {
          title: 'Riesgo de margen',
          description: 'Margen operativo de 35% depende de escala. Nuevas tiendas típicamente operan a 25-28% primeros 12 meses.',
          action: 'Bufferear proyecciones con margen conservador 30% Y1-Y2'
        },
        {
          title: 'Competencia y market saturation',
          description: 'Entrada de Warby Parker/Zenni a México podría comprimir márgenes 5-10% en markets maduros.',
          action: 'Diferenciación en producto premium + servicio personalizado'
        }
      ]
    },
    {
      category: 'Value Creation Opportunities',
      icon: TrendingUp,
      level: 'positive',
      items: [
        {
          title: 'Optimización de mix de producto',
          description: 'Lentes solares tienen típicamente 60%+ margen vs 45-50% ópticos. Shift de mix 40/60 a 50/50 puede agregar 2-3% EBITDA margin.',
          action: 'Analytic tracking de mix por tienda + incentivos a staff'
        },
        {
          title: 'Customer retention programs',
          description: 'Lifetime value de cliente recurrente es 3-4x vs one-time. Programa de membresía puede aumentar retention 40%+.',
          action: 'Lanzar Lenso Plus membership en Q2 post-raise'
        },
        {
          title: 'E-commerce complement (no cannibalization)',
          description: 'Online óptica crece 15-20% anual. Complementar con virtual try-on + home delivery.',
          action: 'Allocar 10% de equity raise a digital channel'
        }
      ]
    }
  ]

  const levelConfig = {
    positive: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
      title: 'text-emerald-300'
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      title: 'text-amber-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-premium bg-gradient-to-r from-lenso-green-800/20 to-lenso-green-900/20 border-lenso-green-800/30">
        <h3 className="text-2xl font-bold text-white mb-2">Investment Banker Recommendations</h3>
        <p className="text-titanium-300">
          Análisis profesional de estructura, timing y ejecución del levantamiento
        </p>
      </div>

      {/* Recommendations by Category */}
      {recommendations.map((category, index) => {
        const Icon = category.icon
        const config = levelConfig[category.level]

        return (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${config.icon}`} />
              </div>
              <h4 className={`text-xl font-bold ${config.title}`}>{category.category}</h4>
            </div>

            <div className="space-y-4">
              {category.items.map((item, idx) => (
                <div key={idx} className="pl-13">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-lenso-green-800 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-1">{item.title}</p>
                      <p className="text-sm text-titanium-400 mb-2">{item.description}</p>
                      <div className="bg-navy-900/50 rounded-lg p-3 border-l-2 border-lenso-green-800">
                        <p className="text-xs text-titanium-300">
                          <span className="font-semibold text-lenso-green-800">Acción:</span> {item.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      })}

      {/* Executive Summary */}
      <div className="card-premium bg-gradient-to-br from-lenso-green-800 to-lenso-green-900 text-white">
        <h4 className="text-xl font-bold mb-4">Executive Summary - Go/No-Go</h4>
        <div className="space-y-3">
          <p className="text-white/90">
            <strong>Recomendación:</strong> <span className="text-emerald-300 font-bold">PROCEDER CON LEVANTAMIENTO</span>
          </p>
          <p className="text-sm text-white/80">
            • Estructura $24M equity + $6M debt es óptima para minimizar dilución mientras mantiene flexibilidad<br/>
            • IRR proyectado de {bestEquity.irr.toFixed(1)}% excede benchmark de retail expansion (25-30%)<br/>
            • Riesgos de ejecución son manejables con hiring correcto y operational discipline<br/>
            • Exit path es claro: strategic buyer (óptica regional) o PE sponsor en Año {bestExit.exitYear}
          </p>
          <div className="pt-3 border-t border-white/20">
            <p className="text-xs text-white/60">
              Next Steps: (1) Finalizar term sheet con investors, (2) Contratar Head of Expansion, (3) Iniciar due diligence sites para primeras 3-4 tiendas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestmentBankerRecommendations
