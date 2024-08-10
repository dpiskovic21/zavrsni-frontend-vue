<script setup lang="ts">
import { RouterView } from "vue-router";
import AppNavigacija from "./shared/components/AppNavigacija.vue";
</script>

<template>
  <Toast />
  <header>
    <AppNavigacija />
  </header>

  <RouterView />
</template>

<style scoped></style>
