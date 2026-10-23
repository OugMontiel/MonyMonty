<script setup>
/** Esqueleto del tablero: los bloques conservan su forma para que nada salte al llegar los datos. */
</script>

<template>
  <div class="col" style="gap: var(--space-6)" role="status" aria-label="Cargando tu información">
    <div class="grid g4">
      <div v-for="n in 3" :key="n" class="mm-card">
        <div class="row between" style="align-items: flex-start">
          <div class="col gap-2"><div class="mm-skel" style="width: 90px; height: 12px"></div><div class="mm-skel" style="width: 140px; height: 10px"></div></div>
          <div class="mm-skel" style="width: 42px; height: 42px; border-radius: 12px"></div>
        </div>
        <div class="mm-skel" style="width: 68%; height: 30px; margin-top: 16px"></div>
        <div class="mm-skel" style="width: 120px; height: 20px; margin-top: 10px; border-radius: 999px"></div>
      </div>
      <div class="mm-card">
        <div class="col gap-2"><div class="mm-skel" style="width: 100px; height: 12px"></div><div class="mm-skel" style="width: 120px; height: 10px"></div></div>
        <div class="row gap-4" style="margin-top: 10px">
          <div class="mm-skel" style="width: 84px; height: 84px; border-radius: 50%"></div>
          <div class="col gap-2 grow"><div class="mm-skel" style="width: 90%; height: 12px"></div><div class="mm-skel" style="width: 60%; height: 12px"></div></div>
        </div>
      </div>
    </div>

    <div class="grid g-main">
      <div class="mm-card">
        <div class="row between" style="margin-bottom: 18px">
          <div class="col gap-2"><div class="mm-skel" style="width: 140px; height: 16px"></div><div class="mm-skel" style="width: 200px; height: 10px"></div></div>
          <div class="mm-skel" style="width: 140px; height: 12px"></div>
        </div>
        <div style="height: 230px; display: flex; align-items: flex-end; gap: 6%; padding: 0 4%">
          <div v-for="h in [60, 72, 55, 85, 76, 80]" :key="h" class="mm-skel" :style="{flex: 1, height: `${h}%`}"></div>
        </div>
      </div>
      <div class="mm-card">
        <div class="mm-skel" style="width: 160px; height: 16px; margin-bottom: 18px"></div>
        <div class="row gap-4">
          <div class="mm-skel" style="width: 150px; height: 150px; border-radius: 50%"></div>
          <div class="col grow" style="gap: 14px">
            <div v-for="w in [100, 86, 92, 70, 80]" :key="w" class="mm-skel" :style="{width: `${w}%`, height: '12px'}"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid g-main">
      <div class="mm-card">
        <div class="mm-skel" style="width: 170px; height: 16px; margin-bottom: 18px"></div>
        <div class="col gap-4">
          <div v-for="w in [50, 60, 42, 55]" :key="w" class="row gap-3">
            <div class="mm-skel" style="width: 34px; height: 34px; border-radius: 10px"></div>
            <div class="col grow"><div class="mm-skel" :style="{width: `${w}%`, height: '14px'}"></div><div class="mm-skel" style="width: 30%; height: 11px"></div></div>
            <div class="mm-skel" style="width: 90px; height: 16px"></div>
          </div>
        </div>
      </div>
      <div class="mm-card">
        <div class="mm-skel" style="width: 120px; height: 16px; margin-bottom: 18px"></div>
        <div class="col gap-4"><div v-for="n in 3" :key="n" class="mm-skel" style="width: 100%; height: 34px"></div></div>
      </div>
    </div>
  </div>
</template>
