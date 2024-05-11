<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue';

</script>

<template>
  <main class="h-screen">
    <Navbar />
    <RouterView />
  </main>
</template>