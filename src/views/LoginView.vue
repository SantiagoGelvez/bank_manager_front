<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

let userAutenticated = ref(false)
let username = ref('')

async function userLogin(event) {
	const formData = new FormData(event.target)
	
	try {
		const response = await axios.post('http://localhost:8000/api/login', formData)
		if (response.status === 200) {
			
			userAutenticated.value = true
			username.value = formData.get('username')
		}
	} catch (error) {
		console.error(error)
	}
}
</script>

<template>
	<main>
		<div v-if="userAutenticated">
			<p>Welcome back, {{ username }}</p>
		</div>
		
		<div v-else>
			<h1>Login</h1>
			<form @submit.prevent="userLogin">
				<label for="username">Username</label>
				<input type="text" id="username" name="username" />
				
				<label for="password">Password</label>
				<input type="password" id="password" name="password" />
				
				<button type="submit">Login</button>
			</form>
		</div>
	</main>
</template>