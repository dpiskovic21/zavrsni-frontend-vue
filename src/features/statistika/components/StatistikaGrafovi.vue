<script setup lang="ts">
import { AutorizacijaService } from "@/features/autorizacija/services/AutorizacijaService";
import type { Projekt } from "@/features/projekt/interfaces";
import { ProjektService } from "@/features/projekt/services/ProjektService";
import { computed, ref, watch } from "vue";

interface GrafPodaci {
  labels: string[];
  datasets: [{ data: number[]; backgroundColor: string[] }];
}

const props = defineProps<{
  odabraniProjekt: Projekt;
}>();

const projektService = new ProjektService();
const autorizacijaService = new AutorizacijaService();

const brojZadatakaPoKorisniku$ = ref<GrafPodaci | null>();
const zakasnjeliRokovi$ = ref<GrafPodaci | null>();
const filterDatum$ = ref<Date | null>(null);
const odabraniProjektId$ = ref<number | null>(null);
const prikaziKalendarZaFiltirirnje$ = computed(() => {
  return (
    odabraniProjektId$.value !== null &&
    autorizacijaService.prijavljeniKorisnik?.admin == true
  );
});

watch(
  () => props.odabraniProjekt,
  async (noviProjekt) => {
    if (noviProjekt == null) return;
    odabraniProjektId$.value = noviProjekt.id;
    dohvatiStatistiku();
  }
);

function postaviPodatkeZaBrojZadatakaPoKorisniku(korisniciSaBrojemZadataka: {
  [idKorisnika: string]: { naziv: string; brojZadataka: number };
}) {
  brojZadatakaPoKorisniku$.value = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };

  if (Object.keys(korisniciSaBrojemZadataka).length == 0) {
    brojZadatakaPoKorisniku$.value.labels.push("Nema podataka");
    return;
  }

  for (const id in korisniciSaBrojemZadataka) {
    brojZadatakaPoKorisniku$.value.labels.push(
      korisniciSaBrojemZadataka[id].naziv
    );
    brojZadatakaPoKorisniku$.value.datasets[0].data.push(
      korisniciSaBrojemZadataka[id].brojZadataka
    );
    brojZadatakaPoKorisniku$.value.datasets[0].backgroundColor.push(
      getNasumicnaBoja()
    );
  }
}

function postaviPodatkeZaZakasnjeljeRokove(zakasnjeliRokovi: {
  [idKorisnika: string]: { naziv: string; brojZadataka: number };
}) {
  zakasnjeliRokovi$.value = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };

  if (Object.keys(zakasnjeliRokovi).length == 0) {
    zakasnjeliRokovi$.value.labels.push("Nema podataka");
    return;
  }

  for (const id in zakasnjeliRokovi) {
    zakasnjeliRokovi$.value.labels.push(zakasnjeliRokovi[id].naziv);
    zakasnjeliRokovi$.value.datasets[0].data.push(
      zakasnjeliRokovi[id].brojZadataka
    );
    zakasnjeliRokovi$.value.datasets[0].backgroundColor.push(
      getNasumicnaBoja()
    );
  }
}

function getNasumicnaBoja() {
  var color = Math.floor(0x1000000 * Math.random()).toString(16);
  return "#" + color;
}

async function onDatumChange() {
  dohvatiStatistiku(true);
}

async function dohvatiStatistiku(filter = false) {
  const statistika = await projektService.getProjektStatistika(
    odabraniProjektId$.value!,
    filter == true ? filterDatum$.value! : undefined
  );

  postaviPodatkeZaBrojZadatakaPoKorisniku(statistika.korisniciSaBrojemZadataka);
  postaviPodatkeZaZakasnjeljeRokove(statistika.zakasnjeliRokovi);
}
</script>

<template>
  <div>
    <Calendar
      v-if="prikaziKalendarZaFiltirirnje$"
      v-model="filterDatum$"
      view="month"
      dateFormat="mm/yy"
      :readonlyInput="true"
      @update:model-value="onDatumChange"
      :maxDate="new Date()"
      placeholder="Datum"
    />
  </div>
  <div class="wrapper">
    <div class="graf">
      <h3>Broj zadataka po korisniku</h3>
      <Chart type="pie" :data="brojZadatakaPoKorisniku$!" />
    </div>
    <div class="graf">
      <h3>Broj zadataka sa zakašnjelim rokovima po korisniku</h3>
      <Chart type="pie" :data="zakasnjeliRokovi$!" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.graf {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
