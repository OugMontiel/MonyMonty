export const PERIOD_FILTERS = {
  DIA: "dia",
  SEMANA: "semana",
  MES: "mes",
  TRIMESTRE: "trimestre",
  SEMESTRE: "semestre",
  ANO: "ano",
};

export const CARD_PERIOD_DESCRIPTIONS = {
  [PERIOD_FILTERS.DIA]: {
    label: "Hoy",
    description: "Movimientos del día",
  },
  [PERIOD_FILTERS.SEMANA]: {
    label: "Esta Semana",
    description: "Resumen semanal",
  },
  [PERIOD_FILTERS.MES]: {
    label: "Este Mes",
    description: "Acumulado del mes",
  },
  [PERIOD_FILTERS.TRIMESTRE]: {
    label: "Este Trimestre",
    description: "Resumen trimestral",
  },
  [PERIOD_FILTERS.SEMESTRE]: {
    label: "Este Semestre",
    description: "Acumulado semestral",
  },
  [PERIOD_FILTERS.ANO]: {
    label: "Este Año",
    description: "Balance anual",
  },
};

export const getCardDescription = (period) => {
  return CARD_PERIOD_DESCRIPTIONS[period];
};
