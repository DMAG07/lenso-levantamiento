// Service Proposal Data & Constants
// SINCRONIZADO CON InvestmentAnalysisV2.jsx como fuente de verdad
// ACTUALIZADO: Diciembre 2024 - Acuerdo comercial con socios Lenso

import { BUSINESS_CONSTANTS } from './constants'
import { EXIT_SCENARIO_6 } from './dcfCalculations'

export const CAPITAL_STRUCTURES = {
  SIMPLE: {
    id: 'simple',
    name: 'Opción Simple',
    description: 'Todo el capital se levanta en una sola empresa operadora',
    icon: '🏢',
    advantages: [
      'Menor costo de implementación',
      'Gestión administrativa más simple',
      'Menor tiempo de estructuración (2-3 semanas)',
      'Ideal para primeras rondas',
      'Menos documentación legal requerida'
    ],
    disadvantages: [
      'Mayor exposición de riesgo para inversionistas',
      'Flexibilidad limitada para diferentes tipos de capital',
      'Menor protección de activos',
      'Dificultad para estructuras multi-ronda complejas'
    ],
    bestFor: [
      'Levantamientos menores a $50M MXN',
      'Inversionistas conocidos/cercanos',
      'Empresas en etapa temprana',
      'Estructuras de capital simples'
    ],
    timeline: '2-3 semanas',
    legalComplexity: 'Baja',
    cost: 'Bajo',
    recommended: false
  },
  STRUCTURED: {
    id: 'structured',
    name: 'Opción Estructura de Control',
    description: 'Empresa operadora + vehículo de inversión (SPV) que mantiene el equity',
    icon: '⚙️',
    advantages: [
      'Separación clara entre operación e inversión',
      'Mayor protección para inversionistas',
      'Facilita múltiples rondas de inversión',
      'Permite diferentes clases de acciones',
      'Mejor para exits estructurados',
      'Governance más robusto'
    ],
    disadvantages: [
      'Mayor costo de implementación',
      'Requiere más documentación legal',
      'Timeline de estructuración más largo',
      'Gestión administrativa más compleja'
    ],
    bestFor: [
      'Levantamientos de $30M - $100M MXN',
      'Múltiples inversionistas institucionales',
      'Planes de expansión agresiva',
      'Estrategia de exit clara'
    ],
    timeline: '4-6 semanas',
    legalComplexity: 'Media-Alta',
    cost: 'Medio',
    recommended: true
  },
  GUARANTEED: {
    id: 'guaranteed',
    name: 'Opción Garantizada con Fideicomiso',
    description: 'Empresa operadora + fideicomiso con garantías sobre activos específicos',
    icon: '🛡️',
    advantages: [
      'Máxima protección para inversionistas',
      'Garantías reales sobre activos (inventario, contratos, IP)',
      'Acceso a deuda más barata',
      'Covenant financieros claros',
      'Mejor rating crediticio',
      'Ideal para capital + deuda'
    ],
    disadvantages: [
      'Costo de implementación más alto',
      'Mayor complejidad legal y fiscal',
      'Requiere valuación de activos',
      'Timeline más extenso',
      'Restricciones operativas por covenants'
    ],
    bestFor: [
      'Levantamientos mixtos (Capital + Deuda)',
      'Inversionistas institucionales conservadores',
      'Empresas con activos tangibles significativos',
      'Necesidad de minimizar costo de capital'
    ],
    timeline: '6-8 semanas',
    legalComplexity: 'Alta',
    cost: 'Alto',
    recommended: false
  }
}

export const CAPITAL_OPTIONS = {
  EQUITY_ONLY: {
    id: 'equity-only',
    name: 'Solo Capital (Equity)',
    amount: BUSINESS_CONSTANTS.EQUITY_CAPITAL,
    structure: {
      equity: BUSINESS_CONSTANTS.EQUITY_CAPITAL,
      debt: 0
    },
    advantages: [
      'Sin obligaciones de pago fijo',
      'No hay presión de servicio de deuda',
      'Mayor flexibilidad operativa',
      'No afecta credit score',
      'Ideal para empresas en crecimiento rápido',
      'Dividendos 50% del FCF desde año 3'
    ],
    disadvantages: [
      'Mayor dilución de founders (ownership)',
      'Costo de capital más alto',
      'Pérdida de control proporcional al equity cedido',
      'Menor apalancamiento para crecimiento'
    ],
    dilution: '~25%',
    monthlyPayment: 0,
    returnExpectation: `${EXIT_SCENARIO_6.irr.toFixed(1)}% IRR + Dividendos`,
    irr: EXIT_SCENARIO_6.irr,
    moic: EXIT_SCENARIO_6.moic,
    exitYear: 6,
    dividendPolicy: '50% FCF desde año 3'
  },
  MIXED: {
    id: 'mixed',
    name: 'Capital + Deuda',
    amount: BUSINESS_CONSTANTS.TOTAL_RAISE,
    structure: {
      equity: BUSINESS_CONSTANTS.EQUITY_CAPITAL,
      debt: BUSINESS_CONSTANTS.DEBT_CAPITAL
    },
    advantages: [
      `Menor dilución de founders (${BUSINESS_CONSTANTS.DILUTION * 100}%)`,
      'Dividendos 50% del FCF desde año 3',
      'Costo de capital blended más bajo',
      'Intereses deducibles de impuestos',
      `Mantiene más ownership (${(1 - BUSINESS_CONSTANTS.DILUTION) * 100}% founders)`,
      'Deuda senior sale primero en exit'
    ],
    disadvantages: [
      'Obligación de pago mensual (~$64,583 MXN)',
      'Presión de cash flow',
      'Covenants financieros',
      'Riesgo de default',
      'Requiere garantías'
    ],
    dilution: `${BUSINESS_CONSTANTS.DILUTION * 100}%`,
    monthlyPayment: 64583,
    annualDebtService: 775000,
    returnExpectation: `Equity: ${EXIT_SCENARIO_6.irr.toFixed(1)}% IRR + Dividendos | Deuda: ${BUSINESS_CONSTANTS.DEBT_INTEREST_RATE * 100}% fijo`,
    irr: EXIT_SCENARIO_6.irr,
    moic: EXIT_SCENARIO_6.moic,
    exitYear: 6,
    dividendPolicy: '50% FCF desde año 3',
    dividendsYear6: EXIT_SCENARIO_6.dividendsReceived,
    totalReturnYear6: EXIT_SCENARIO_6.totalReturn,
    recommended: true
  }
}

// Fees Structure - Total 3% (Actualizado Dic 2024)
// Estructura de pagos escalonados acordada con socios Lenso
export const FEES_STRUCTURE = {
  structuring_p1: {
    name: 'Estructuración - Parte 1',
    percentage: 0.005, // 0.5%
    description: 'Inicio del proyecto - Desarrollo de modelo financiero y estructura',
    paymentMoment: 'Al inicio del proyecto',
    deliverables: [
      'Modelo financiero completo',
      'Proyecciones 10 años',
      'Estructura de capital',
      'Escenarios de retorno',
      'Pitch deck base',
      'Memorándum de inversión'
    ]
  },
  structuring_p2: {
    name: 'Estructuración - Parte 2',
    percentage: 0.005, // 0.5%
    description: 'Al aprobar escenario pitchable validado por socios',
    paymentMoment: 'Al aprobar escenario pitchable',
    deliverables: [
      'Escenario pitchable aprobado',
      'Ajustes finales al modelo',
      'Documentación lista para inversores'
    ]
  },
  placement_p1: {
    name: 'Levantamiento - Parte 1',
    percentage: 0.005, // 0.5%
    description: 'Setup de materiales y estrategia de levantamiento',
    paymentMoment: 'Al aprobar escenario pitchable',
    deliverables: [
      'Data room virtual',
      'Perfiles de inversionistas target',
      'Estrategia de approach',
      'Q&A documento',
      'Pitch personalizado por perfil'
    ]
  },
  placement_p2: {
    name: 'Levantamiento - Parte 2 (Cierre)',
    percentage: 0.005, // 0.5%
    description: 'Acompañamiento en cierre de tickets de inversión',
    paymentMoment: 'Al cerrar tickets de inversión',
    deliverables: [
      'Soporte en presentaciones',
      'Ajustes de pitch según feedback',
      'Asesoría en negociación de términos',
      'Coordinación de cierre',
      'Revisión de documentación'
    ]
  },
  finders: {
    name: 'Finder\'s Fee',
    percentage: 0.01, // 1%
    description: 'Compensación por inversionista acercado directamente por el asesor',
    paymentMoment: 'Por inversionista acercado que cierre',
    note: 'Aplica únicamente cuando el asesor acerca directamente al inversionista',
    deliverables: [
      'Introducción directa con inversionista calificado',
      'Facilitación de primeras reuniones',
      'Soporte en negociaciones iniciales'
    ]
  }
}

// Garantía de Valor
export const VALUE_GUARANTEE = {
  condition: 'Si no se logra escenario pitchable en Fase 1',
  refundPercentage: 0.0025, // 0.25%
  refundAmount: BUSINESS_CONSTANTS.TOTAL_RAISE * 0.0025, // $75,000
  description: 'El 50% del pago inicial queda como saldo a favor para otras asesorías'
}

// Timeline actualizado - Sin tiempos específicos, basado en fases
export const IMPLEMENTATION_TIMELINE = [
  {
    phase: 1,
    name: 'Estructuración',
    subtitle: 'Análisis y Preparación',
    targetDate: 'Febrero 2026',
    activities: [
      'Kick-off meeting y definición de objetivos',
      'Desarrollo del modelo financiero completo',
      'Diseño de estructura de capital óptima',
      'Creación de escenarios de retorno',
      'Preparación de pitch deck base',
      'Elaboración de memorándum de inversión',
      'Validación de escenario pitchable con socios'
    ],
    deliverables: [
      'Modelo financiero',
      'Proyecciones 10 años',
      'Estructura de capital',
      'Escenarios de retorno',
      'Pitch deck base',
      'Memorándum de inversión'
    ],
    fee: {
      start: { percentage: '0.5%', amount: 150000, moment: 'Al inicio' },
      milestone: { percentage: '0.5%', amount: 150000, moment: 'Al aprobar escenario pitchable' }
    }
  },
  {
    phase: 2,
    name: 'Preparación de Levantamiento',
    subtitle: 'Materiales y Estrategia',
    activities: [
      'Setup de data room virtual',
      'Identificación de perfiles de inversionistas target',
      'Diseño de estrategia de approach',
      'Preparación de Q&A para due diligence',
      'Personalización de pitch por perfil de inversionista'
    ],
    deliverables: [
      'Data room virtual',
      'Perfiles de inversionistas',
      'Estrategia de approach',
      'Q&A documento',
      'Pitch personalizado por perfil'
    ],
    fee: {
      start: { percentage: '0.5%', amount: 150000, moment: 'Al aprobar escenario pitchable (junto con Estructuración P2)' }
    }
  },
  {
    phase: 3,
    name: 'Levantamiento y Cierre',
    subtitle: 'Ejecución y Cierre',
    activities: [
      'Acompañamiento en reuniones con inversionistas',
      'Ajustes de pitch según feedback recibido',
      'Asesoría en negociación de términos',
      'Coordinación del proceso de cierre',
      'Revisión de documentación legal'
    ],
    deliverables: [
      'Soporte en presentaciones',
      'Ajustes de pitch',
      'Asesoría en negociación',
      'Coordinación de cierre',
      'Revisión de documentación'
    ],
    fee: {
      milestone: { percentage: '0.5%', amount: 150000, moment: 'Al cerrar tickets de inversión' }
    },
    note: 'El pipeline de inversionistas es generado por los socios. El servicio acompaña y cierra las oportunidades identificadas.'
  }
]

// Resumen de fees para display
export const FEES_SUMMARY = {
  totalPercentage: 0.03, // 3%
  totalAmount: BUSINESS_CONSTANTS.TOTAL_RAISE * 0.03, // $900,000
  capitalBase: BUSINESS_CONSTANTS.TOTAL_RAISE, // $30,000,000
  breakdown: [
    { concept: 'Estructuración - Parte 1', percentage: 0.5, amount: 150000, moment: 'Al inicio del proyecto' },
    { concept: 'Estructuración - Parte 2', percentage: 0.5, amount: 150000, moment: 'Al aprobar escenario pitchable' },
    { concept: 'Levantamiento - Parte 1', percentage: 0.5, amount: 150000, moment: 'Al aprobar escenario pitchable' },
    { concept: 'Levantamiento - Parte 2 (Cierre)', percentage: 0.5, amount: 150000, moment: 'Al cerrar tickets' },
    { concept: 'Finder\'s Fee*', percentage: 1.0, amount: 300000, moment: 'Por inversionista acercado' }
  ],
  initialInvestment: {
    percentage: 0.5,
    amount: 150000,
    description: 'Fase 1 completa: Estructuración'
  }
}

// Legacy function for backward compatibility
export const calculateFees = (capitalAmount) => {
  const structuringFee = capitalAmount * 0.01 // 1% total (0.5% + 0.5%)
  const placementFee = capitalAmount * 0.01 // 1% total (0.5% + 0.5%)
  const findersFee = capitalAmount * 0.01 // 1%
  const totalFees = structuringFee + placementFee + findersFee
  const totalPercentage = (totalFees / capitalAmount) * 100

  return {
    structuringFee,
    placementFee,
    findersFee,
    totalFees,
    totalPercentage,
    breakdown: {
      structuring: {
        amount: structuringFee,
        percentage: 1.0
      },
      placement: {
        amount: placementFee,
        percentage: 1.0
      },
      finders: {
        amount: findersFee,
        percentage: 1.0
      }
    }
  }
}
