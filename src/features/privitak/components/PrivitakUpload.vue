<script setup lang="ts">
import { ref } from "vue";
import { PrivitakService } from "../services/PrivitakService";
import { useToast } from "primevue/useToast";

const props = defineProps<{
  zadatakId: number;
}>();
const emit = defineEmits<{
  privitakUpload: [];
}>();

const toast = useToast();

const fileUpload: any = ref(null);
const privitakServis = new PrivitakService();

async function upload(datoteka: any) {
  const file: File = datoteka.files[0];

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("zadatakId", props.zadatakId.toString());

    try {
      await privitakServis.postPrivitak(formData);
      toast.add({
        severity: "success",
        summary: "Uspješno",
        detail: "Privitak je uspješno dodan",
        life: 3000,
      });
      emit("privitakUpload");
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Greška",
        detail: "Došlo je do greške prilikom dodavanja privitka",
        life: 3000,
      });
    }
  }
}
</script>

<template>
  <input
    type="file"
    class="file-input"
    @change="upload($event.target)"
    ref="fileUpload"
  />

  <Button size="small" icon="pi pi-upload" @click="fileUpload!.click()" />
</template>

<style scoped>
.file-input {
  display: none;
}
</style>
