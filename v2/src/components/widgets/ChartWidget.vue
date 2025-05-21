<template>
  <div class="chart-widget">
    <div v-if="content" class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div v-else class="chart-placeholder">
      No chart data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// Register all Chart.js components
Chart.register(...registerables)

const props = defineProps<{
  content: any
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const renderChart = () => {
  if (!chartCanvas.value || !props.content) return

  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy()
  }

  // Create new chart with enhanced configuration
  chart = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: props.content.data.labels,
      datasets: props.content.data.datasets.map((dataset: any) => ({
        ...dataset,
        type: 'bar',
        borderRadius: 4,
        barThickness: 'flex',
        maxBarThickness: 20,
        backgroundColor: 'rgba(76, 110, 245, 0.8)',
        borderColor: 'rgba(76, 110, 245, 1)',
        borderWidth: 1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#666',
            font: {
              family: 'Manrope',
              size: 12,
              weight: 500
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          usePointStyle: true,
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#666',
            font: {
              family: 'Manrope',
              size: 11
            },
            maxRotation: 45,
            minRotation: 45,
            padding: 8,
            maxTicksLimit: 10
          }
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: '#666',
            font: {
              family: 'Manrope',
              size: 11
            },
            padding: 8,
            stepSize: 5
          }
        }
      }
    }
  })
}

// Watch for content changes
watch(() => props.content, () => {
  renderChart()
}, { deep: true })

// Initialize chart on mount
onMounted(() => {
  renderChart()
})

// Clean up chart on unmount
onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.chart-widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-container {
  width: 100%;
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: #666;
  font-size: 14px;
  text-align: center;
  font-family: 'Manrope', sans-serif;
}
</style> 