<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <nav>
    <RouterLink to="">Projekti</RouterLink>
    <RouterLink to="">Statistika</RouterLink>
    <RouterLink to="">Admin panel</RouterLink>
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
