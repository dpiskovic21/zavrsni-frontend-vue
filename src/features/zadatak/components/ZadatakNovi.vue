<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { KorisnikService } from "../../korisnik/services/KorisnikService";
import { AutorizacijaService } from "../../autorizacija/services/AutorizacijaService";
import { useRoute } from "vue-router";
import type { CreateZadatakDTO } from "../interfaces";
import { ZadatakService } from "../services/ZadatakService";
import { useToast } from "primevue/useToast";

const korisnikService = new KorisnikService();
const autorizacijaService = new AutorizacijaService();
const zadatakService = new ZadatakService();
const ruta = useRoute();
const toast = useToast();
const dialogRef = inject("dialogRef");

const korisnici = ref<{ prikaz: string; vrijednost: number }[]>([]);
let naziv = ref("");
let opis = ref("");
let rok = ref<Date | null>(null);
let izvrsitelj = ref<number | null>(null);
let prioritet = ref("NIZAK");

const prioriteti = [
  { prikaz: "Nizak", vrijednost: "NIZAK" },
  { prikaz: "Srednji", vrijednost: "SREDNJI" },
  { prikaz: "Visok", vrijednost: "VISOK" },
  { prikaz: "Kritičan", vrijednost: "KRITICAN" },
];

onMounted(async () => {
  korisnici.value = (await korisnikService.getKorisnici()).map((korisnik) => ({
    prikaz: korisnik.ime + " " + korisnik.prezime,
    vrijednost: korisnik.id,
  }));
});

async function dodajZadatak() {
  const dto: CreateZadatakDTO = {
    projektId: +ruta.params.id,
    izvjestiteljId: autorizacijaService.prijavljeniKorisnik?.id!,
    naziv: naziv.value,
    opis: opis.value,
    rok: rok.value!,
    prioritet: prioritet.value,
    izvrsiteljId: izvrsitelj.value!,
  };

  try {
    await zadatakService.postZadatak(dto);
    toast.add({
      severity: "success",
      summary: "Uspješno",
      detail: "Zadatak je uspješno dodan",
    });
    dialogRef.value.close(true);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: "Došlo je do greške prilikom dodavanja zadatka",
    });
  }
}
</script>

<template>
  <Stepper value="1" linear>
    <StepList>
      <Step value="1">Osnovne informacije</Step>
      <Step value="2">Prioritet, rok i izvršitelj</Step>
    </StepList>
    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <div>
          <FloatLabel>
            <InputText inputId="naziv" v-model="naziv" />
            <label for="naziv">Naziv zadatka</label>
          </FloatLabel>
          <Editor :style="{ height: '320px' }" v-model="opis" />
        </div>
        <div style="margin-top: 3rem">
          <Button
            label="Dalje"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="activateCallback('2')"
            :disabled="naziv == '' || opis == ''"
            style="float: right"
          />
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <div class="flex">
          <SelectButton
            :options="prioriteti"
            optionLabel="prikaz"
            optionValue="vrijednost"
            v-model="prioritet"
          />
          <FloatLabel>
            <Calendar
              appendTo="body"
              iconDisplay="input"
              :showIcon="true"
              :minDate="new Date()"
              v-model="rok"
            />
            <label>Rok</label>
          </FloatLabel>
          <Dropdown
            :options="korisnici"
            optionLabel="prikaz"
            optionValue="vrijednost"
            placeholder="Izvršitelj"
            v-model="izvrsitelj"
          />
        </div>
        <div style="margin-top: 2rem">
          <Button
            label="Natrag"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="activateCallback('1')"
          />
          <Button
            label="Dodaj"
            icon="pi pi-plus"
            iconPos="right"
            @click="dodajZadatak"
            :style="{ float: 'right' }"
            :disabled="prioritet == '' || rok == null || izvrsitelj == null"
          />
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
