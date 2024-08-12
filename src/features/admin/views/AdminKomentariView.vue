<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import AdminTablica from '../components/AdminTablica.vue';
	import { type Column } from '@/shared/interfaces';
	import { useToast } from 'primevue/useToast';
	import type { Komentar } from '@/features/komentar/interfaces';
	import { KomentarService } from '@/features/komentar/services/KomentarService';

	const komentarService = new KomentarService();
	const toast = useToast();

	const komentari$ = ref<Komentar[]>([]);
	const stupci$ = ref<Column[]>([]);

	onMounted(async () => {
		await dohvatiKomentare();
	});

	async function dohvatiKomentare() {
		const komentari = await komentarService.getKomentari();
		komentari$.value = komentari;
		stupci$.value = [];
		for (let key of Object.keys(komentari[0])) {
			stupci$.value.push({ field: key, header: key.toLocaleUpperCase() });
		}
	}

	async function obrisiKomentar(id: string) {
		try {
			await komentarService.deleteKomentar(id);
			await dohvatiKomentare();
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
		:podatci="komentari$"
		:stupci="stupci$"
		@obrisi="obrisiKomentar"></AdminTablica>
</template>
