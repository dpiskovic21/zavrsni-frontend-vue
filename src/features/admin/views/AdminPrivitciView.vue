<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import AdminTablica from '../components/AdminTablica.vue';
	import { type Column } from '@/shared/interfaces';
	import { useToast } from 'primevue/useToast';
	import { PrivitakService } from '@/features/privitak/services/PrivitakService';
	import type { Privitak } from '@/features/privitak/interfaces';

	const privitakService = new PrivitakService();
	const toast = useToast();

	const privitci$ = ref<Privitak[]>([]);
	const stupci$ = ref<Column[]>([]);

	onMounted(async () => {
		await dohvatiPrivitke();
	});

	async function dohvatiPrivitke() {
		const privitci = await privitakService.getPrivitci();
		privitci$.value = privitci;
		stupci$.value = [];
		for (let key of Object.keys(privitci[0])) {
			stupci$.value.push({ field: key, header: key.toLocaleUpperCase() });
		}
	}

	async function obrisiPrivitak(id: string) {
		try {
			await privitakService.deletePrivitak(id);
			await dohvatiPrivitke();
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
		:podatci="privitci$"
		:stupci="stupci$"
		@obrisi="obrisiPrivitak"></AdminTablica>
</template>
