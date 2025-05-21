<template>
  <div class="table-widget">
    <div v-if="content" class="table-container">
      <div v-html="content"></div>
    </div>
    <div v-else class="table-placeholder">
      No table data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  content: string
}>()
</script>

<style scoped>
.table-widget {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-placeholder {
  color: #666;
  font-size: 14px;
  text-align: center;
}
</style> 