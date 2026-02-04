<script setup>
const showPrivacidad = defineModel("visible", {required: true});
</script>

<template>
  <!-- ──────────── Drawer Política de Privacidad ──────────── -->

  <Drawer v-model:visible="showPrivacidad" position="full" :modal="true" :showCloseIcon="true" :dismissable="true" class="custom-drawer">
    <template #header>
      <h1 class="text-3xl md:text-5xl font-bold mb-4 text-color text-center w-full">Política de Privacidad</h1>
    </template>

    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 flex flex-col gap-8">
      <div>
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 text-surface-600 text-sm font-medium">
          <i class="pi pi-clock"></i>
          <span>Última actualización: 24 de enero de 2026</span>
        </div>

        <!-- Introducción -->
        <Card class="shadow-sm">
          <template #content>
            <p class="text-lg leading-relaxed">
              En <strong>[Nombre de tu Empresa / Aplicación]</strong> (en adelante “nosotros”, “nuestra” o “la Plataforma”), valoramos
              profundamente tu privacidad y nos comprometemos a proteger tus datos personales de acuerdo con la legislación colombiana
              vigente, en particular la <span class="font-semibold text-primary">Ley 1581 de 2012</span>, el Decreto 1377 de 2013 y demás
              normas concordantes.
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
          <AccordionHeader><span class="font-bold text-lg">1. Responsable del Tratamiento</span></AccordionHeader>
          <AccordionContent>
            <div class="grid md:grid-cols-2 gap-4 p-2">
              <div class="flex flex-col p-4 border rounded-lg">
                <span class="text-sm text-muted-color font-medium uppercase tracking-wider mb-1">Responsable</span>
                <span class="font-semibold">[Nombre completo de la empresa o persona natural]</span>
              </div>
              <div class="flex flex-col p-4 border rounded-lg">
                <span class="text-sm text-muted-color font-medium uppercase tracking-wider mb-1">NIT / CC</span>
                <span class="font-semibold">[Tu NIT o documento]</span>
              </div>
              <div class="flex flex-col p-4 border rounded-lg">
                <span class="text-sm text-muted-color font-medium uppercase tracking-wider mb-1">Domicilio</span>
                <span class="font-semibold">Bucaramanga, Santander, Colombia</span>
              </div>
              <div class="flex flex-col p-4 border rounded-lg">
                <span class="text-sm text-muted-color font-medium uppercase tracking-wider mb-1">Contacto</span>
                <span class="font-semibold break-all">[privacidad@tuapp.com]</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="1">
          <AccordionHeader><span class="font-bold text-lg">2. Datos que Recolectamos</span></AccordionHeader>
          <AccordionContent>
            <p class="mb-4">Recolectamos los siguientes tipos de datos para brindarte el mejor servicio:</p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <i class="pi pi-id-card text-primary mt-1"></i>
                <span
                  ><strong>Datos de identificación:</strong> nombre, documento de identidad, correo electrónico, número de teléfono.</span
                >
              </li>
              <li class="flex items-start gap-3">
                <i class="pi pi-wallet text-primary mt-1"></i>
                <span
                  ><strong>Datos financieros:</strong> información relacionada con movimientos, categorías, presupuesto (estrictamente
                  necesario).</span
                >
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
            <ul class="grid md:grid-cols-2 gap-3">
              <li class="flex items-center gap-2 p-3 border rounded-lg">
                <i class="pi pi-check-circle text-green-500"></i>
                <span>Registro y autenticación</span>
              </li>
              <li class="flex items-center gap-2 p-3 border rounded-lg">
                <i class="pi pi-chart-bar text-blue-500"></i>
                <span>Gestión de dashboard y rankings</span>
              </li>
              <li class="flex items-center gap-2 p-3 border rounded-lg">
                <i class="pi pi-cog text-purple-500"></i>
                <span>Mejora de experiencia técnica</span>
              </li>
              <li class="flex items-center gap-2 p-3 border rounded-lg">
                <i class="pi pi-file text-orange-500"></i>
                <span>Obligaciones legales</span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="3">
          <AccordionHeader><span class="font-bold text-lg">4. Derechos (Habeas Data)</span></AccordionHeader>
          <AccordionContent>
            <p class="mb-4">Como titular, tienes derecho gratuito a:</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <Tag value="Conocer" severity="info"></Tag>
              <Tag value="Actualizar" severity="info"></Tag>
              <Tag value="Rectificar" severity="info"></Tag>
              <Tag value="Revocar" severity="warn"></Tag>
              <Tag value="Suprimir" severity="danger"></Tag>
            </div>
            <p class="text-sm bg-surface-100 p-3 rounded-lg border-l-4 border-primary">
              Para ejercer estos derechos, escribe a:
              <a href="mailto:[privacidad@tuapp.com]" class="text-primary hover:underline font-medium">[privacidad@tuapp.com]</a>
            </p>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="4">
          <AccordionHeader><span class="font-bold text-lg">5. Compartición de Datos</span></AccordionHeader>
          <AccordionContent>
            <p>No vendemos tus datos. Solo los compartimos si:</p>
            <ul class="list-disc list-inside mt-2 ml-2">
              <li>Es necesario para el servicio (proveedores de hosting, analítica).</li>
              <li>Lo exige una autoridad competente.</li>
            </ul>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="5">
          <AccordionHeader><span class="font-bold text-lg">6. Seguridad</span></AccordionHeader>
          <AccordionContent>
            <div class="flex items-center gap-4">
              <i class="pi pi-lock text-4xl text-primary"></i>
              <p>
                Implementamos medidas técnicas y organizativas robustas (cifrado, firewalls) para proteger tus datos contra acceso no
                autorizado, pérdida o alteración.
              </p>
            </div>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="6">
          <AccordionHeader><span class="font-bold text-lg">7. Cambios a la Política</span></AccordionHeader>
          <AccordionContent>
            <p>Podemos actualizar esta política. Te notificaremos cambios importantes directamente en la plataforma o vía email.</p>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="7">
          <AccordionHeader><span class="font-bold text-lg">8. Contacto</span></AccordionHeader>
          <AccordionContent>
            <p class="mb-2">¿Dudas? Contáctanos:</p>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <i class="pi pi-envelope text-muted-color"></i>
                <span class="font-medium">[privacidad@tuapp.com]</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-building text-muted-color"></i>
                <span>Bucaramanga, Santander – Colombia</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </Drawer>
</template>
