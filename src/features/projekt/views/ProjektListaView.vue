<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ProjektService } from "../services/ProjektService";
import ProjektCard from "../components/ProjektCard.vue";
import { type Projekt } from "../interfaces";

const projektService = new ProjektService();

const projekti = ref<Projekt[]>([]);

onMounted(() => {
  dohvatiProjekte();
});

async function dohvatiProjekte() {
  projekti.value = (await projektService.getProjekti()).sort((a, b) => {
    return (
      dohvatiVrijednostStatusaProjekta(a.status) -
      dohvatiVrijednostStatusaProjekta(b.status)
    );
  });
}

function dohvatiVrijednostStatusaProjekta(status: string) {
  switch (status) {
    case "U_TIJEKU":
      return 0;
    case "ZAVRSEN":
      return 1;
    default:
      return 2;
  }
}
</script>

<template>
  <div>
    <ProjektCard
      v-for="projekt in projekti"
      :key="projekt.id"
      :projekt="projekt"
      @projekt-izmjenjen="dohvatiProjekte"
    />
  </div>
</template>

<style scoped>
div {
  margin: 2rem;
  display: flex;
  gap: 5rem;
  flex-wrap: wrap;
}
</style>
