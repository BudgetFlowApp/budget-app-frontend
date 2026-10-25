import Statistiques from "../views/Statistiques.vue";
import Dashboard from "../views/Dashboard.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
    path: '/',
    name: 'dashboard',
    component: Dashboard
    },
    {
    path: '/statistiques',
    name: 'statistiques',
    component: Statistiques
    }
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router