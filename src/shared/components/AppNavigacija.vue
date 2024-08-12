<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { AutorizacijaService } from "@/features/autorizacija/services/AutorizacijaService";

const autorizacijaService = new AutorizacijaService();
const ruter = useRouter();

function odjava() {
  autorizacijaService.odjava();
  ruter.push("/autorizacija/prijava");
}
</script>

<template>
  <nav>
    <RouterLink to="/projekt/lista">Projekti</RouterLink>
    <RouterLink to="/statistika">Statistika</RouterLink>
    <RouterLink to="">Admin panel</RouterLink>
    <a @click="odjava">Odjava</a>
  </nav>
</template>

<style scoped>
nav {
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid white;
}
</style>
