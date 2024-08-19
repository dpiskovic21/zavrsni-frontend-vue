<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/useToast";
import {AutorizacijaService} from '../services/AutorizacijaService';

const servis = new AutorizacijaService();
const toast = useToast();
const ruter = useRouter();

const ime$ = ref("");
const prezime$ = ref("");
const email$ = ref("");
const lozinka$ = ref("");
const admin$ = ref(false);

async function registracija() {
  try {
      await servis.registracija({
        ime: ime$.value,
        prezime: prezime$.value,
        email: email$.value,
        lozinka: lozinka$.value,
        admin: admin$.value
      });
      toast.add({
        severity: "success",
        summary: "Registracija",
        detail: "Uspješno ste se registrirali",
        life: 3000,
      });
      ruter.push({ name: "prijava" });
  } catch(e) {
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: e.response && e.response.data ? e.response.data.message : "Nepoznata greška",
      life: 5000,
    });
  }
}
</script>

<template>
<form>
  <FloatLabel>
    <InputText id="ime" v-model="ime$"/>
    <label for="ime">Ime</label>
  </FloatLabel>
  <FloatLabel>
    <InputText  id="prezime" v-model="prezime$"/>
    <label for="prezime">Prezime</label>
  </FloatLabel>
  <FloatLabel>
    <InputText id="email" v-model="email$"/>
    <label for="email">Email</label>
  </FloatLabel>
  <FloatLabel>
    <Password :feedback="false" id="lozinka" v-model="lozinka$" />
    <label for="lozinka">Lozinka</label>
  </FloatLabel>
  <div class="admin-wrapper">
    <label for="admin">Admin:</label>
    <Checkbox
      id="admin"
      v-model="admin$"
      :binary="true"
    ></Checkbox>
  </div>
  <Button
    label="Registracija"
    type="button"
    :disabled="ime$.length === 0 || prezime$.length === 0 || email$.length === 0 || lozinka$.length === 0"
    @click="registracija"
  ></Button>
</form>

</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: 5rem;
}
</style>
