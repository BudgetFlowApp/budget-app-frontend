<script setup lang="ts">
import DepensesParCategorie from '../components/DepensesParCategorie.vue'
import { chargerDepenses, depensesReellesTotalByCategorie, mois, annee, moisActuel, moisNoms } from '../composables/chargerDepenses'
import { watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router';

onMounted(() => {
  loadDepenses();  
});

watch([moisActuel, annee], () => {
  loadDepenses();
});

async function loadDepenses() {
  await chargerDepenses(annee.value, mois.value);
}

function moisPrecedent() {
  if (moisActuel.value === 0) {
    // Si on est en janvier, on passe à décembre de l'année précédente
    moisActuel.value = 11;
    annee.value--;
  } else {
    moisActuel.value--;
  }
}
function moisSuivant() {
  if (moisActuel.value === 11) {
    // Si on est en décembre, on passe à janvier de l'année suivante
    moisActuel.value = 0;
    annee.value++;
  } else {
    moisActuel.value++;
  }
}
</script>


<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="logo">
        <span>◈</span>
        <h1>Budget</h1>
      </div>

      <nav class="navigation">
        <RouterLink to="/" class="nav-item">
          <span>⌂</span>
          <span>Dashboard</span>
        </RouterLink>

        <a href="#" class="nav-item">
          <span>↕</span>
          <span>Dépenses</span>
        </a>

        <a href="#" class="nav-item">
          <span>↑</span>
          <span>Revenus</span>
        </a>

        <a href="#" class="nav-item">
          <span>▣</span>
          <span>Budgets</span>
        </a>

        <RouterLink to="/statistiques" class="nav-item active">
          <span>◔</span>
          <span>Statistiques</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <a href="#" class="nav-item">
          <span>⚙</span>
          <span>Paramètres</span>
        </a>
      </div>
    </aside>

    <main class="main-content statistiques">
      <header class="header">
        <div>
          <p class="welcome">Ton espace financier</p>
          <h2>Statistiques</h2>
        </div>

        <div class="month-selector">
          <button @click="moisPrecedent">‹</button>
          <span>{{ moisNoms[moisActuel] }} {{ annee }}</span>
          <button @click="moisSuivant">›</button>
        </div>
      </header>

      <section class="stats-intro">
        <div>
          <p class="section-label">ANALYSE FINANCIÈRE</p>
          <h3>Où va ton argent ?</h3>
          <p class="stats-description">
            Visualise la répartition de tes dépenses par catégorie.
          </p>
        </div>
      </section>

      <div class="stats-grid">
        <DepensesParCategorie
          :depenses="depensesReellesTotalByCategorie"
        />
      </div>
    </main>
  </div>
</template>


