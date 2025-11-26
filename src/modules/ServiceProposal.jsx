import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Download,
  Building2,
  DollarSign,
  Clock,
  Target
} from 'lucide-react'

import StatCard from '../components/shared/StatCard'
import StructureComparator from '../components/proposal/StructureComparator'
import CapitalOptionsComparator from '../components/proposal/CapitalOptionsComparator'
import FeeCalculator from '../components/proposal/FeeCalculator'
import TimelineVisual from '../components/proposal/TimelineVisual'

import {
  CAPITAL_STRUCTURES,
  CAPITAL_OPTIONS,
  IMPLEMENTATION_TIMELINE,
  calculateFees
} from '../utils/proposalData'

function ServiceProposal() {
  const [selectedStructure, setSelectedStructure] = useState(CAPITAL_STRUCTURES.STRUCTURED)
  const [selectedCapitalOption, setSelectedCapitalOption] = useState(CAPITAL_OPTIONS.MIXED)
  const [showSummary, setShowSummary] = useState(false)

  const fees = calculateFees(selectedCapitalOption.amount)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }

  const formatCurrencyFull = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-lg border-b border-titanium-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-titanium-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Propuesta de Servicio</h1>
                <p className="text-sm text-titanium-400">Estructuración de Levantamiento de Capital</p>
              </div>
            </div>
            <button
              onClick={() => setShowSummary(true)}
              className="btn-primary"
            >
              <FileText className="w-5 h-5" />
              Ver Resumen
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={DollarSign}
            label="Capital a Levantar"
            value={formatCurrency(selectedCapitalOption.amount)}
            gradient="from-emerald-500 to-teal-500"
          />
          <StatCard
            icon={Building2}
            label="Estructura"
            value={selectedStructure.name.replace('Estructura ', '')}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={FileText}
            label="Total Fees"
            value={formatCurrency(fees.totalFees)}
            gradient="from-purple-500 to-pink-500"
            subtitle={`${fees.totalPercentage.toFixed(2)}%`}
          />
          <StatCard
            icon={Clock}
            label="Timeline"
            value={selectedStructure.timeline}
            gradient="from-amber-500 to-orange-500"
          />
        </div>

        {/* Section 1: Capital Structure Selection */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">1. Selecciona tu Estructura</h2>
            <p className="text-titanium-400">
              Elige la estructura corporativa que mejor se adapte a tus necesidades y objetivos
            </p>
          </div>
          <StructureComparator
            structures={CAPITAL_STRUCTURES}
            selectedStructure={selectedStructure}
            onSelect={setSelectedStructure}
          />

          {/* Selected Structure Details */}
          {selectedStructure && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 card-premium"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Detalles de {selectedStructure.name}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Best For */}
                <div>
                  <p className="text-sm font-semibold text-titanium-300 mb-3">Ideal Para:</p>
                  <ul className="space-y-2">
                    {selectedStructure.bestFor.map((item, idx) => (
                      <li key={idx} className="text-sm text-titanium-400 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-lenso-green-800 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* All Advantages */}
                <div>
                  <p className="text-sm font-semibold text-titanium-300 mb-3">Todas las Ventajas:</p>
                  <ul className="space-y-2">
                    {selectedStructure.advantages.map((advantage, idx) => (
                      <li key={idx} className="text-sm text-titanium-400 flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Section 2: Capital Options */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">2. Opciones de Levantamiento</h2>
            <p className="text-titanium-400">
              Compara las opciones de financiamiento disponibles para tu expansión
            </p>
          </div>
          <CapitalOptionsComparator
            options={CAPITAL_OPTIONS}
            selectedOption={selectedCapitalOption}
            onSelect={setSelectedCapitalOption}
          />
        </div>

        {/* Section 3: Fees */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">3. Estructura de Fees</h2>
            <p className="text-titanium-400">
              Cálculo transparente de honorarios por servicios profesionales
            </p>
          </div>
          <FeeCalculator fees={fees} capitalAmount={selectedCapitalOption.amount} />
        </div>

        {/* Section 4: Timeline */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">4. Timeline de Implementación</h2>
            <p className="text-titanium-400">
              Proceso paso a paso desde la estructuración hasta el cierre
            </p>
          </div>
          <TimelineVisual timeline={IMPLEMENTATION_TIMELINE} />
        </div>

        {/* CTA Section */}
        <div className="card-premium bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-500/30">
          <div className="text-center">
            <Target className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Siguiente Paso: Term Sheet con Fundadores
            </h3>
            <p className="text-titanium-300 mb-6 max-w-2xl mx-auto">
              Este levantamiento combina un <strong className="text-white">equipo con track record probado</strong> en retail óptico,
              <strong className="text-white"> márgenes superiores al mercado</strong> (EBITDA neto 15.5% vs 10-12% promedio), y
              <strong className="text-white"> dividendos recurrentes desde año 3</strong> como retorno principal.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
              <div className="bg-navy-800/50 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-titanium-400 mb-1">Equipo Fundador</p>
                <p className="text-sm font-semibold text-white">Exits previos en retail</p>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-titanium-400 mb-1">EBITDA Neto</p>
                <p className="text-sm font-semibold text-white">15.5% (superior mercado)</p>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-titanium-400 mb-1">Dividendos</p>
                <p className="text-sm font-semibold text-white">50% FCF desde año 3</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowSummary(true)}
                className="btn-primary"
              >
                <FileText className="w-5 h-5" />
                Ver Propuesta Completa
              </button>
              <button className="btn-secondary">
                <Target className="w-5 h-5" />
                Reunión con Fundadores
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <ProposalSummary
          structure={selectedStructure}
          capitalOption={selectedCapitalOption}
          fees={fees}
          onClose={() => setShowSummary(false)}
          formatCurrency={formatCurrencyFull}
        />
      )}
    </div>
  )
}

// Proposal Summary Modal
function ProposalSummary({ structure, capitalOption, fees, onClose, formatCurrency }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-navy-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Propuesta de Servicio - Lenso
          </h2>
          <p className="text-titanium-400">Levantamiento de Capital para Expansión Comercial</p>
        </div>

        {/* Executive Summary */}
        <div className="mb-6 p-6 bg-navy-900/50 rounded-xl border border-titanium-700/30">
          <h3 className="text-xl font-bold text-white mb-4">Resumen Ejecutivo</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-titanium-400 mb-1">Capital a Levantar</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(capitalOption.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-titanium-400 mb-1">Total Fees</p>
              <p className="text-2xl font-bold text-lenso-green-800">
                {formatCurrency(fees.totalFees)}
                <span className="text-sm ml-2">({fees.totalPercentage.toFixed(2)}%)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Structure Details */}
        <div className="mb-6 p-6 bg-navy-900/50 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3">Estructura Recomendada</h3>
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">{structure.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{structure.name}</h4>
              <p className="text-sm text-titanium-400">{structure.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-navy-800/50 rounded-lg p-3">
              <p className="text-xs text-titanium-400 mb-1">Timeline</p>
              <p className="text-sm font-semibold text-white">{structure.timeline}</p>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-3">
              <p className="text-xs text-titanium-400 mb-1">Complejidad</p>
              <p className="text-sm font-semibold text-amber-400">{structure.legalComplexity}</p>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-3">
              <p className="text-xs text-titanium-400 mb-1">Costo</p>
              <p className="text-sm font-semibold text-white">{structure.cost}</p>
            </div>
          </div>
        </div>

        {/* Capital Structure */}
        <div className="mb-6 p-6 bg-navy-900/50 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3">Estructura de Capital</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg">
              <span className="text-titanium-300">Capital (Equity)</span>
              <span className="text-lg font-semibold text-white">
                {formatCurrency(capitalOption.structure.equity)}
              </span>
            </div>
            {capitalOption.structure.debt > 0 && (
              <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg">
                <span className="text-titanium-300">Deuda (16% anual)</span>
                <span className="text-lg font-semibold text-white">
                  {formatCurrency(capitalOption.structure.debt)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-lenso-green-800/20 border border-lenso-green-800/30 rounded-lg">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-lenso-green-800">
                {formatCurrency(capitalOption.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="mb-6 p-6 bg-navy-900/50 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3">Desglose de Fees</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-titanium-300">Fee de Estructuración (0.80%)</span>
              <span className="text-white font-semibold">
                {formatCurrency(fees.structuringFee)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-titanium-300">Fee de Levantamiento y Cierre (1.20%)</span>
              <span className="text-white font-semibold">
                {formatCurrency(fees.placementFee)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-titanium-300">Fee Legal (0.40%)</span>
              <span className="text-white font-semibold">
                {formatCurrency(fees.legalFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-titanium-700/30 flex items-center justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-2xl font-bold text-lenso-green-800">
                {formatCurrency(fees.totalFees)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-6 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Próximos Pasos hacia Term Sheet</h3>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-titanium-300">
              <strong className="text-white">Oportunidad Clave:</strong> Este deal combina track record probado (fundadores con exits previos),
              modelo validado (márgenes 15.5% vs 10-12% mercado), y cash flow recurrente (dividendos 50% FCF desde año 3).
              El exit es upside, no la promesa principal.
            </p>
          </div>

          <ol className="space-y-3">
            <li className="text-sm text-titanium-300 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">1.</span>
              <div>
                <strong className="text-white">Reunión con Fundadores</strong> (60 min)
                <p className="text-xs text-titanium-400 mt-1">Presentación track record, métricas actuales, metodología site selection</p>
              </div>
            </li>
            <li className="text-sm text-titanium-300 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">2.</span>
              <div>
                <strong className="text-white">Site Visit a Tiendas Existentes</strong> (medio día)
                <p className="text-xs text-titanium-400 mt-1">Validar modelo operativo, márgenes, y eficiencia con AI</p>
              </div>
            </li>
            <li className="text-sm text-titanium-300 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">3.</span>
              <div>
                <strong className="text-white">Due Diligence Financiera</strong> (1-2 semanas)
                <p className="text-xs text-titanium-400 mt-1">Auditoría P&L últimos 3 años, validar márgenes y proyecciones</p>
              </div>
            </li>
            <li className="text-sm text-titanium-300 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">4.</span>
              <div>
                <strong className="text-white">Firma de Term Sheet</strong> (1 semana)
                <p className="text-xs text-titanium-400 mt-1">Estructura: 25% equity por $25M + $5M deuda, dividendos 50% FCF desde año 3</p>
              </div>
            </li>
            <li className="text-sm text-titanium-300 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">5.</span>
              <div>
                <strong className="text-white">Legal Structuring & Closing</strong> (4-6 semanas)
                <p className="text-xs text-titanium-400 mt-1">Documentación legal, cierre, y transferencia de capital</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cerrar
          </button>
          <button className="btn-primary flex-1">
            <Download className="w-5 h-5" />
            Descargar PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ServiceProposal
