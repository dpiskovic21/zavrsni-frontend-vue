<script setup lang="ts">
import { defineProps, onMounted } from "vue";
import { useDialog } from "primevue/usedialog";
import { type Projekt } from "../interfaces";
import ProjektDetalji from "./ProjektDetalji.vue";

const props = defineProps<{ projekt: Projekt }>();
const emit = defineEmits(["projektIzmjenjen"]);

const dialog = useDialog();

function getProjektStatusTagPozadina(status: string) {
  switch (status) {
    case "U_TIJEKU":
      return { background: "green", color: "white" };
    case "ZAVRSEN":
      return { background: "orange", color: "white" };
    case "OTKAZAN":
      return { background: "red", color: "white" };
    default:
      return { background: "gray", color: "white" };
  }
}
function getProjektSatusVrijednostZaPrikaz(status: string) {
  switch (status) {
    case "U_TIJEKU":
      return "U tijeku";
    case "ZAVRSEN":
      return "Završen";
    case "OTKAZAN":
      return "Otkazan";
    default:
      return "Nepoznat";
  }
}

function otvoriDialogZaDetalje() {
  dialog.open(ProjektDetalji, {
    props: {
      header: "Detalji projekta",
      style: { width: "70%", height: "70%" },
      modal: true,
    },
    data: props.projekt.id,
    onClose: (r) => {
      if (r) {
        emit("projektIzmjenjen");
      }
    },
  });
}
</script>

<template>
  <div>
    <Card>
      <template #title>
        {{ projekt.naziv }}
      </template>
      <template #content>
        <p>Započet: {{ projekt.datumPocetka }}</p>
        <Tag :style="getProjektStatusTagPozadina(projekt.status)">{{
          getProjektSatusVrijednostZaPrikaz(projekt.status)
        }}</Tag>
      </template>

      <template #footer>
        <Button label="Otvori" />
        <Button
          class="float-right"
          icon="pi pi-cog"
          @click="otvoriDialogZaDetalje()"
        />
      </template>
    </Card>
  </div>
</template>

<style scoped>
div {
  width: 300px;
}

.float-right {
  float: right;
}
</style>
