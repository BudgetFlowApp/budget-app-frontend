
<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  depenses: Record<string, number> | undefined
}>()

const totauxParCategorie = computed(() => {
  const totaux: Record<string, number> = {}

  Object.entries(props.depenses ?? {}).forEach(([categorie, montant]) => {
    const valeur = Number(montant) || 0

    if (valeur > 0) {
      totaux[categorie] = valeur
    }
  })

  return totaux
})

const chartData = computed(() => ({
  labels: Object.keys(totauxParCategorie.value),
  datasets: [
    {
      data: Object.values(totauxParCategorie.value),
      backgroundColor: [
        '#8B5CF6',
        '#EC4899',
        '#F59E0B',
        '#10B981',
        '#3B82F6',
        '#F97316',
        '#64748B'
      ],
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    },
    tooltip: {
      callbacks: {
        label(context: any) {
          const valeurs = context.dataset.data as number[]
          const total = valeurs.reduce(
            (somme, valeur) => somme + valeur,
            0
          )

          const montant = Number(context.raw) || 0
          const pourcentage = total
            ? (montant / total) * 100
            : 0

          return ` ${context.label} : ${montant.toFixed(2)} € (${pourcentage.toFixed(1)} %)`
        }
      }
    }
  }
}
</script>

<template>
  <section class="graphique-card">
    <h2>Dépenses par catégorie</h2>

    <div
      v-if="Object.keys(totauxParCategorie).length === 0"
      class="message-vide"
    >
      Aucune dépense à afficher pour ce mois.
    </div>

    <div v-else class="graphique">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>


<!-- <style scoped>
.graphique-card {
  width: 100%;
  background: #ffffff;
  padding: 30px;
  border: 1px solid #ededf0;
  border-radius: 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.035);
}

h2 {
  font-size: 18px;
  font-weight: 700;
  color: #202027;
  letter-spacing: -0.4px;
  margin: 0 0 8px;
}

.graphique {
  position: relative;
  width: 100%;
  height: 370px;
  margin-top: 20px;
}

.message-vide {
  padding: 60px 20px;
  text-align: center;
  color: #85858e;
  font-size: 14px;
}

@media (max-width: 600px) {
  .graphique-card {
    padding: 20px;
  }

  .graphique {
    height: 300px;
  }
}
</style> -->

