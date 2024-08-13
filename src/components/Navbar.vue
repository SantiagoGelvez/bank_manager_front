<script setup lang="ts">
import swal from 'sweetalert2'
import { computed } from 'vue'

import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.isAuthenticated)
const fullName = computed(() => `${auth.user?.first_name} ${auth.user?.last_name}` || '')

const logout: any = (): void => {
   auth.logout()
}
</script>

<template>
    <nav class="flex justify-between p-4">
        <RouterLink to="/">
            <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
        </RouterLink>

        <div class="navbar-links space-x-5">
            <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
            <RouterLink v-if="!isAuthenticated" to="/signup">Signup</RouterLink>

            <div class="space-x-5" v-if="isAuthenticated">
                <span @click="router.push({path:'/profile'})">{{ fullName }}</span>
                <button @click="logout">Cerrar sesion</button>
            </div>
        </div>
    </nav>
</template>