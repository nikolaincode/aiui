<template>
  <div class="document-widget" :class="{ 'document-widget--preview': preview }">
    <h3 class="document-title">{{ content.title }}</h3>
    <div class="document-content">{{ content.text }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: {
    title: string
    text: string
  }
  preview?: boolean
}>()
</script>

<style scoped>
.document-widget {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
}

.document-widget--preview {
  max-height: 150px;
}

.document-title {
  margin: 0 0 12px;
  font-size: 1.1rem;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaeaea;
}

.document-content {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #444;
  flex: 1;
  white-space: pre-wrap;
}
</style> 