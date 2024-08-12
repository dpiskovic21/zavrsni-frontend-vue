<script setup lang="ts">
import { AutorizacijaService } from "@/features/autorizacija/services/AutorizacijaService";
import { type Projekt } from "@/features/projekt/interfaces";
import { ProjektService } from "@/features/projekt/services/ProjektService";
import { onMounted, ref } from "vue";
import StatistikaGrafovi from "../components/StatistikaGrafovi.vue";

const projektService = new ProjektService();
const autorizacijaService = new AutorizacijaService();

const projekti$ = ref<Partial<Projekt>[]>([]);
const odabraniProjekt$ = ref<Projekt | null>(null);

onMounted(async () => {
  const projekti = await projektService.getProjekti();

  if (autorizacijaService.prijavljeniKorisnik?.admin) {
    projekti$.value = projekti;
    projekti$.value.unshift({ naziv: "Svi projekti", id: -1 });
  } else {
    projekti$.value = projekti.filter(
      (projekt) =>
        projekt.voditelji.find(
          (voditelj) =>
            voditelj.korisnikId == autorizacijaService.prijavljeniKorisnik?.id!
        ) != null
    );
  }
});
</script>

<template>
  <Dropdown
    placeholder="Odaberi projekt"
    :options="projekti$"
    optionLabel="naziv"
    v-model="odabraniProjekt$"
  >
  </Dropdown>

  <StatistikaGrafovi :odabraniProjekt="odabraniProjekt$!" />
</template>
