<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useToast } from "primevue/useToast";
import { AutorizacijaService } from "../services/AutorizacijaService";

const toast = useToast();
const ruter = useRouter();
const servis = new AutorizacijaService();

let email = "";
let lozinka = "";

async function prijava() {
  try {
    const r = await servis.prijava({ email, lozinka });
    localStorage.setItem("korisnik", JSON.stringify(r));
    ruter.push({ name: "projekt-lista" });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Greška",
      detail: error.response.data.message ?? "Nepoznata greška",
      life: 3000,
    });
  }
}
</script>

<template>
  <div class="wrapper">
    <form>
      <InputText placeholder="EMAIL" v-model="email" />
      <InputText placeholder="LOZINKA" v-model="lozinka" />
      <Button label="Prijava" @click="prijava" />
    </form>
    <RouterLink to="/autorizacija/registracija">Registracija</RouterLink>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  place-items: center;
  margin-top: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
