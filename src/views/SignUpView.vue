<script setup lang="ts">
import SignUp from '../components/forms/SignUp.vue'
import { useRouter } from 'vue-router';

const router = useRouter()

function validateSignup(response: any) {
	console.log("The user has been created successfully!")
	if (response.status === 201) {
		console.log("Will redirect to login page...")
		router.push({
			name: 'login',
			query: { signup: 'true' }
		})
	} else {
		console.error(response)
	}
}
</script>

<template>
	<main>		
		<div class="h-screen">
			<SignUp @validate-signup="validateSignup" />
		</div>
	</main>
</template>