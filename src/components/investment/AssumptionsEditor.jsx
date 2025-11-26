import { motion } from 'framer-motion'
import { Edit2, Check, X } from 'lucide-react'

function AssumptionsEditor({ assumptions, onUpdate, editable = true }) {
  const formatPercent = (value) => `${(value * 100).toFixed(1)}%`
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const assumptionsSections = [
    {
      title: 'Tiendas y Expansión',
      items: [
        { key: 'currentStores', label: 'Tiendas Actuales', value: assumptions.currentStores, type: 'number' },
        { key: 'currentStoreRevenue', label: 'Revenue Actual por Tienda', value: formatCurrency(assumptions.currentStoreRevenue), type: 'currency' },
        { key: 'targetMonthlyRevenue', label: 'Revenue Objetivo por Tienda', value: formatCurrency(assumptions.targetMonthlyRevenue), type: 'currency' },
        { key: 'rampUpMonths', label: 'Meses de Ramp-Up', value: assumptions.rampUpMonths, type: 'number' },
        { key: 'costPerStore', label: 'Costo por Tienda', value: formatCurrency(assumptions.costPerStore), type: 'currency' }
      ]
    },
    {
      title: 'Márgenes y Rentabilidad',
      items: [
        { key: 'grossMargin', label: 'Margen Bruto', value: formatPercent(assumptions.grossMargin), type: 'percent', highlight: true },
        { key: 'operatingMargin', label: 'Margen Operativo (EBITDA)', value: formatPercent(assumptions.operatingMargin), type: 'percent', highlight: true },
        { key: 'taxRate', label: 'Tasa de Impuestos (ISR)', value: formatPercent(assumptions.taxRate), type: 'percent' }
      ]
    },
    {
      title: 'Crecimiento y Capital',
      items: [
        { key: 'sameStoreGrowth', label: 'Crecimiento Same-Store (anual)', value: formatPercent(assumptions.sameStoreGrowth), type: 'percent' },
        { key: 'capexMaintenance', label: 'CAPEX Mantenimiento (% revenue)', value: formatPercent(assumptions.capexMaintenance), type: 'percent' }
      ]
    },
    {
      title: 'Working Capital',
      items: [
        { key: 'inventoryDays', label: 'Días de Inventario', value: `${assumptions.inventoryDays} días`, type: 'days' },
        { key: 'receivablesDays', label: 'Días CxC', value: `${assumptions.receivablesDays} días`, type: 'days' },
        { key: 'payablesDays', label: 'Días CxP', value: `${assumptions.payablesDays} días`, type: 'days' }
      ]
    },
    {
      title: 'Estructura de Capital',
      items: [
        { key: 'totalRaise', label: 'Total a Levantar', value: formatCurrency(assumptions.totalRaise), type: 'currency', highlight: true },
        { key: 'equityRaise', label: 'Capital (Equity)', value: formatCurrency(assumptions.equityRaise), type: 'currency' },
        { key: 'debtRaise', label: 'Deuda', value: formatCurrency(assumptions.debtRaise), type: 'currency' },
        { key: 'debtRate', label: 'Tasa de Interés Deuda', value: formatPercent(assumptions.debtRate), type: 'percent' },
        { key: 'debtTerm', label: 'Plazo Deuda', value: `${assumptions.debtTerm} años`, type: 'years' }
      ]
    },
    {
      title: 'Valuación y Exit',
      items: [
        { key: 'safeDiscount', label: 'SAFE Discount', value: formatPercent(assumptions.safeDiscount), type: 'percent', highlight: true },
        { key: 'revenueMultipleLow', label: 'Revenue Multiple (bajo)', value: `${assumptions.revenueMultipleLow}x`, type: 'multiple' },
        { key: 'revenueMultipleHigh', label: 'Revenue Multiple (alto)', value: `${assumptions.revenueMultipleHigh}x`, type: 'multiple' },
        { key: 'ebitdaMultiple', label: 'EBITDA Multiple', value: `${assumptions.ebitdaMultiple}x`, type: 'multiple' }
      ]
    },
    {
      title: 'Parámetros DCF',
      items: [
        { key: 'discountRate', label: 'Tasa de Descuento (WACC)', value: formatPercent(assumptions.discountRate), type: 'percent', highlight: true },
        { key: 'terminalGrowthRate', label: 'Crecimiento Perpetuo', value: formatPercent(assumptions.terminalGrowthRate), type: 'percent' },
        { key: 'projectionYears', label: 'Años de Proyección', value: `${assumptions.projectionYears} años`, type: 'years' }
      ]
    }
  ]

  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Supuestos del Modelo</h3>
          <p className="text-sm text-titanium-400">
            Revisa y ajusta los supuestos para tu análisis
          </p>
        </div>
        {editable && (
          <button className="btn-secondary text-sm">
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        )}
      </div>

      <div className="space-y-6">
        {assumptionsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <h4 className="text-sm font-semibold text-titanium-300 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-lenso-green-800/20 text-lenso-green-800 flex items-center justify-center text-xs">
                {index + 1}
              </span>
              {section.title}
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className={`p-3 rounded-lg ${
                    item.highlight
                      ? 'bg-lenso-green-800/10 border border-lenso-green-800/30'
                      : 'bg-navy-900/50'
                  }`}
                >
                  <p className="text-xs text-titanium-400 mb-1">{item.label}</p>
                  <p className={`text-base font-semibold ${
                    item.highlight ? 'text-lenso-green-800' : 'text-white'
                  }`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="mt-6 p-4 bg-gradient-to-r from-lenso-green-800/20 to-lenso-green-900/20 border border-lenso-green-800/30 rounded-xl">
        <h4 className="text-sm font-semibold text-white mb-2">Notas Importantes</h4>
        <ul className="text-xs text-titanium-300 space-y-1">
          <li>• Margen operativo de 35% es objetivo post-maduración de tiendas</li>
          <li>• Same-store growth de 7% asume inflación + crecimiento orgánico</li>
          <li>• Tasa de descuento de 8% refleja riesgo de expansión retail</li>
          <li>• SAFE discount de 35% es estándar para early-stage con activos tangibles</li>
        </ul>
      </div>
    </div>
  )
}

export default AssumptionsEditor
