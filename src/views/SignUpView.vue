<script setup lang="ts">
import SignUp from '../components/forms/SignUp.vue'
import { useRouter } from 'vue-router';

const router = useRouter()

function validateSignup(response: any) {
	if (response.status === 201) {
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
		<div class="h-full">
			<SignUp @validate-signup="validateSignup" />
		</div>
	</main>
</template>