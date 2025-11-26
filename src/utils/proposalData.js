// Service Proposal Data & Constants

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
    amount: 25000000,
    structure: {
      equity: 25000000,
      debt: 0
    },
    advantages: [
      'Sin obligaciones de pago fijo',
      'No hay presión de servicio de deuda',
      'Mayor flexibilidad operativa',
      'No afecta credit score',
      'Ideal para empresas en crecimiento rápido',
      'Dividendos 35% del FCF desde año 3'
    ],
    disadvantages: [
      'Mayor dilución de founders (ownership)',
      'Costo de capital más alto',
      'Pérdida de control proporcional al equity cedido',
      'Menor apalancamiento para crecimiento'
    ],
    dilution: 'Alta (~21-22%)',
    monthlyPayment: 0,
    returnExpectation: '12-13% IRR + Dividendos',
    irr: 12.5,
    moic: 2.0,
    exitYear: 6,
    dividendPolicy: '35% FCF desde año 3'
  },
  MIXED: {
    id: 'mixed',
    name: 'Capital + Deuda',
    amount: 30000000,
    structure: {
      equity: 25000000,
      debt: 5000000
    },
    advantages: [
      'Menor dilución de founders (20%)',
      'Dividendos 35% del FCF desde año 3 ($4.8M años 3-6)',
      'Costo de capital blended más bajo',
      'Intereses deducibles de impuestos',
      'Mantiene más ownership (80% founders)',
      'Deuda senior sale primero en exit'
    ],
    disadvantages: [
      'Obligación de pago mensual ($66,667 MXN)',
      'Presión de cash flow',
      'Covenants financieros',
      'Riesgo de default',
      'Requiere garantías'
    ],
    dilution: 'Baja (20%)',
    monthlyPayment: 66667,
    annualDebtService: 800000,
    returnExpectation: 'Equity: 11.4% IRR + Dividendos | Deuda: 15.5% fijo',
    irr: 11.4,
    moic: 1.92,
    exitYear: 6,
    dividendPolicy: '35% FCF desde año 3',
    dividendsYear6: 4800000,
    totalReturnYear6: 48000000,
    recommended: true
  }
}

export const FEES_STRUCTURE = {
  structuring: {
    name: 'Fee de Estructuración',
    percentage: 0.008,
    description: 'Diseño de estructura legal, fiscal y corporativa óptima',
    deliverables: [
      'Análisis de estructura óptima',
      'Documentos constitutivos',
      'Estatutos sociales',
      'Acuerdos entre socios',
      'Term sheet para inversionistas'
    ]
  },
  placement: {
    name: 'Fee de Levantamiento y Cierre',
    percentage: 0.012,
    description: 'Búsqueda de inversionistas, negociación y cierre',
    deliverables: [
      'Pitch deck profesional',
      'Financial model completo',
      'Data room virtual',
      'Roadshow con inversionistas',
      'Negociación de términos',
      'Cierre de ronda'
    ]
  },
  finders: {
    name: 'Finder\'s Fee',
    percentage: 0.01,
    description: 'Compensación para quien atraiga al inversionista',
    deliverables: [
      'Introducción directa con inversionista calificado',
      'Facilitación de primeras reuniones',
      'Soporte en negociaciones iniciales',
      'Validación de términos de inversión'
    ]
  }
}

export const IMPLEMENTATION_TIMELINE = [
  {
    phase: 1,
    name: 'Estructuración',
    duration: '2-4 semanas',
    activities: [
      'Kick-off meeting y definición de objetivos',
      'Análisis de estructura óptima',
      'Diseño de términos y condiciones',
      'Preparación de documentos constitutivos',
      'Revisión y aprobación de estructura'
    ],
    deliverables: [
      'Term sheet',
      'Estructura corporativa',
      'Documentos constitutivos'
    ]
  },
  {
    phase: 2,
    name: 'Preparación',
    duration: '3-4 semanas',
    activities: [
      'Creación de financial model',
      'Diseño de pitch deck',
      'Setup de data room',
      'Preparación de Q&A',
      'Identificación de target investors'
    ],
    deliverables: [
      'Financial model completo',
      'Pitch deck profesional',
      'Data room virtual',
      'Lista de target investors'
    ]
  },
  {
    phase: 3,
    name: 'Levantamiento',
    duration: '6-8 semanas',
    activities: [
      'Roadshow con inversionistas',
      'Presentaciones one-on-one',
      'Due diligence process',
      'Negociación de términos',
      'Obtención de commitments'
    ],
    deliverables: [
      'Investment commitments',
      'Términos negociados',
      'LOIs firmadas'
    ]
  },
  {
    phase: 4,
    name: 'Cierre',
    duration: '2-3 semanas',
    activities: [
      'Firma de documentos legales',
      'Wire transfers',
      'Registro de nuevos accionistas',
      'Setup de governance',
      'Comunicación post-cierre'
    ],
    deliverables: [
      'Capital en banco',
      'Acuerdos firmados',
      'Estructura operativa'
    ]
  }
]

export const calculateFees = (capitalAmount) => {
  const structuringFee = capitalAmount * FEES_STRUCTURE.structuring.percentage
  const placementFee = capitalAmount * FEES_STRUCTURE.placement.percentage
  const findersFee = capitalAmount * FEES_STRUCTURE.finders.percentage
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
        percentage: FEES_STRUCTURE.structuring.percentage * 100
      },
      placement: {
        amount: placementFee,
        percentage: FEES_STRUCTURE.placement.percentage * 100
      },
      finders: {
        amount: findersFee,
        percentage: FEES_STRUCTURE.finders.percentage * 100
      }
    }
  }
}
