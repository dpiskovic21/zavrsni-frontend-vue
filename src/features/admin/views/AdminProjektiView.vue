<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import AdminTablica from '../components/AdminTablica.vue';
	import { type Column } from '@/shared/interfaces';
	import { useToast } from 'primevue/useToast';
	import { ProjektService } from '@/features/projekt/services/ProjektService';
	import type { Projekt } from '@/features/projekt/interfaces';

	const projektService = new ProjektService();
	const toast = useToast();

	const projekti$ = ref<Projekt[]>([]);
	const stupci$ = ref<Column[]>([]);

	onMounted(async () => {
		await dohvatiProjekte();
	});

	async function dohvatiProjekte() {
		const projekti = await projektService.getProjekti();
		projekti$.value = projekti;
		stupci$.value = [];
		for (let key of Object.keys(projekti[0])) {
			stupci$.value.push({ field: key, header: key.toLocaleUpperCase() });
		}
	}

	async function obrisiProjekt(id: string) {
		try {
			await projektService.deleteProjekt(id);
			await dohvatiProjekte();
			toast.add({
				severity: 'success',
				summary: 'Uspješno',
				detail: 'Korisnik obrisan',
			});
		} catch (error) {
			toast.add({
				severity: 'error',
				summary: 'Greška',
				detail: 'Korisnik nije obrisan',
			});
		}
	}
</script>

<template>
	<AdminTablica
		:podatci="projekti$"
		:stupci="stupci$"
		@obrisi="obrisiProjekt"></AdminTablica>
</template>
