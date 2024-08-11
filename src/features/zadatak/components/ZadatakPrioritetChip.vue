<script setup lang="ts">
const props = defineProps<{ prioritet: string }>();

function getTagColor(prioritet: string): string {
  switch (prioritet) {
    case "NIZAK":
      return "green";
    case "SREDNJI":
      return "yellow";
    case "VISOK":
      return "orange";
    default:
      return "red";
  }
}
</script>

<template>
  <Tag
    :value="prioritet"
    :style="{
      'background-color': getTagColor(prioritet),
      color: 'black',
    }"
  />
</template>
