<script setup>
// No necesitamos imports especiales por ahora
// Si más adelante quieres agregar componentes reutilizables (ej. un HeaderLegal), los importas aquí
</script>

<template>
  <div class="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
    <!-- Encabezado -->
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
        Política de Privacidad
      </h1>
      <p class="mt-3 text-gray-600 dark:text-gray-400">
        Última actualización: 24 de enero de 2026
      </p>
    </div>

    <!-- Contenido principal -->
    <div class="prose prose-lg prose-gray dark:prose-invert max-w-none">
      <p>
        En <strong>[Nombre de tu Empresa / Aplicación]</strong> (en adelante “nosotros”, “nuestra” o “la Plataforma”), 
        valoramos tu privacidad y nos comprometemos a proteger tus datos personales de acuerdo con la 
        legislación colombiana vigente, en particular la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás 
        normas que regulan la protección de datos personales.
      </p>

      <h2>1. Responsable del Tratamiento</h2>
      <p>
        <strong>Responsable:</strong> [Nombre completo de la empresa o persona natural]<br>
        <strong>NIT / CC:</strong> [Tu NIT o documento]<br>
        <strong>Domicilio:</strong> Bucaramanga, Santander, Colombia<br>
        <strong>Correo electrónico:</strong> [privacidad@tuapp.com o el que uses]<br>
        <strong>Sitio web:</strong> [www.tuapp.com]
      </p>

      <h2>2. Datos que Recolectamos</h2>
      <p>Recolectamos los siguientes tipos de datos:</p>
      <ul>
        <li>Datos de identificación: nombre, documento de identidad, correo electrónico, número de teléfono.</li>
        <li>Datos financieros/transaccionales: información relacionada con movimientos, categorías, etc. (solo lo estrictamente necesario para el funcionamiento de la plataforma).</li>
        <li>Datos de uso: dirección IP, tipo de dispositivo, navegador, fecha y hora de acceso.</li>
        <li>Datos de geolocalización: aproximada, solo si lo autorizas expresamente.</li>
      </ul>

      <h2>3. Finalidades del Tratamiento</h2>
      <p>Utilizamos tus datos principalmente para:</p>
      <ul>
        <li>Permitir el registro, inicio de sesión y uso de la plataforma.</li>
        <li>Gestionar y mostrar tus movimientos, rankings y dashboard.</li>
        <li>Mejorar la experiencia de usuario y el funcionamiento técnico de la aplicación.</li>
        <li>Cumplir con obligaciones legales y responder a requerimientos de autoridades.</li>
        <li>(Opcional) Enviarte comunicaciones comerciales solo si das consentimiento expreso.</li>
      </ul>

      <h2>4. Derechos que te Asisten (Habeas Data)</h2>
      <p>Como titular de los datos, puedes ejercer gratuitamente los siguientes derechos:</p>
      <ul>
        <li>Conocer, actualizar y rectificar tus datos.</li>
        <li>Solicitar prueba de la autorización otorgada.</li>
        <li>Revocar la autorización o solicitar la supresión de tus datos (salvo cuando exista obligación legal de conservarlos).</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
      </ul>
      <p class="font-medium">
        Para ejercer cualquiera de estos derechos, escríbenos a: [privacidad@tuapp.com]
      </p>

      <h2>5. Compartición de Datos</h2>
      <p>
        No vendemos ni compartimos tus datos personales con terceros con fines comerciales. 
        Solo los compartimos cuando:
      </p>
      <ul>
        <li>Sea necesario para prestar el servicio (ej. proveedores tecnológicos de hosting, analítica anónima).</li>
        <li>Lo exija una autoridad competente.</li>
      </ul>

      <h2>6. Seguridad de la Información</h2>
      <p>
        Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra 
        acceso no autorizado, pérdida, alteración o destrucción.
      </p>

      <h2>7. Cambios a esta Política</h2>
      <p>
        Podemos actualizar esta política ocasionalmente. Te notificaremos cambios importantes 
        mediante la plataforma o por correo electrónico.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Si tienes dudas sobre esta Política de Privacidad, contáctanos en:<br>
        <strong>Email:</strong> [privacidad@tuapp.com]<br>
        <strong>Dirección:</strong> Bucaramanga, Santander – Colombia
      </p>
    </div>

    <!-- Botón de volver (opcional) -->
    <div class="mt-12 text-center">
      <router-link
        to="/dashboard"
        class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>