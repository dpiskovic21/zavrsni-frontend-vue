<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import AdminTablica from '../components/AdminTablica.vue';
	import { type Column } from '@/shared/interfaces';
	import { useToast } from 'primevue/useToast';
	import { ProjektService } from '@/features/projekt/services/ProjektService';
	import type { Projekt } from '@/features/projekt/interfaces';
	import { ZadatakService } from '@/features/zadatak/services/ZadatakService';
	import type { Zadatak } from '@/features/zadatak/interfaces';

	const zadatakService = new ZadatakService();
	const toast = useToast();

	const zadatci$ = ref<Zadatak[]>([]);
	const stupci$ = ref<Column[]>([]);

	onMounted(async () => {
		await dohvatiZadatke();
	});

	async function dohvatiZadatke() {
		const zadatci = await zadatakService.getZadatci();
		zadatci$.value = zadatci;
		stupci$.value = [];
		for (let key of Object.keys(zadatci[0])) {
			stupci$.value.push({ field: key, header: key.toLocaleUpperCase() });
		}
	}

	async function obrisiZadatak(id: string) {
		try {
			await zadatakService.deleteZadatak(id);
			await dohvatiZadatke();
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
		:podatci="zadatci$"
		:stupci="stupci$"
		@obrisi="obrisiZadatak"></AdminTablica>
</template>
