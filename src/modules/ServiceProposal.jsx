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
  Target,
  Shield,
  ExternalLink
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
  FEES_SUMMARY,
  VALUE_GUARANTEE,
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

  const handleDownloadProposal = () => {
    window.open('/propuesta-lenso.html', '_blank')
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
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadProposal}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Descargar Propuesta</span>
              </button>
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
            value={selectedStructure.name.replace('Opción ', '')}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={FileText}
            label="Total Fees"
            value={formatCurrency(fees.totalFees)}
            gradient="from-purple-500 to-pink-500"
            subtitle={`${fees.totalPercentage.toFixed(0)}%`}
          />
          <StatCard
            icon={Clock}
            label="Fase 1 Target"
            value="Feb 2026"
            gradient="from-amber-500 to-orange-500"
          />
        </div>

        {/* Download Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Propuesta Comercial Disponible</p>
                <p className="text-sm text-titanium-400">Documento listo para compartir con socios</p>
              </div>
            </div>
            <button
              onClick={handleDownloadProposal}
              className="btn-primary flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Documento
            </button>
          </div>
        </motion.div>

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

          {/* New Fee Structure Table */}
          <div className="card-premium mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Desglose de Pagos</h3>
            <p className="text-sm text-titanium-400 mb-6">
              Base de cálculo: <strong className="text-white">{formatCurrencyFull(FEES_SUMMARY.capitalBase)}</strong>
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-titanium-700/30">
                    <th className="text-left py-3 text-titanium-400 font-medium">Concepto</th>
                    <th className="text-right py-3 text-titanium-400 font-medium">%</th>
                    <th className="text-right py-3 text-titanium-400 font-medium">Monto</th>
                    <th className="text-left py-3 pl-4 text-titanium-400 font-medium">Momento de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {FEES_SUMMARY.breakdown.map((fee, idx) => (
                    <tr key={idx} className="border-b border-titanium-700/20">
                      <td className="py-3 text-white font-medium">{fee.concept}</td>
                      <td className="py-3 text-right text-emerald-400 font-semibold">{fee.percentage.toFixed(1)}%</td>
                      <td className="py-3 text-right text-white font-semibold">{formatCurrencyFull(fee.amount)}</td>
                      <td className="py-3 pl-4 text-titanium-400 text-xs">{fee.moment}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-500/10">
                    <td className="py-4 text-white font-bold">Total Máximo</td>
                    <td className="py-4 text-right text-emerald-400 font-bold text-lg">{(FEES_SUMMARY.totalPercentage * 100).toFixed(0)}%</td>
                    <td className="py-4 text-right text-emerald-400 font-bold text-lg">{formatCurrencyFull(FEES_SUMMARY.totalAmount)}</td>
                    <td className="py-4 pl-4 text-titanium-400">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-titanium-500 mt-4">
              *El Finder's Fee aplica únicamente cuando el asesor acerca directamente al inversionista que cierra.
            </p>
          </div>

          {/* Value Guarantee */}
          <div className="card-premium bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Garantía de Valor - Fase 1</h4>
                <p className="text-sm text-titanium-300 mb-2">
                  {VALUE_GUARANTEE.description}
                </p>
                <p className="text-xs text-titanium-400">
                  <strong className="text-amber-400">Condición:</strong> {VALUE_GUARANTEE.condition}
                </p>
                <p className="text-xs text-titanium-400">
                  <strong className="text-amber-400">Saldo a favor:</strong> {formatCurrencyFull(VALUE_GUARANTEE.refundAmount)} ({(VALUE_GUARANTEE.refundPercentage * 100).toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Timeline */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">4. Fases del Proyecto</h2>
            <p className="text-titanium-400">
              Proceso paso a paso desde la estructuración hasta el cierre
            </p>
          </div>
          <TimelineVisual timeline={IMPLEMENTATION_TIMELINE} />

          {/* Pipeline Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-sm text-titanium-300">
              <strong className="text-blue-400">Nota sobre Pipeline:</strong> La generación del pipeline de inversionistas
              es responsabilidad de los socios de Lenso a través de su red de contactos. El servicio se enfoca en preparar,
              acompañar y cerrar las oportunidades identificadas. Los asesores pueden acercar inversionistas de su red,
              pero no es una obligación contractual.
            </p>
          </div>
        </div>

        {/* Initial Investment Section */}
        <div className="mb-12">
          <div className="card-premium bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-titanium-400 mb-1">Inversión Inicial para Comenzar</p>
                <p className="text-4xl font-bold text-white">
                  {formatCurrencyFull(FEES_SUMMARY.initialInvestment.amount)}
                  <span className="text-lg text-titanium-400 ml-2">MXN</span>
                </p>
                <p className="text-sm text-emerald-400 mt-1">
                  {FEES_SUMMARY.initialInvestment.percentage}% del capital objetivo
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs text-titanium-500 uppercase tracking-wide mb-1">Incluye</p>
                <p className="text-white font-medium">{FEES_SUMMARY.initialInvestment.description}</p>
                <p className="text-sm text-titanium-400">Objetivo: Escenario pitchable</p>
                <p className="text-sm text-purple-400 font-semibold">Meta: Febrero 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="card-premium bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-500/30">
          <div className="text-center">
            <Target className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Siguiente Paso: Iniciar Fase 1
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
                onClick={handleDownloadProposal}
                className="btn-primary"
              >
                <Download className="w-5 h-5" />
                Descargar Propuesta
              </button>
              <button
                onClick={() => setShowSummary(true)}
                className="btn-secondary"
              >
                <FileText className="w-5 h-5" />
                Ver Resumen Completo
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
          onDownload={handleDownloadProposal}
        />
      )}
    </div>
  )
}

// Proposal Summary Modal
function ProposalSummary({ structure, capitalOption, fees, onClose, formatCurrency, onDownload }) {
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
                <span className="text-sm ml-2">({fees.totalPercentage.toFixed(0)}%)</span>
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
                <span className="text-titanium-300">Deuda (15.5% anual)</span>
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
            {FEES_SUMMARY.breakdown.map((fee, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-titanium-300">{fee.concept} ({fee.percentage}%)</span>
                <span className="text-white font-semibold">
                  {formatCurrency(fee.amount)}
                </span>
              </div>
            ))}
            <div className="pt-3 border-t border-titanium-700/30 flex items-center justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-2xl font-bold text-lenso-green-800">
                {formatCurrency(fees.totalFees)}
              </span>
            </div>
          </div>
        </div>

        {/* Value Guarantee */}
        <div className="mb-6 p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Garantía de Valor
          </h3>
          <p className="text-sm text-titanium-300">
            {VALUE_GUARANTEE.description}
          </p>
          <p className="text-xs text-titanium-400 mt-2">
            Si no se logra escenario pitchable: <strong className="text-amber-400">{formatCurrency(VALUE_GUARANTEE.refundAmount)}</strong> como saldo a favor.
          </p>
        </div>

        {/* Target Date */}
        <div className="mb-6 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Objetivo Fase 1</h3>
              <p className="text-sm text-titanium-400">Escenario pitchable completado</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">Febrero 2026</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cerrar
          </button>
          <button onClick={onDownload} className="btn-primary flex-1">
            <Download className="w-5 h-5" />
            Descargar Propuesta
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ServiceProposal
