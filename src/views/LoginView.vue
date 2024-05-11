<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import Login from '../components/forms/Login.vue'

const route = useRoute()

let routeQuerySignup = ref('')

if (typeof route.query.signup === 'string') {
	routeQuerySignup.value = route.query.signup
}
</script>

<template>
	<main>		
		<div class="h-full">
			<Login :signUpConfirmed="routeQuerySignup"/>
		</div>
	</main>
</template>