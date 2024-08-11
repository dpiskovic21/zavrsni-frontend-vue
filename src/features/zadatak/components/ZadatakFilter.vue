<script setup lang="ts">
const emit = defineEmits<{
  prikaz: [x: string];
  pretragaText: [x: string];
  sortiranje: [x: string];
}>();

const prikazi: { ime: string }[] = [
  { ime: "Aktivni" },
  { ime: "Moji" },
  { ime: "Svi" },
  { ime: "Završeni" },
];

const sortiranja: { ime: string }[] = [
  { ime: "Datum izrade" },
  { ime: "Rok" },
  { ime: "Prioritet" },
];
</script>

<template>
  <div class="wrapper">
    <FloatLabel>
      <Dropdown
        :options="prikazi"
        optionLabel="ime"
        optionValue="ime"
        @change="emit('prikaz', $event.value)"
      />
      <label>Prikazani projekti:</label>
    </FloatLabel>
    <InputText
      @input="emit('pretragaText', $event.target!.value)"
      placeholder="Pretraga"
    />
    <FloatLabel>
      <Dropdown
        :options="sortiranja"
        optionLabel="ime"
        optionValue="ime"
        @change="emit('sortiranje', $event.value)"
      />
      <label>Soritranje</label>
    </FloatLabel>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 1rem;
  margin: 2rem;
}
</style>
