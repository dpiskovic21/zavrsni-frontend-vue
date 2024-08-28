<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { Zadatak } from "../interfaces";
import { ProjektService } from "../../projekt/services/ProjektService";
import { AutorizacijaService } from "../../autorizacija/services/AutorizacijaService";
import ZadatakFilter from "../components/ZadatakFilter.vue";
import ZadatakCard from "../components/ZadatakCard.vue";
import { useDialog } from "primevue/usedialog";
import ZadatakNovi from "../components/ZadatakNovi.vue";

const projektService = new ProjektService();
const autorizacijaService = new AutorizacijaService();
const route = useRoute();
const dialog = useDialog();

const zadaci$ = ref<Zadatak[]>([]);
const prikaz$ = ref("Aktivni");
const sortiranje$ = ref("Datum izrade");
const pretraga$ = ref("");
let mozeDodatiZadatak = false;

onMounted(() => {
  dohvatiZadatke();
});

async function dohvatiZadatke() {
  const projekt = await projektService.getProjekt(route.params.id as string);
  zadaci$.value = projekt
    .zadaci!.filter((zadatak) =>
      prikaz$.value === "Aktivni"
        ? zadatak.status === "U_IZRADI"
        : prikaz$.value === "Završeni"
          ? zadatak.status === "ZATVOREN"
          : prikaz$.value === "Moji"
            ? zadatak.izvrsiteljId ==
              autorizacijaService.prijavljeniKorisnik?.id
            : true
    )
    .filter((zadatak) =>
      zadatak.naziv.toLowerCase().includes(pretraga$.value.toLowerCase())
    )
    .sort((a, b) =>
      sortiranje$.value === "Rok"
        ? new Date(a.rok).getTime() - new Date(b.rok).getTime()
        : sortiranje$.value === "Prioritet"
          ? dohvatiVrijednostPrioriteta(b) - dohvatiVrijednostPrioriteta(a)
          : new Date(a.datumIzrade).getTime() -
            new Date(b.datumIzrade).getTime()
    )
    .sort(
      (a, b) =>
        dohvatiVrijednostZaStatus(a.status) -
        dohvatiVrijednostZaStatus(b.status)
    );
  mozeDodatiZadatak =
    projekt.voditelji.find(
      (voditelj) =>
        voditelj.korisnikId === autorizacijaService.prijavljeniKorisnik?.id!
    ) !== undefined;
}

function dohvatiVrijednostZaStatus(status: string) {
  switch (status) {
    case "U_IZRADI":
      return 1;
    case "NA_PREGLEDU":
      return 2;
    default:
      return 3;
  }
}

function dohvatiVrijednostPrioriteta(zadatak: Zadatak) {
  return zadatak.prioritet === "NIZAK"
    ? 0
    : zadatak.prioritet === "SREDNJI"
      ? 1
      : zadatak.prioritet === "VISOK"
        ? 2
        : 3;
}

function onPretrageChange(value: string) {
  pretraga$.value = value;
  dohvatiZadatke();
}

function onPrikazChange(value: string) {
  prikaz$.value = value;
  dohvatiZadatke();
}

function onSortiranjeChange(value: string) {
  sortiranje$.value = value;
  dohvatiZadatke();
}

function otvoriDialogZaIzraduZadatka() {
  dialog.open(ZadatakNovi, {
    props: {
      header: "Novi zadatak",
      style: {
        width: "75vw",
      },
      modal: true,
    },
    onClose: (dodanNovi) => {
      if (dodanNovi) dohvatiZadatke();
    },
  });
}
</script>

<template>
  <ZadatakFilter
    @pretraga-text="onPretrageChange"
    @prikaz="onPrikazChange"
    @sortiranje="onSortiranjeChange"
  />

  <div class="zadaci">
    <ZadatakCard
      v-for="zadatak of zadaci$"
      :key="zadatak.id"
      :zadatak="zadatak"
      @zadatakIzmjenjen="dohvatiZadatke"
    ></ZadatakCard>
  </div>

  <Button
    v-if="mozeDodatiZadatak"
    icon="pi pi-plus"
    @click="otvoriDialogZaIzraduZadatka"
    class="dodaj-gumb"
  />
</template>

<style scoped>
.zadaci {
  display: flex;
  gap: 5rem;
  flex-wrap: wrap;
  margin: 2rem;
}

.dodaj-gumb {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
}
</style>
