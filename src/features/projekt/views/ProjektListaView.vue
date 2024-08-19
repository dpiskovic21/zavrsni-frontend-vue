<script lang="ts" setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { ProjektService } from '../services/ProjektService';
	import ProjektCard from '../components/ProjektCard.vue';
	import { type Projekt } from '../interfaces';

	const projektService = new ProjektService();
	const ruter = useRouter();

	const projekti$ = ref<Projekt[]>([]);

	onMounted(() => {
		dohvatiProjekte();
	});

	async function dohvatiProjekte() {
		projekti$.value = (await projektService.getProjekti()).sort((a, b) => {
			return (
				dohvatiVrijednostStatusaProjekta(a.status) -
				dohvatiVrijednostStatusaProjekta(b.status)
			);
		});
	}

	function dohvatiVrijednostStatusaProjekta(status: string) {
		switch (status) {
			case 'U_TIJEKU':
				return 0;
			case 'ZAVRSEN':
				return 1;
			default:
				return 2;
		}
	}

	function navigirajNaIzraduProjekta() {
		ruter.push({ name: 'projekt-novi' });
	}
</script>

<template>
	<div>
		<ProjektCard
			v-for="projekt in projekti$"
			:key="projekt.id"
			:projekt="projekt"
			@projekt-izmjenjen="dohvatiProjekte" />
	</div>
	<Button
		icon="pi pi-plus"
		@click="navigirajNaIzraduProjekta"
		class="dodaj-gumb" />
</template>

<style scoped>
	div {
		margin: 2rem;
		display: flex;
		gap: 5rem;
		flex-wrap: wrap;
	}
	.dodaj-gumb {
		position: fixed;
		bottom: 20px;
		right: 20px;
	}
</style>
