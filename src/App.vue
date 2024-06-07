<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/authStore'
import type { AxiosInstance } from 'axios'
import { inject, ref } from 'vue'
import Loader from './components/Loader.vue';

const auth = useAuthStore()
const axiosRequest = inject('AxiosRequest') as AxiosInstance

let loading = ref(false)

if (!auth.isAuthenticated) {
    loading.value = true
    axiosRequest.get('user')
    .then(response => {
        auth.setUser(response.data.jwt, response.data.user)
    })
    .catch(() => {
        auth.logout()
    })
    .finally(() => {
        loading.value = false
    })
}
</script>

<template>
  <div>
    <Loader v-if="loading" />
    <main class="h-screen" v-else>
      <Navbar />
      <RouterView />
    </main>
  </div>
</template>