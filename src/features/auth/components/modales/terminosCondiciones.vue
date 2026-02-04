<script setup>
const isVisible = defineModel({required: true});
</script>

<template>
  <!-- ──────────── Drawer Términos y Condiciones ──────────── -->

  <Drawer v-model:visible="isVisible" position="full" :modal="true" :showCloseIcon="true" :dismissable="true" class="custom-drawer">
    <template #header>
      <h1 class="text-3xl md:text-5xl font-bold mb-4 text-color text-center w-full">Términos y Condiciones</h1>
    </template>

    <div class="w-full px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 flex flex-col gap-8">
      <div>
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 text-surface-600 text-sm font-medium">
          <i class="pi pi-clock"></i>
          <span>Última actualización: 24 de enero de 2026</span>
        </div>
        <!-- Introducción -->
        <Card class="shadow-sm">
          <template #content>
            <p class="text-lg leading-relaxed mb-4">
              Al acceder, descargar, instalar o usar la aplicación <strong>Mony Monty</strong>, ya sea en versión móvil, web o cualquier
              otro medio, aceptas estar vinculado por estos <strong>Términos y Condiciones de Uso</strong>, la
              <strong>Política de Privacidad</strong> y cualquier otra política o norma que publiquemos en la Plataforma.
            </p>
            <Message severity="warn" icon="pi pi-exclamation-triangle" class="mt-4">
              Si no estás de acuerdo con estos Términos, <strong>no uses la Plataforma</strong>.
            </Message>
          </template>
        </Card>
      </div>

      <!-- Secciones en Acordeón -->
      <Accordion :value="['0']" class="shadow-md rounded-xl overflow-hidden">
        <AccordionPanel value="0">
          <AccordionHeader><span class="font-bold text-lg">1. Descripción del Servicio</span></AccordionHeader>
          <AccordionContent>
            <p class="mb-4">
              MonyMonty es una herramienta digital de <strong>gestión de finanzas personales</strong> que permite a los usuarios:
            </p>

            <div class="grid md:grid-cols-2 gap-4 p-2 mb-4">
              <div class="flex flex-col p-4 border rounded-lg">
                <span class="text-sm text-muted-color font-medium uppercase tracking-wider mb-1">Responsable</span>
                <span class="font-semibold">[Nombre completo de la empresa o persona natural]</span>
              </div>
              <div class="flex flex-col p-4 border rounded-lg">
                <span class="text-sm text-muted-color font-medium uppercase tracking-wider mb-1">Domicilio</span>
                <span class="font-semibold">Bucaramanga, Santander, Colombia</span>
              </div>
            </div>
            <ul class="space-y-2 ml-4 list-disc">
              <li>Primer elemento</li>
              <li>Segundo elemento</li>
              <li>Tercer elemento</li>
            </ul>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="1">
          <AccordionHeader><span class="font-bold text-lg">2. Datos que Recolectamos</span></AccordionHeader>
          <AccordionContent>
            <p class="mb-4">Recolectamos los siguientes tipos de datos:</p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <i class="pi pi-id-card text-primary mt-1"></i>
                <span
                  ><strong>Datos de identificación:</strong> nombre, documento de identidad, correo electrónico, número de teléfono.</span
                >
              </li>
              <li class="flex items-start gap-3">
                <i class="pi pi-wallet text-primary mt-1"></i>
                <span><strong>Datos financieros/transaccionales:</strong> información relacionada con movimientos, categorías, etc.</span>
              </li>
              <li class="flex items-start gap-3">
                <i class="pi pi-desktop text-primary mt-1"></i>
                <span><strong>Datos de uso:</strong> dirección IP, tipo de dispositivo, navegador, fecha y hora de acceso.</span>
              </li>
              <li class="flex items-start gap-3">
                <i class="pi pi-map-marker text-primary mt-1"></i>
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
            <p class="mt-4 font-medium text-primary">Contacto: [privacidad@tuapp.com]</p>
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
  </Drawer>
</template>
