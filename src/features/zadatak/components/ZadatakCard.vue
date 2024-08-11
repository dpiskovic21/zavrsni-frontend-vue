<script setup lang="ts">
import type { Zadatak } from "../interfaces";
import ZadatakPrioritetChip from "./ZadatakPrioritetChip.vue";

const props = defineProps<{ zadatak: Zadatak }>();

function otvoriDetalje() {}
</script>

<template>
  <Card>
    <template #title>
      {{ zadatak.naziv }}
    </template>
    <template #content>
      <ZadatakPrioritetChip :prioritet="zadatak.prioritet" />
      <p>Stats: {{ zadatak.status }}</p>
      <p>Rok: {{ zadatak.rok }}</p>
    </template>

    <template #footer>
      <Button label="Detalji" @click="otvoriDetalje" />
    </template>
  </Card>
</template>
