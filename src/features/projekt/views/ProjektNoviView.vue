<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useRouter} from 'vue-router';
import {useToast} from 'primevue/useToast';
import {KorisnikService} from '../../korisnik/services/KorisnikService';
import {AutorizacijaService} from '../../autorizacija/services/AutorizacijaService';
import { ProjektService } from '../services/ProjektService';
import {type KorisnikNaziv} from '../../korisnik/interfaces';

const toast = useToast();
const ruter = useRouter();

const korisnikService = new KorisnikService();
const autorizacijaService = new AutorizacijaService();
const projektService = new ProjektService();

const korisnici$ = ref<KorisnikNaziv[] | null>(null);
const naziv$ = ref('');
const voditelji$ = ref<number[]>([autorizacijaService.prijavljeniKorisnik?.id!]);
onMounted(async () => {
    const korisnici = await korisnikService.getKorisnici();
    korisnici$.value = korisnici.map(k => {
        return {
            naziv: k.ime + ' ' + k.prezime,
            id: k.id
        };
    });
});


async function dodajProjekt() {
    try {
        await projektService.createProjekt({
            naziv: naziv$.value,
            voditelji: voditelji$.value
        });
        toast.add({severity: 'success', summary: 'Uspješno dodan projekt'});    
        ruter.push({ name: 'projekt-lista' });
    } catch (error) {
        toast.add({severity: 'error', summary: 'Greška prilikom dodavanja projekta'});
    }
  }
</script>


<template>
<form>
  <FloatLabel>
    <InputText id="naziv" v-model="naziv$" />
    <label for="naziv">Naziv projekta</label>
  </FloatLabel>

    <MultiSelect
      v-if="korisnici$ != null"
      :loading="korisnici$ == null"
      :options="korisnici$"
      v-model="voditelji$"
      placeholder="Voditelji"
      optionLabel="naziv"
      optionValue="id"
    />

  <Button label="Dodaj" @click="dodajProjekt" />
</form>

</template>

<style scoped>
</style>