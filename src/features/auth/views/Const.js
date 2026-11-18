// Constantes del panel informativo (infoLogin.vue)
export const TITULOS = [
  "¿Qué es nuestra aplicación?",
  "Nuestra promesa",
  "Asesorías personalizadas",
  "Asesorías grupales",
  "Gestión moderna",
];

export const INTERVALO_MS = 8000;

// Constantes compartidas de documentos legales
export const ACTUALIZADO = "24 de enero de 2026";

// Constantes de Política de Privacidad (politicaPrivacidad.vue)
// Pendiente de definir por el responsable del tratamiento (igual que en la política anterior)
export const CORREO_PRIVACIDAD = "[privacidad@tuapp.com]";

export const RESUMEN_PRIVACIDAD = [
  {
    icono: "ion:layers-outline",
    tono: "balance",
    titulo: "Qué guardamos",
    texto: "Tus datos de perfil y lo que registras: movimientos, categorías y presupuesto, además de datos de uso como IP y navegador.",
  },
  {
    icono: "ion:bulb-outline",
    tono: "brand",
    titulo: "Para qué",
    texto: "Para tu registro e inicio de sesión, mostrarte tu tablero y rankings, mejorar la experiencia y cumplir obligaciones legales.",
  },
  {
    icono: "ion:people-outline",
    tono: "info",
    titulo: "Con quién",
    texto: "No vendemos tus datos. Solo se comparten si el servicio lo necesita (hosting, analítica) o si lo exige una autoridad.",
  },
  {
    icono: "ion:download-outline",
    tono: "income",
    titulo: "Tus derechos",
    texto: "Conocer, actualizar, rectificar, revocar y suprimir tus datos, de forma gratuita.",
  },
];

export const SECCIONES_PRIVACIDAD = [
  {
    titulo: "1. Responsable del tratamiento",
    lineas: [
      "Responsable: [Nombre completo de la empresa o persona natural]",
      "NIT / CC: [Tu NIT o documento]",
      "Domicilio: Bucaramanga, Santander, Colombia",
      `Contacto: ${CORREO_PRIVACIDAD}`,
    ],
  },
  {
    titulo: "2. Datos que recolectamos",
    lineas: [
      "Datos de identificación: nombre, documento de identidad, correo electrónico, número de teléfono.",
      "Datos financieros: información relacionada con movimientos, categorías y presupuesto (estrictamente necesario).",
      "Datos de uso: dirección IP, tipo de dispositivo, navegador, fecha y hora de acceso.",
      "Geolocalización: aproximada, solo si lo autorizas expresamente.",
    ],
  },
  {
    titulo: "3. Finalidades del tratamiento",
    lineas: [
      "Registro y autenticación.",
      "Gestión de dashboard y rankings.",
      "Mejora de la experiencia técnica.",
      "Cumplimiento de obligaciones legales.",
    ],
  },
  {
    titulo: "4. Derechos (Habeas Data)",
    lineas: [
      "Como titular tienes derecho gratuito a conocer, actualizar, rectificar, revocar y suprimir tus datos.",
      `Para ejercerlos escribe a ${CORREO_PRIVACIDAD}.`,
    ],
  },
  {
    titulo: "5. Compartición de datos",
    lineas: [
      "No vendemos tus datos. Solo los compartimos si:",
      "Es necesario para el servicio (proveedores de hosting, analítica).",
      "Lo exige una autoridad competente.",
    ],
  },
  {
    titulo: "6. Seguridad",
    lineas: [
      "Implementamos medidas técnicas y organizativas (cifrado, firewalls) para proteger tus datos contra acceso no autorizado, pérdida o alteración.",
    ],
  },
  {
    titulo: "7. Cambios a la política",
    lineas: ["Podemos actualizar esta política. Te notificaremos los cambios importantes en la plataforma o por correo."],
  },
  {titulo: "8. Contacto", lineas: [`Email: ${CORREO_PRIVACIDAD}`, "Dirección: Bucaramanga, Santander – Colombia"]},
];

// Constantes de Términos y Condiciones (terminosCondiciones.vue)
// El texto completo de cada sección se agrega donde está el marcador
export const SECCIONES_TERMINOS = [
  {
    id: "t1",
    titulo: "1. Qué es MonyMonty",
    resumen: "Una plataforma para registrar, entender y planear tu dinero personal. No es un banco ni mueve tu dinero real.",
  },
  {id: "t2", titulo: "2. Tu cuenta", resumen: "Eres responsable de mantener tu contraseña en privado y de la información que registras."},
  {
    id: "t3",
    titulo: "3. Uso aceptable",
    resumen: "Usa MonyMonty solo para tus finanzas o las de tu hogar, sin intentar afectar el servicio.",
  },
  {
    id: "t4",
    titulo: "4. Planes y pagos",
    resumen: "El plan Free no tiene costo. Basic y Premium se cobran por periodo y puedes cancelarlos cuando quieras.",
  },
  {id: "t5", titulo: "5. Asesoría", resumen: "Los consejos y mentorías son educativos; las decisiones finales sobre tu dinero son tuyas."},
  {
    id: "t6",
    titulo: "6. Responsabilidad",
    resumen: "Trabajamos para que el servicio esté disponible y seguro, sin garantizar que no tenga interrupciones.",
  },
  {
    id: "t7",
    titulo: "7. Cambios",
    resumen: "Podemos actualizar estos términos y te avisaremos de los cambios importantes dentro de la plataforma.",
  },
];
