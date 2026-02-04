<script setup>
const isVisible = defineModel({required: true});
</script>

<template>
  <!-- ──────────── Drawer Términos y Condiciones ──────────── -->

  <Drawer v-model:visible="isVisible" position="full" :modal="true" :showCloseIcon="true" :dismissable="true" class="custom-drawer">
    <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
      <!-- Encabezado Premium -->
      <div class="text-center mb-12 relative">
        <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <i class="pi pi-file-edit text-9xl text-primary-500"></i>
        </div>
        <h1
          class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-4 tracking-tight"
        >
          Términos y Condiciones
        </h1>
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-sm font-medium"
        >
          <i class="pi pi-clock"></i>
          <span>Última actualización: 24 de enero de 2026</span>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="space-y-8">
        <!-- Introducción -->
        <Card class="shadow-sm border border-surface-200 dark:border-surface-700 !bg-surface-50 dark:!bg-surface-900/50">
          <template #content>
            <p class="text-lg leading-relaxed text-surface-700 dark:text-surface-200 mb-4">
              Al acceder, descargar, instalar o usar la aplicación <strong>Mony Monty</strong>, ya sea en versión móvil, web o cualquier
              otro medio, aceptas estar vinculado por estos <strong>Términos y Condiciones de Uso</strong>, la
              <strong>Política de Privacidad</strong> y cualquier otra política o norma que publiquemos en la Plataforma.
            </p>
            <Message severity="warn" icon="pi pi-exclamation-triangle" class="mt-4">
              Si no estás de acuerdo con estos Términos, <strong>no uses la Plataforma</strong>.
            </Message>
          </template>
        </Card>

        <!-- Secciones en Acordeón -->
        <Accordion :value="['0']" multiple class="shadow-md rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
          <AccordionPanel value="0">
            <AccordionHeader><span class="font-bold text-lg">1. Descripción del Servicio</span></AccordionHeader>
            <AccordionContent>
              <p class="mb-4">
                MonyMonty es una herramienta digital de <strong>gestión de finanzas personales</strong> que permite a los usuarios:
              </p>

              <div class="grid md:grid-cols-2 gap-4 p-2 mb-4">
                <div class="flex flex-col p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                  <span class="text-sm text-surface-500 font-medium uppercase tracking-wider mb-1">Responsable</span>
                  <span class="font-semibold text-surface-900 dark:text-surface-0">[Nombre completo de la empresa o persona natural]</span>
                </div>
                <div class="flex flex-col p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                  <span class="text-sm text-surface-500 font-medium uppercase tracking-wider mb-1">Domicilio</span>
                  <span class="font-semibold text-surface-900 dark:text-surface-0">Bucaramanga, Santander, Colombia</span>
                </div>
              </div>
              <ul class="space-y-2 ml-4 list-disc text-surface-700 dark:text-surface-200">
                <li>Primer elemento</li>
                <li>Segundo elemento</li>
                <li>Tercer elemento</li>
              </ul>
            </AccordionContent>
          </AccordionPanel>

          <!-- Note: The original file seemed to duplicate Privacy Policy content here. 
                  I will structure it nicely but keep the text as requested (or implied by 'style this file'). 
                  If the content was placeholders, this styling will at least make it look intentional. -->

          <AccordionPanel value="1">
            <AccordionHeader><span class="font-bold text-lg">2. Datos que Recolectamos</span></AccordionHeader>
            <AccordionContent>
              <p class="mb-4">Recolectamos los siguientes tipos de datos:</p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <i class="pi pi-id-card text-primary-500 mt-1"></i>
                  <span
                    ><strong>Datos de identificación:</strong> nombre, documento de identidad, correo electrónico, número de teléfono.</span
                  >
                </li>
                <li class="flex items-start gap-3">
                  <i class="pi pi-wallet text-primary-500 mt-1"></i>
                  <span><strong>Datos financieros/transaccionales:</strong> información relacionada con movimientos, categorías, etc.</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="pi pi-desktop text-primary-500 mt-1"></i>
                  <span><strong>Datos de uso:</strong> dirección IP, tipo de dispositivo, navegador, fecha y hora de acceso.</span>
                </li>
                <li class="flex items-start gap-3">
                  <i class="pi pi-map-marker text-primary-500 mt-1"></i>
                  <span><strong>Geolocalización:</strong> aproximada, solo si lo autorizas expresamente.</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="2">
            <AccordionHeader><span class="font-bold text-lg">3. Finalidades del Tratamiento</span></AccordionHeader>
            <AccordionContent>
              <ul class="list-none space-y-2">
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i> Permitir el registro, inicio de sesión y uso de la plataforma.
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i> Gestionar y mostrar tus movimientos, rankings y dashboard.
                </li>
                <li class="flex items-center gap-2">
                  <i class="pi pi-check text-green-500"></i> Mejorar la experiencia de usuario y el funcionamiento técnico.
                </li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-green-500"></i> Cumplir con obligaciones legales.</li>
              </ul>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="3">
            <AccordionHeader><span class="font-bold text-lg">4. Derechos que te Asisten</span></AccordionHeader>
            <AccordionContent>
              <p class="mb-2">Como titular de los datos, puedes ejercer gratuitamente los siguientes derechos:</p>
              <ul class="list-disc list-inside ml-2 space-y-1">
                <li>Conocer, actualizar y rectificar tus datos.</li>
                <li>Solicitar prueba de la autorización otorgada.</li>
                <li>Revocar la autorización o solicitar supresión.</li>
                <li>Presentar quejas ante la SIC.</li>
              </ul>
              <p class="mt-4 font-medium text-primary-600">Contacto: [privacidad@tuapp.com]</p>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="4">
            <AccordionHeader><span class="font-bold text-lg">5. Compartición de Datos</span></AccordionHeader>
            <AccordionContent>
              <p>
                No vendemos ni compartimos tus datos personales con fines comerciales. Solo cuando sea necesario para el servicio o por ley.
              </p>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="5">
            <AccordionHeader><span class="font-bold text-lg">6. Seguridad de la Información</span></AccordionHeader>
            <AccordionContent>
              <p>Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos.</p>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="6">
            <AccordionHeader><span class="font-bold text-lg">7. Cambios a esta Política</span></AccordionHeader>
            <AccordionContent>
              <p>Podemos actualizar esta política ocasionalmente. Te notificaremos cambios importantes.</p>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="7">
            <AccordionHeader><span class="font-bold text-lg">8. Contacto</span></AccordionHeader>
            <AccordionContent>
              <p>
                Si tienes dudas, contáctanos en:<br />
                <strong>Email:</strong> [privacidad@tuapp.com]<br />
                <strong>Dirección:</strong> Bucaramanga, Santander – Colombia
              </p>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </Drawer>
</template>
