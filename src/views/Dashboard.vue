<style>
@import '../style.css';
</style>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { apiGet } from '../services/api';

interface BudgetDepense {
    id: number,
    annee: number,
    mois: string,
    type: string,
    categorie: string,
    sous_categorie: string,
    description: string,
    montant: number
}

interface DepensesReelles {
    Courses: number,
    Transport: number,
    Loyer: number,
    Restaurants: number,
    Shopping: number,
}

const iconesCategories: Record<string, string> = {
  "Shopping": "🛍️",
  "Transport": "🚆",
  "Restaurants": "🍽️",
  "Courses": "🛒",
  "Loyer": "🏠"
};

const depensesPrevuesByAnnee = ref<BudgetDepense[]>([]);
const depensesReellesByAnneeMois = ref<BudgetDepense[]>([]);
const depensesReellesTotalByCategorie = ref<DepensesReelles>(); 

const moisActuel = ref(new Date().getMonth()); // 0 = janvier, 11 = décembre
const annee = ref(new Date().getFullYear());

const moisNoms = [
  'Janvier', 'Février', 'Mars', 'Avril',
  'Mai', 'Juin', 'Juillet', 'Août',
  'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
const mois = computed(() => moisNoms[moisActuel.value]);
console.log(mois.value)
console.log(annee.value)

const revenus = ref<number>(0);  
const depenses = computed(() =>
  getSumAllDepensesPrevues(depensesReellesByAnneeMois.value)
);

const solde = computed(() => revenus.value - depenses.value)

onMounted(() => {
  chargerDepenses();  
});

watch([moisActuel, annee], () => {
  chargerDepenses();
});

const categories = computed(() => [
  {
    nom: 'Loyer',
    icon: '🏠',
    depense: depensesReellesTotalByCategorie.value?.Loyer ?? 0,
    budget: getMontantByCategorie("Loyer", depensesPrevuesByAnnee.value),
  },
  {
    nom: 'Restaurants',
    icon: '🍔',
    depense: depensesReellesTotalByCategorie.value?.Restaurants ?? 0,
    budget: getMontantByCategorie("Restaurants", depensesPrevuesByAnnee.value),
  },
  {
    nom: 'Courses',
    icon: '🛒',
    depense: depensesReellesTotalByCategorie.value?.Courses ?? 0,
    budget: getMontantByCategorie("Courses", depensesPrevuesByAnnee.value),
  },
  {
    nom: 'Shopping',
    icon: '🛍️',
    depense: depensesReellesTotalByCategorie.value?.Shopping ?? 0,
    budget: getMontantByCategorie("Shopping", depensesPrevuesByAnnee.value),
  },
  {
    nom: 'Transport',
    icon: '🚗',
    depense: depensesReellesTotalByCategorie.value?.Transport ?? 0,
    budget: getMontantByCategorie("Transport", depensesPrevuesByAnnee.value),
  },
])

const depensesPrevues = computed(() =>
  getSumAllDepensesPrevues(depensesPrevuesByAnnee.value)
);

const pourcentageDepenses = computed(() => {
  return Math.min((depenses.value / depensesPrevues.value) * 100)
})

async function chargerDepenses() {
  try {
    depensesPrevuesByAnnee.value = await apiGet<BudgetDepense[]>(
      `/depenses-prevues/annee-mois/${annee.value}/${mois.value}`
    );
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des dépenses prévues par année :',
      error
    );
  }

  try {
    depensesReellesByAnneeMois.value = await apiGet<BudgetDepense[]>(
      `/depenses-reelles/annee-mois/${annee.value}/${mois.value}`
    );
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des dépenses prévues par année :',
      error
    );
  }  

  try {
    revenus.value = await apiGet<number>(
      `/revenus/sum-all-revenus/${annee.value}/${mois.value}`
    );
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des revenus prévues par année et par mois :',
      error
    );
  }  

  try {
    depensesReellesTotalByCategorie.value = await apiGet<DepensesReelles>(
      `/depenses-reelles/total-by-categorie/${annee.value}/${mois.value}`
    );
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des dépenses réelles par année et par mois :',
      error
    );
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function categoriePourcentage(categorie) {
  if (!categorie.budget) return 0;
  return Math.min(((categorie.depense ?? 0) / categorie.budget) * 100)
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

function ajouterDepense() {
  console.log('Ajouter une dépense')
}

function getMontantByCategorie(categorie: string, data: BudgetDepense[]): number {
    let result = 0;
    for (const depense of data) {
      if (depense.categorie == categorie) {
        result = depense.montant;
      }
    }
    return result;
}

function getSumAllDepensesPrevues(data: BudgetDepense[]): number {
    let result = 0;
    for (const depense of data) {
        result = result+depense.montant;
    }
    return result;
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

        <span>{{ moisNoms[moisActuel] }} {{ annee }}</span>

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
            v-for="transaction in depensesReellesByAnneeMois"
            :key="transaction.id"
            class="transaction"
          >

            <div class="transaction-icon">
              {{ iconesCategories[transaction.categorie] ?? "💰" }}
            </div>

            <div class="transaction-info">

              <strong>
                {{ transaction.sous_categorie }}
              </strong>

              <small>
                {{ transaction.categorie }}
                <!-- ·
                {{ transaction.description }} -->
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

