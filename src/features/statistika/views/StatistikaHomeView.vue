<script setup lang="ts">
import { AutorizacijaService } from "@/features/autorizacija/services/AutorizacijaService";
import { type Projekt } from "@/features/projekt/interfaces";
import { ProjektService } from "@/features/projekt/services/ProjektService";
import { onMounted, ref } from "vue";
import StatistikaGrafovi from "../components/StatistikaGrafovi.vue";
import type { StatistikaProjekta } from "../interfaces";

const projektService = new ProjektService();
const autorizacijaService = new AutorizacijaService();

const projekti$ = ref<Partial<Projekt>[]>([]);
const odabraniProjekt$ = ref<Projekt | null>(null);
const statistikaZaProjekte$ = ref<any>({labels:[], datasets: [{data: [], backgroundColor: []}]});

function 	getNasumicnaBoja() {
		var color = Math.floor(0x1000000 * Math.random()).toString(16);
		return '#' + color;
	}


onMounted(async () => {
  const statistika = await projektService.getProjektiStatistika();
  for (const oznaka in statistika) {
    statistikaZaProjekte$.value.labels.push(oznaka);
    statistikaZaProjekte$.value.datasets[0].data.push(statistika[oznaka as keyof StatistikaProjekta]);
    statistikaZaProjekte$.value.datasets[0].backgroundColor.push(getNasumicnaBoja());
  }

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
  <div style="display: flex; justify-content: center">
	<div
		style="
			width: 300px;
			display: flex;
			flex-direction: column;
			align-items: center;
		">
		<h4>Projekti po statusu</h4>
		<Chart type="pie" :data="statistikaZaProjekte$" />
	</div>
</div>
  <Dropdown
    placeholder="Odaberi projekt"
    :options="projekti$"
    optionLabel="naziv"
    v-model="odabraniProjekt$"
  >
  </Dropdown>

  <StatistikaGrafovi :odabraniProjekt="odabraniProjekt$!" />
</template>
