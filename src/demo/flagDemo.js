/**
 * Modo demo: permite recorrer la interfaz sin API. Solo existe en desarrollo (`npm run dev:demo`);
 * en un build de producción `import.meta.env.DEV` es falso y todo el código demo se descarta.
 */
export const MODO_DEMO = import.meta.env.DEV && import.meta.env.VITE_MODO_DEMO === "true";
