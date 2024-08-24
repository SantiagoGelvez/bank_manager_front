<script setup lang="ts">
import { useAuthStore } from './stores/authStore'
import Navbar from './components/Navbar.vue';

import { RouterView } from 'vue-router'
const auth = useAuthStore()


</script>

<template>
	<div>
		<Navbar />
		<RouterView/>
	</div>
</template>