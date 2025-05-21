<template>
  <div class="code-widget">
    <div v-if="content" class="code-container">
      <pre><code v-html="content"></code></pre>
    </div>
    <div v-else class="code-placeholder">
      No code available
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
.code-widget {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-container pre {
  width: 100%;
  margin: 0;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.code-placeholder {
  color: #666;
  font-size: 14px;
  text-align: center;
}
</style> 