<script setup lang="ts">
import type { Privitak } from "../interfaces";
import { PrivitakService } from "../services/PrivitakService";

const props = defineProps<{
  privitci: Privitak[];
  zadatakId: number;
  mozeDodati: boolean;
}>();

const emit = defineEmits<{
  privitakUpload: [];
}>();

const privitakService = new PrivitakService();

async function preuzmiPrivitak(privitak: Privitak) {
  const p = await privitakService.getPrivitak(privitak.putanja);
  const buff = new Uint8Array(p.data);
  const url = window.URL.createObjectURL(
    new Blob([buff], { type: privitak.mimetype })
  );
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = privitak.naziv;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
</script>

<template>
  <div class="privitak-lista">
    <a
      v-for="privitak of privitci"
      :key="privitak.putanja"
      @click="preuzmiPrivitak(privitak)"
    >
      {{ privitak.naziv }}
    </a>
  </div>
</template>
