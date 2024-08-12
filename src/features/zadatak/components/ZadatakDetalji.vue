<script setup lang="ts">
	import { inject, onMounted, ref } from 'vue';
	import { ZadatakService } from '../services/ZadatakService';
	import { type UpdateZadatakDTO, type Zadatak } from '../interfaces';
	import { type KorisnikNaziv } from '@/features/korisnik/interfaces';
	import { KorisnikService } from '@/features/korisnik/services/KorisnikService';
	import { AutorizacijaService } from '@/features/autorizacija/services/AutorizacijaService';
	import type { DynamicDialogOptions } from 'primevue/dynamicdialogoptions';
	import ZadatakPrioritetChip from './ZadatakPrioritetChip.vue';
	import PrivitakLista from '@/features/privitak/components/PrivitakLista.vue';
	import type { CreateKomentarDTO } from '@/features/komentar/interfaces';
	import { KomentarService } from '@/features/komentar/services/KomentarService';
	import { useToast } from 'primevue/useToast';
	import Editor from 'primevue/editor';

	const dialogRef: DynamicDialogOptions = inject('dialogRef')!;
	const zadatakService = new ZadatakService();
	const korisnikService = new KorisnikService();
	const komentarService = new KomentarService();
	const autorizacijaService = new AutorizacijaService();
	const toast = useToast();

	const zadatak$ = ref<Zadatak | null>(null);
	const korisnici$ = ref<KorisnikNaziv[]>([]);
	let noviKomentar$ = ref('');
	let mozePoslatiNaPregled = false;
	let mozeZatvoritiIliVratitiNaDoradu = false;
	let mozeDodatiPrivitak = false;
	let trebaAzuriratiOpis = false;
	let mozePromjenitiIzvrsitelja = false;

	onMounted(async () => {
		await dohvatiZadatak();

		setTimeout(() => {
			const editorElement = document.querySelector('.ql-editor');
			if (editorElement != null)
				editorElement.addEventListener('blur', updateOpis);
		}, 1000);
	});

	async function dohvatiZadatak() {
		const zadatak = await zadatakService.getZadatak(dialogRef.value.data);
		zadatak.komentari = zadatak.komentari.sort(
			(a, b) =>
				new Date(b.datumIzrade).getTime() - new Date(a.datumIzrade).getTime()
		);
		zadatak$.value = zadatak;
		mozePoslatiNaPregled =
			zadatak.status == 'U_IZRADI' &&
			zadatak.izvrsiteljId == autorizacijaService.prijavljeniKorisnik?.id;
		mozeZatvoritiIliVratitiNaDoradu =
			zadatak.status == 'NA_PREGLEDU' &&
			zadatak.izvjestiteljId == autorizacijaService.prijavljeniKorisnik?.id;
		mozeDodatiPrivitak =
			zadatak.izvjestiteljId == autorizacijaService.prijavljeniKorisnik?.id ||
			zadatak.izvrsiteljId == autorizacijaService.prijavljeniKorisnik?.id;
		mozePromjenitiIzvrsitelja =
			zadatak.izvjestiteljId == autorizacijaService.prijavljeniKorisnik?.id;

		if (mozePromjenitiIzvrsitelja) {
			korisnici$.value = (await korisnikService.getKorisnici()).map(
				(korisnik) => {
					const naziv = korisnik.ime + ' ' + korisnik.prezime;
					return { ...korisnik, naziv };
				}
			);
		}
	}

	async function azurirajZadatak(
		dto: UpdateZadatakDTO,
		zatvoriDialog = false,
		azuriranOpis = false
	) {
		try {
			await zadatakService.updateZadatak(zadatak$.value!.id, dto);
			if (zatvoriDialog) dialogRef.value.close(true);
			if (azuriranOpis) trebaAzuriratiOpis = false;
			toast.add({
				severity: 'success',
				summary: 'Uspjeh',
				detail: 'Zadatak ažuriran',
				life: 3000,
			});
		} catch (error) {
			toast.add({
				severity: 'error',
				summary: 'Greška',
				detail: 'Greška pri ažuriranju zadatka',
				life: 5000,
			});
		}
	}

	function vratiNaDoradu() {
		azurirajZadatak({ status: 'U_IZRADI' }, true);
	}

	function zatvori() {
		azurirajZadatak({ status: 'ZATVOREN' }, true);
	}

	function posaljiNaPregled() {
		azurirajZadatak({ status: 'NA_PREGLEDU' }, true);
	}
	function updateOpis() {
		if (!trebaAzuriratiOpis) return;
		azurirajZadatak({ opis: zadatak$.value!.opis }, false, true);
	}

	function promjeniIzvrsitelja() {
		azurirajZadatak({ izvrsiteljId: zadatak$.value!.izvrsiteljId });
	}

	async function dodajKomentar() {
		if (noviKomentar$.value == '') return;

		const komentarDTO: CreateKomentarDTO = {
			sadrzaj: noviKomentar$.value,
			korisnikId: autorizacijaService.prijavljeniKorisnik?.id!,
			zadatakId: zadatak$.value!.id,
		};

		try {
			await komentarService.postKomenatar(komentarDTO);
			dohvatiZadatak();
			noviKomentar$.value = '';
			toast.add({
				severity: 'success',
				summary: 'Uspjeh',
				detail: 'Komentar dodan',
				life: 3000,
			});
		} catch (error) {
			toast.add({
				severity: 'error',
				summary: 'Greška',
				detail: 'Greška pri dodavanju komentara',
				life: 5000,
			});
		}
	}
</script>

<template>
	<div v-if="zadatak$">
		<div class="osnovni-detalji">
			<ZadatakPrioritetChip :prioritet="zadatak$.prioritet" />
			<p>{{ zadatak$.status }}</p>
			<p>Napravljen: {{ zadatak$.datumIzrade }}</p>
			<p v-if="zadatak$.datumZavrsetka && zadatak$.status == 'ZATVOREN'">
				Završen: {{ zadatak$.datumZavrsetka }}
			</p>
			<Button
				v-if="mozePoslatiNaPregled"
				@click="posaljiNaPregled"
				label="Pošalji na pregled" />
			<Button
				label="Vrati na doradu"
				v-if="mozeZatvoritiIliVratitiNaDoradu"
				@click="vratiNaDoradu" />
			<Button
				v-if="mozeZatvoritiIliVratitiNaDoradu"
				@click="zatvori"
				label="Zatvori zadatak" />
		</div>
		<div class="korisnici-privitci">
			<div class="korisnici">
				<p style="margin-bottom: 1.5rem">
					Izvjestitelj:
					{{ zadatak$.izvjestitelj.ime + ' ' + zadatak$.izvjestitelj.prezime }}
				</p>
				<p v-if="mozePromjenitiIzvrsitelja == false">
					Izvršitelj:
					{{ zadatak$.izvrsitelj.ime + ' ' + zadatak$.izvrsitelj.prezime }}
				</p>
				<FloatLabel>
					<Select
						v-if="mozePromjenitiIzvrsitelja"
						:options="korisnici$"
						optionLabel="naziv"
						v-model="zadatak$.izvrsiteljId"
						@change="promjeniIzvrsitelja()"
						optionValue="id"
						id="izvrsitelj" />
					<label for="izvrsitelj">Izvršitelj</label>
				</FloatLabel>
			</div>
			<PrivitakLista
				:privitci="zadatak$.privitci"
				:zadatakId="zadatak$.id"
				:mozeDodati="mozeDodatiPrivitak"
				@privitakUpload="dohvatiZadatak" />
		</div>

		<Editor
			v-model="zadatak$.opis"
			@text-change="() => (trebaAzuriratiOpis = true)" />
		<div class="komentari">
			<h3>Komentari</h3>
			<InputGroup>
				<InputText v-model="noviKomentar$" />
				<Button @click="dodajKomentar" icon="pi pi-send" />
			</InputGroup>
			<div v-for="komentar of zadatak$.komentari" :key="komentar.id">
				<span
					>{{ komentar.korisnik.ime + ' ' + komentar.korisnik.prezime }}
					{{ new Date(komentar.datumIzrade).toLocaleString() }}</span
				>
				<p>{{ komentar.sadrzaj }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.sadrzaj {
		display: flex;
		padding: 2.5rem;
	}

	.osnovni-detalji {
		display: flex;
		gap: 1rem;
		justify-content: start;
		align-items: center;
	}

	.korisnici-privitci {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
</style>
