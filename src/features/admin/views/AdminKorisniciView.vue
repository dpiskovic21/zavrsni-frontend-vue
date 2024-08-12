<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import AdminTablica from '../components/AdminTablica.vue';
	import { KorisnikService } from '@/features/korisnik/services/KorisnikService';
	import type { Korisnik } from '@/features/korisnik/interfaces';
	import { type Column } from '@/shared/interfaces';
	import { useToast } from 'primevue/useToast';

	const korisnikService = new KorisnikService();
	const toast = useToast();

	const korisnici$ = ref<Korisnik[]>([]);
	const stupci$ = ref<Column[]>([]);
	onMounted(async () => {
		await dohvatKorisnike();
	});

	async function dohvatKorisnike() {
		const korisnici = await korisnikService.getKorisnici();
		korisnici$.value = korisnici;
		stupci$.value = [];
		for (let key of Object.keys(korisnici[0])) {
			stupci$.value.push({ field: key, header: key.toLocaleUpperCase() });
		}
	}

	async function obrisiKorisniska(id: string) {
		try {
			await korisnikService.deleteKorisnik(id);
			await dohvatKorisnike();
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
		:podatci="korisnici$"
		:stupci="stupci$"
		@obrisi="obrisiKorisniska"></AdminTablica>
</template>
