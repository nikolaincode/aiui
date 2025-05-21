<template>
  <div class="image-widget">
    <div v-if="content" class="image-container">
      <img :src="content" :alt="altText" class="widget-image" />
    </div>
    <div v-else class="image-placeholder">
      No image available
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  content: string
  altText?: string
}>()
</script>

<style scoped>
.image-widget {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.widget-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.image-placeholder {
  color: #666;
  font-size: 14px;
  text-align: center;
}
.widget table {
  font-size: 12px;
}
</style> 