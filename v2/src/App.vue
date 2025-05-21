<script setup lang="ts">
import SpacesManager from './components/SpacesManager.vue'
import CollaborationPanel from './components/CollaborationPanel.vue'
</script>

<template>
  <div class="app">
    <SpacesManager />
    <CollaborationPanel />
    </div>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  height: 100%;
  overflow: hidden;
  background-color: #f9f9f9;
  color: #333;
}

table {
  font-size: 15px;
}

.ai-chat__message table {
  font-size: 12px;
}

table th {
  padding: 12px 16px;
  font-weight: 700;
}

.ai-chat__message th {
  background-color: #f6f6f6;
  padding: 10px 10px;
}

table td {
  padding: 10px 20px;
}

.ai-chat__message td {
  padding: 8px 8px;
}

.app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Manrope', sans-serif;
  padding: 2rem;
}

:root {
  --primary-color: #4c6ef5;
  --primary-hover: #364fc7;
  --text-color: #333;
  --text-light: #666;
  --border-color: #eaeaea;
  --background-light: #f9f9f9;
  --background-white: #ffffff;
  --shadow-small: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-large: 0 8px 30px rgba(0, 0, 0, 0.12);
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;
}

button {
  font-family: inherit;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
