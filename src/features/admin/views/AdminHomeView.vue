<script setup lang="ts">
	import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
	<div class="wrapper">
		<a
			><RouterLink active-class="active" :to="{ name: 'admin-korisnici' }"
				>Korisnici</RouterLink
			></a
		><a
			><RouterLink active-class="active" :to="{ name: 'admin-projekti' }"
				>Projekti</RouterLink
			></a
		><a
			><RouterLink active-class="active" :to="{ name: 'admin-zadatci' }"
				>Zadatci</RouterLink
			></a
		><a
			><RouterLink active-class="active" :to="{ name: 'admin-komentari' }"
				>Komentari</RouterLink
			></a
		>
		<a
			><RouterLink active-class="active" :to="{ name: 'admin-privitci' }"
				>Privitci</RouterLink
			></a
		>
	</div>
	<RouterView />
</template>

<style scoped>
	.wrapper {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
	}

	a {
		color: blue;
	}

	.active {
		color: red;
	}
</style>
