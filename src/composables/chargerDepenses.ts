import { ref, computed } from 'vue'
import type { BudgetDepense, CategoriesReelles, Revenu, CategorieType } from '../types/depenses'
import { apiGet, apiPost } from '../services/api';

// États partagés
export const depensesPrevuesByAnnee = ref<BudgetDepense[]>([])
export const depensesReellesByAnneeMois = ref<BudgetDepense[]>([])
export const depensesReellesTotalByCategorie = ref<CategoriesReelles>()
export const categorieListDepensesReelles = ref<string[]>([])
export const categorieListRevenu = ref<string[]>([])
export const categorieListDepensesPrevues = ref<string[]>([])
export const revenus = ref<number>(0)

export const moisActuel = ref(new Date().getMonth())
export const annee = ref(new Date().getFullYear())

export const moisNoms = [
  'Janvier', 'Février', 'Mars', 'Avril',
  'Mai', 'Juin', 'Juillet', 'Août',
  'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export const mois = computed(() => moisNoms[moisActuel.value])

// Fonction de chargement
export async function chargerDepenses(
  annee: string | number,
  mois: string
) {
  try {
    depensesPrevuesByAnnee.value = await apiGet<BudgetDepense[]>(
      `/depenses-prevues/annee-mois/${annee}/${mois}`
    )
    // console.log("annee", annee);
    // console.log("mois", mois);
    // console.log(depensesPrevuesByAnnee.value);
    
  } catch (error) {
    console.error('Erreur dépenses prévues :', error)
  }

  try {
    depensesReellesByAnneeMois.value = await apiGet<BudgetDepense[]>(
      `/depenses-reelles/annee-mois/${annee}/${mois}`
    )
  } catch (error) {
    console.error('Erreur dépenses réelles :', error)
  }

  try {
    revenus.value = await apiGet<number>(
      `/revenus/sum-all-revenus/${annee}/${mois}`
    )
  } catch (error) {
    console.error('Erreur revenus :', error)
  }

  try {
    depensesReellesTotalByCategorie.value =
      await apiGet<CategoriesReelles>(
        `/depenses-reelles/total-by-categorie/${annee}/${mois}`
      )
  } catch (error) {
    console.error('Erreur dépenses réelles par catégorie :', error)
  }

  try {
    categorieListDepensesReelles.value = await apiGet<string[]>(
      `/depenses-reelles/all-categories-reelles/${annee}/${mois}`
    )
  } catch (error) {
    console.error('Erreur catégories dépenses réelles :', error)
  }

  try {
    categorieListRevenu.value = await apiGet<string[]>(
      `/revenus/all-categories-revenus/${annee}/${mois}`
    )
  } catch (error) {
    console.error('Erreur catégories revenus :', error)
  }

  try {
    categorieListDepensesPrevues.value = await apiGet<string[]>(
      `/depenses-prevues/all-categories-prevues/${annee}/${mois}`
    )
  } catch (error) {
    console.error('Erreur catégories dépenses prévues :', error)
  }
}