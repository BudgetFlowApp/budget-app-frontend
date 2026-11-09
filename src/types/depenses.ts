export interface BudgetDepense {
  id: number;
  annee: number;
  mois: string;
  type: string;
  categorie: string;
  sous_categorie: string;
  description: string;
  montant: number;
}

export interface CategoriesReelles {
  Courses: number;
  Transport: number;
  Loyer: number;
  Restaurants: number;
  Shopping: number;
}

export interface Revenu {
  annee: number;
  mois: string;
  categorie: string;
  sous_categorie: string;
  montant: number;
}

export interface CategorieType {
  nom: string;
  icon: string;
  depense: number;
  budget: number;
}
