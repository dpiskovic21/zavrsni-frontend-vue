<script setup lang="ts">
import { useDialog } from "primevue/usedialog";
import type { Zadatak } from "../interfaces";
import ZadatakPrioritetChip from "./ZadatakPrioritetChip.vue";
import ZadatakDetalji from "./ZadatakDetalji.vue";

const props = defineProps<{ zadatak: Zadatak }>();
const emit = defineEmits<{
  zadatakIzmjenjen: [];
}>();
const dialog = useDialog();

function otvoriDetalje() {
  dialog.open(ZadatakDetalji, {
    props: {
      header: props.zadatak.naziv,
      modal: true,
    },
    data: props.zadatak.id,
    onClose: (izmjenjen) => {
      if (izmjenjen) emit("zadatakIzmjenjen");
    },
  });
}
</script>

<template>
  <Card>
    <template #title>
      {{ zadatak.naziv }}
    </template>
    <template #content>
      <ZadatakPrioritetChip :prioritet="zadatak.prioritet" />
      <p>Stats: {{ zadatak.status }}</p>
      <p>Rok: {{ new Date(zadatak.rok).toLocaleDateString() }}</p>
    </template>

    <template #footer>
      <Button label="Detalji" @click="otvoriDetalje" />
    </template>
  </Card>
</template>
