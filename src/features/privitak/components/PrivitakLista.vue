<script setup lang="ts">
import type { Privitak } from "../interfaces";
import PrivitakUpload from "./PrivitakUpload.vue";
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
  <h4 style="margin-bottom:0">Privitci</h4>
  <div class="wrapper">
    <div class="privitak-lista">
      <a
        v-for="privitak of privitci"
        :key="privitak.putanja"
        @click="preuzmiPrivitak(privitak)"
      >
        {{ privitak.naziv }}
      </a>
    </div>
    <PrivitakUpload
      style="float:right;margin-top: -3rem;"
      :zadatakId="zadatakId"
      @privitakUpload="emit('privitakUpload')"
    />
  </div>
</template>

<style scoped>
.wrapper {
  padding:1rem;
  border: 1px solid #222;
  border-radius: 8px;
  background-color: #333;
}
  
  .privitak-lista a {
    display: block;
    margin-bottom: 0.5rem;
    color: #61a2d3;
    text-decoration: none;
  }
  
  .privitak-lista a:hover {
    text-decoration: underline;
  }

</style>
