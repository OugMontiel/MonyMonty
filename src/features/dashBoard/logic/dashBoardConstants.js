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
    description: "Acumulado del día",
  },
  [PERIOD_FILTERS.SEMANA]: {
    label: "Esta Semana",
    description: "Acumulado de la semana",
  },
  [PERIOD_FILTERS.MES]: {
    label: "Este Mes",
    description: "Acumulado del mes",
  },
  [PERIOD_FILTERS.TRIMESTRE]: {
    label: "Este Trimestre",
    description: "Acumulado del trimestre",
  },
  [PERIOD_FILTERS.SEMESTRE]: {
    label: "Este Semestre",
    description: "Acumulado del semestre",
  },
  [PERIOD_FILTERS.ANO]: {
    label: "Este Año",
    description: "Acumulado del año",
  },
};

export const getCardDescription = (period) => {
  return CARD_PERIOD_DESCRIPTIONS[period];
};

export const MOVEMENTS_HELP_TEXT = {
  STANDARD: "Operaciones de Ingresos y Egresos.",
  TRANSFERENCIA: "Movimientos entre tus cuentas sin efecto en el balance neto.",
};
