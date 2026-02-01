<script setup>

const isVisible = defineModel({ required: true })


</script>

<template>
  
  <!-- ──────────── Drawer Términos y Condiciones ──────────── -->

  <drawer v-model:visible="showCondiciones" position="full" :modal="true" :showCloseIcon="true" :dismissable="true">
    <div class="w-full max-w-8xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Términos y Condiciones</h1>
        <p class="mt-3 text-gray-600">Última actualización: 24 de enero de 2026</p>
      </div>

      <!-- Contenido principal -->
      <div class="prose prose-lg prose-gray max-w-none text-justify">
        <p class="sm:pt-2 md:pt-4 lg:pt-6 xl:pt-8">
          Al acceder, descargar, instalar o usar la aplicación <strong>Mony Monty</strong>, ya sea en versión móvil, web o cualquier otro
          medio, aceptas estar vinculado por estos <strong>Términos y Condiciones de Uso</strong>, la
          <strong>Política de Privacidad</strong> y cualquier otra política o norma que publiquemos en la Plataforma.
        </p>

        <p class="py-4 md:py-4">Si no estás de acuerdo con estos Términos, <strong> no uses la Plataforma</strong>.</p>

        <h2>1. Descripción del Servicio</h2>
        <p>
          MonyMonty es una herramienta digital de <strong>gestión de finanzas personales</strong> que permite a los usuarios:<br />

          <strong>Responsable:</strong> [Nombre completo de la empresa o persona natural]<br />
          <strong>NIT / CC:</strong> [Tu NIT o documento]<br />
          <strong>Domicilio:</strong> Bucaramanga, Santander, Colombia<br />
          <strong>Correo electrónico:</strong> [privacidad@tuapp.com o el que uses]<br />
          <strong>Sitio web:</strong> [www.tuapp.com]
        </p>
        <ul>
          <li>Primer elemento</li>
          <li>Segundo elemento</li>
          <li>Tercer elemento</li>
        </ul>

        <h2>2. Datos que Recolectamos</h2>
        <p>Recolectamos los siguientes tipos de datos:</p>
        <ul>
          <li>Datos de identificación: nombre, documento de identidad, correo electrónico, número de teléfono.</li>
          <li>
            Datos financieros/transaccionales: información relacionada con movimientos, categorías, etc. (solo lo estrictamente necesario
            para el funcionamiento de la plataforma).
          </li>
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
        <p class="font-medium">Para ejercer cualquiera de estos derechos, escríbenos a: [privacidad@tuapp.com]</p>

        <h2>5. Compartición de Datos</h2>
        <p>No vendemos ni compartimos tus datos personales con terceros con fines comerciales. Solo los compartimos cuando:</p>
        <ul>
          <li>Sea necesario para prestar el servicio (ej. proveedores tecnológicos de hosting, analítica anónima).</li>
          <li>Lo exija una autoridad competente.</li>
        </ul>

        <h2>6. Seguridad de la Información</h2>
        <p>
          Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra acceso no autorizado, pérdida, alteración
          o destrucción.
        </p>

        <h2>7. Cambios a esta Política</h2>
        <p>
          Podemos actualizar esta política ocasionalmente. Te notificaremos cambios importantes mediante la plataforma o por correo
          electrónico.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Si tienes dudas sobre esta Política de Privacidad, contáctanos en:<br />
          <strong>Email:</strong> [privacidad@tuapp.com]<br />
          <strong>Dirección:</strong> Bucaramanga, Santander – Colombia
        </p>
      </div>
    </div>
  </drawer>
</template>