<script setup lang="ts">
import { RouterView } from "vue-router";
import AppNavigacija from "./shared/components/AppNavigacija.vue";
</script>

<template>
  <header>
    <AppNavigacija />
  </header>

  <RouterView />

  <Toast />
  <DynamicDialog />
</template>

<style scoped></style>
