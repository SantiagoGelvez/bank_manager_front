<script setup lang="ts">
import { ref } from 'vue'
import Login from '../components/forms/Login.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

let routeQuerySignup = ref('')
if (typeof route.query.signup === 'string') {
	routeQuerySignup.value = route.query.signup
}

function validateLogin(response: any) {
	if (response.status === 200) {
		router.push({
			name: 'home',
			query: { authenticated: 'true' }
		})
	} else {
		console.error(response)
	}
}
</script>

<template>
	<main>		
		<div class="h-screen">
			<Login :signUpConfirmed="routeQuerySignup" @validate-login="validateLogin" />
		</div>
	</main>
</template>