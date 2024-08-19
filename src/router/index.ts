import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/autorizacija/prijava',
		},
		{
			path: '/autorizacija/prijava',
			name: 'prijava',
			component: () => import('../features/autorizacija/views/PrijavaView.vue'),
		},
		{
			path: '/autorizacija/registracija',
			name: 'registracija',
			component: () =>
				import('../features/autorizacija/views/RegistracijaView.vue'),
		},
		{
			path: '/projekt/lista',
			name: 'projekt-lista',
			component: () => import('../features/projekt/views/ProjektListaView.vue'),
		},
		{
			path: '/projekt/:id/lista',
			name: 'zadatak-lista',
			component: () => import('../features/zadatak/views/ZadatakListaView.vue'),
		},
		{
			path: '/projekt/novi',
			name: 'projekt-novi',
			component: () => import('../features/projekt/views/ProjektNoviView.vue'),
		},
		{
			path: '/statistika',
			name: 'statistika',
			component: () =>
				import('../features/statistika/views/StatistikaHomeView.vue'),
		},
		{
			path: '/admin',
			name: 'admin',
			component: () => import('../features/admin/views/AdminHomeView.vue'),
			children: [
				{
					path: 'korisnici',
					name: 'admin-korisnici',
					component: () =>
						import('../features/admin/views/AdminKorisniciView.vue'),
				},
				{
					path: 'projekti',
					name: 'admin-projekti',
					component: () =>
						import('../features/admin/views/AdminProjektiView.vue'),
				},
				{
					path: 'zadatci',
					name: 'admin-zadatci',
					component: () =>
						import('../features/admin/views/AdminZadatciView.vue'),
				},
				{
					path: 'privitci',
					name: 'admin-privitci',
					component: () =>
						import('../features/admin/views/AdminPrivitciView.vue'),
				},
				{
					path: 'komentari',
					name: 'admin-komentari',
					component: () =>
						import('../features/admin/views/AdminKomentariView.vue'),
				},
			],
		},
	],
});

export default router;
