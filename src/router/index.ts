import Statistiques from "../views/Statistiques.vue";
import Dashboard from "../views/Dashboard.vue";
import { createRouter, createWebHistory } from "vue-router";

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
  history: createWebHistory(),
  routes
})

export default router