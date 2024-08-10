import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/autorizacija/prijava",
    },
    {
      path: "/autorizacija/prijava",
      name: "prijava",
      component: () => import("../features/autorizacija/views/PrijavaView.vue"),
    },
    {
      path: "/autorizacija/registracija",
      name: "registracija",
      component: () =>
        import("../features/autorizacija/views/RegistracijaView.vue"),
    },
    {
      path: "/projekt/lista",
      name: "projekt-lista",
      component: () => import("../features/projekt/views/ProjektListaView.vue"),
    },
  ],
});

export default router;
