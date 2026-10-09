<style>
@import '../style.css';
</style>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { apiGet } from '../services/api';

interface BudgetDepense {
    idDepensePrevue: number,
    annee: number,
    mois: string,
    type: string,
    categorie: string,
    sous_categorie: string,
    description: string,
    montant: number
}

const annee = ref('2025')
const mois = ref('Septembre')

const revenus = ref(0)
const depenses = ref(1521.30)

const depense_logement = ref(0);
const budget_logement = ref(0);

const depense_courses = ref(0);
const budget_courses = ref(0);

const depense_transport = ref(0);
const budget_transport = ref(0);

const solde = computed(() => revenus.value - depenses.value)

onMounted(async () => {
  try {
    const data = await apiGet<BudgetDepense>(
      '/depenses-prevues/categorie/2025/Septembre/Loyer'
    );
    budget_logement.value = data.montant;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du budget pour le logement :',
      error
    );
  }
  try {
    const data = await apiGet<BudgetDepense>(
      '/depenses-reelles/categorie/2025/Septembre/Loyer'
    );
    depense_logement.value = data.montant;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la dépense pour le logement :',
      error
    );
  }
  try {
    const data = await apiGet<BudgetDepense>(
      '/depenses-prevues/categorie/2025/Septembre/Courses'
    );
    budget_courses.value = data.montant;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du budget pour les courses :',
      error
    );
  }    
  try {
    const data = await apiGet<BudgetDepense>(
      '/depenses-reelles/categorie/2025/Septembre/Courses'
    );
    depense_courses.value = data.montant;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la dépense pour les courses :',
      error
    );
  }  
  try {
    const data = await apiGet<BudgetDepense>(
      '/depenses-prevues/categorie/2025/Septembre/Transport'
    );
    budget_transport.value = data.montant;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du budget pour le transport :',
      error
    );
  }   
  try {
    const data = await apiGet<BudgetDepense>(
      '/depenses-reelles/categorie/2025/Septembre/Transport'
    );
    depense_transport.value = data.montant;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la dépense pour le transport :',
      error
    );
  }   
});

const categories = ref([
  {
    nom: 'Logement',
    icon: '🏠',
    depense: depense_logement,
    budget: budget_logement,
  },
  {
    nom: 'Restaurants',
    icon: '🍔',
    depense: 87.40,
    budget: 150,
  },
  {
    nom: 'Courses',
    icon: '🛒',
    depense: depense_courses,
    budget: budget_courses,
  },
  {
    nom: 'Shopping',
    icon: '🛍️',
    depense: 250,
    budget: 300,
  },
  {
    nom: 'Transport',
    icon: '🚗',
    depense: depense_transport,
    budget: budget_transport,
  },
])

const transactions = ref([
  {
    nom: 'Del Arte',
    categorie: 'Restaurants',
    date: "Aujourd'hui",
    icon: '🍔',
    montant: 24.90,
  },
  {
    nom: 'Amazon',
    categorie: 'Shopping',
    date: 'Hier',
    icon: '🛍️',
    montant: 25.48,
  },
  {
    nom: 'Uber',
    categorie: 'Transport',
    date: '21 septembre',
    icon: '🚗',
    montant: 21.93,
  },
  {
    nom: 'Beauty Bay',
    categorie: 'Beauté',
    date: '20 septembre',
    icon: '💄',
    montant: 34.50,
  },
])

const depensesPrevues = ref(950)

const pourcentageDepenses = computed(() => {
  return Math.min((depenses.value / depensesPrevues.value) * 100)
})

function formatMoney(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function categoriePourcentage(categorie) {
  return Math.min((categorie.depense / categorie.budget) * 100)
}

function moisPrecedent() {
  // À connecter plus tard à ton backend / Google Sheets
  console.log('Mois précédent')
}

function moisSuivant() {
  // À connecter plus tard à ton backend / Google Sheets
  console.log('Mois suivant')
}

function ajouterDepense() {
  console.log('Ajouter une dépense')
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

      <a href="#" class="nav-item active">
        <span>⌂</span>
        <span>Dashboard</span>
      </a>

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

      <a href="#" class="nav-item">
        <span>☷</span>
        <span>Catégories</span>
      </a>

    </nav>

    <div class="sidebar-bottom">
      <a href="#" class="nav-item">
        <span>⚙</span>
        <span>Paramètres</span>
      </a>
    </div>

  </aside>


  <main class="main-content">

    <!-- HEADER -->

    <header class="header">

      <div>
        <p class="welcome">Bonjour Léa 👋</p>
        <h2>Ton budget</h2>
      </div>

      <div class="month-selector">

        <button @click="moisPrecedent">
          ‹
        </button>

        <span>{{ mois }}</span>

        <button @click="moisSuivant">
          ›
        </button>

      </div>

    </header>


    <!-- SUMMARY -->

    <section class="summary">

      <!-- REVENUS -->

      <div class="summary-card income-card">

        <div class="card-header">
          <span>Revenus</span>
          <span class="card-icon">↑</span>
        </div>

        <h3>
          {{ formatMoney(revenus) }}
        </h3>

        <p>Ce mois-ci</p>

      </div>


      <!-- DEPENSES -->

      <div class="summary-card expense-card">

        <div class="card-header">
          <span>Dépenses</span>
          <span class="card-icon">↓</span>
        </div>

        <h3>
          {{ formatMoney(depenses) }}
        </h3>

        <p>Ce mois-ci</p>

      </div>


      <!-- SOLDE -->

      <div class="summary-card balance-card">

        <div class="card-header">
          <span>Disponible</span>
          <span class="card-icon">€</span>
        </div>

        <h3>
          {{ formatMoney(solde) }}
        </h3>

        <p>Solde mensuel</p>

      </div>

    </section>


    <!-- PREVU VS REEL -->

    <section class="budget-overview">

      <div class="section-title">

        <div>
          <p class="section-label">Suivi</p>
          <h2>Prévu vs Réel</h2>
        </div>

        <button class="secondary-button">
          Voir les détails
        </button>

      </div>


      <div class="comparison-grid">

        <!-- PREVU -->

        <div class="comparison-card">

          <div class="comparison-info">

            <span>Dépenses prévues</span>

            <strong>
              {{ formatMoney(depensesPrevues) }}
            </strong>

          </div>

          <div class="progress">

            <div
              class="progress-bar planned"
              style="width: 63%"
            ></div>

          </div>

          <p>
            Budget planifié pour le mois
          </p>

        </div>


        <!-- REEL -->

        <div class="comparison-card">

          <div class="comparison-info">

            <span>Dépenses réelles</span>

            <strong>
              {{ formatMoney(depenses) }}
            </strong>

          </div>

          <div class="progress">

            <div
              class="progress-bar actual"
              :style="{ width: `${pourcentageDepenses}%` }"
            ></div>

          </div>

          <p>
            Montant réellement dépensé
          </p>

        </div>

      </div>

    </section>


    <!-- DASHBOARD GRID -->

    <section class="dashboard-grid">


      <!-- BUDGETS -->

      <div class="dashboard-card budgets-card">

        <div class="section-title">

          <div>
            <p class="section-label">Budget</p>
            <h2>Par catégorie</h2>
          </div>

          <a href="#">
            Voir tout
          </a>

        </div>


        <div class="category-list">

          <div
            v-for="categorie in categories"
            :key="categorie.nom"
            class="category"
          >

            <div class="category-top">

              <div class="category-name">

                <span class="category-icon">
                  {{ categorie.icon }}
                </span>

                <div>

                  <strong>
                    {{ categorie.nom }}
                  </strong>

                  <small>
                    {{ formatMoney(categorie.depense) }}
                    /
                    {{ formatMoney(categorie.budget) }}
                  </small>

                </div>

              </div>

              <span>
                {{ Math.round(categoriePourcentage(categorie)) }}%
              </span>

            </div>


            <div class="progress">

              <div
                class="progress-bar category-progress"
                :style="{
                  width: `${categoriePourcentage(categorie)}%`
                }"
              ></div>

            </div>

          </div>

        </div>

      </div>


      <!-- TRANSACTIONS -->

      <div class="dashboard-card transactions-card">

        <div class="section-title">

          <div>
            <p class="section-label">Historique</p>
            <h2>Dernières dépenses</h2>
          </div>

          <a href="#">
            Voir tout
          </a>

        </div>


        <div class="transaction-list">

          <div
            v-for="transaction in transactions"
            :key="transaction.nom"
            class="transaction"
          >

            <div class="transaction-icon">
              {{ transaction.icon }}
            </div>

            <div class="transaction-info">

              <strong>
                {{ transaction.nom }}
              </strong>

              <small>
                {{ transaction.categorie }}
                ·
                {{ transaction.date }}
              </small>

            </div>

            <span class="transaction-amount">
              -{{ formatMoney(transaction.montant) }}
            </span>

          </div>

        </div>

      </div>

    </section>


    <!-- ADD EXPENSE -->

    <button
      class="add-expense-button"
      @click="ajouterDepense"
    >

      <span>+</span>

      Ajouter une dépense

    </button>

  </main>
  </div> 
</template>

