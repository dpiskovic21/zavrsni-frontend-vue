<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { KorisnikService } from "../../korisnik/services/KorisnikService";
import type { KorisnikNaziv } from "@/features/korisnik/interfaces";
import { type Projekt } from "../interfaces";
import { ProjektService } from "../services/ProjektService";
import { useToast } from "primevue/useToast";
import type { DynamicDialogOptions } from "primevue/dynamicdialogoptions";

const korisnikService = new KorisnikService();
let projektService = new ProjektService();
const dialogRef: DynamicDialogOptions = inject("dialogRef")!;
const toast = useToast();

let korisnici$ = ref<KorisnikNaziv[]>([]);
let voditelji$ = ref<number[]>([]);
let projekt$ = ref<Projekt | null>(null);

const moguciStatusi = [
  { label: "U tijeku", value: "U_TIJEKU" },
  { label: "Završen", value: "ZAVRSEN" },
  { label: "Otkazan", value: "OTKAZAN" },
];

onMounted(async () => {
  korisnici$.value = (await korisnikService.getKorisnici()).map((korisnik) => {
    return {
      ...korisnik,
      naziv: korisnik.ime + " " + korisnik.prezime,
    };
  });
  projekt$.value = await projektService.getProjekt(dialogRef.value.data);
  voditelji$.value = projekt$.value.voditelji.map(
    (voditelj) => voditelj.korisnikId
  );
});

async function spremiIzmjene() {
  try {
    await projektService.updateProjekt(projekt$.value!.id, {
      naziv: projekt$.value!.naziv,
      status: projekt$.value!.status,
      voditelji: voditelji$.value,
    });
    toast.add({
      severity: "success",
      summary: "Uspjeh",
      detail: "Projekt uspješno ažuriran",
      life: 3000,
    });
    dialogRef.value.close(true);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: "Greška pri spremanju izmjena",
      life: 3000,
    });
  }
}
</script>

<template>
  <div style="margin-bottom: 2rem"></div>
  <div v-if="projekt$ != null" class="wrapper">
    <FloatLabel>
      <InputText v-model="projekt$.naziv" id="naziv" />
      <label for="naziv">Naziv projekta</label>
    </FloatLabel>
    <FloatLabel>
      <MultiSelect
        inputId="float-label"
        :options="korisnici$"
        optionLabel="naziv"
        optionValue="id"
        v-model="voditelji$"
      />
      <label for="float-label">Voditelji projekta</label>
    </FloatLabel>

    <label for="statsu">Status projekta:</label>
    <SelectButton
      :options="moguciStatusi"
      optionLabel="label"
      optionValue="value"
      v-model="projekt$.status"
      id="statsu"
    />
    <div class="submit"><Button label="Spremi" @click="spremiIzmjene()" /></div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.submit {
  flex: 1;
  display: flex;
  justify-content: end;
  align-items: end;
}
</style>
