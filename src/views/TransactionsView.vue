<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue';
import swal from 'sweetalert2';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Loader from '@/components/Loader.vue';

interface Account {
	account_type: {
		name: string
	},
	account_number: string,
	total_balance: number,
	account_name: string
}

interface Transaction {
	created_at: string,
	transaction_type: {
		name: string,
		code: string
	},
	amount: number,
	transaction_status: {
		name: string
	}
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const uuid = route.params.uuid
const account = ref<Account | null>(null)
const transactions = ref<Transaction[]>([])
const loading = ref(false)

if (!auth.isAuthenticated) {
    axios.get('http://localhost:8000/api/user', {withCredentials: true})
    .then(response => {
        auth.setUser(response.data.jwt, response.data.user)
    })
    .catch(() => {
        router.push({path: '/login'})
        auth.logout()
    })
}

function getTransactions() {
    axios.get(`http://localhost:8000/api/transactions/${uuid}`, {withCredentials: true})
    .then(response => {
        transactions.value = response.data
    })
	.catch(error => {
		if (error.response.status === 401) {
			swal.fire({
				title: 'Unauthorized',
				text: 'You are not authorized to view this page',
				icon: 'info',
				confirmButtonText: 'Retun to home'})
			.then(() => {
				router.push({name: 'home'})
			})
		}
		console.error(error.response)
	})
}

function getAccountDetails() {
	loading.value = true
	axios.get(`http://localhost:8000/api/accounts/${uuid}`, {withCredentials: true})
	.then(response => {
		loading.value = false
		account.value = response.data
	})
	.catch(error => {
		if (error.response.status === 401) {
			swal.fire({
				title: 'Unauthorized',
				text: 'You are not authorized to view this page',
				icon: 'info',
				confirmButtonText: 'Retun to home'})
			.then(() => {
				router.push({name: 'home'})
			})
		}
		console.error(error.response)
	})
}

function formatMoney(value: number) {
	return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(value)
}

function formatLongDateWithTime(date: string) {
	return new Date(date).toLocaleString('es-CO', {timeZone: 'America/Bogota'})
}

onMounted(() => {
    getTransactions()
	getAccountDetails()
})
</script>

<template>
    <main>
		<Loader v-if="loading" />

		<div v-else>
			<div class="text-center w-3/4 mx-auto pt-10 pb-0">
				<ArrowLeftIcon class="h-8 w-8 text-gray-500 cursor-pointer" @click="router.push({name: 'home'})" />
			</div>

			<div v-if="account" class="text-center w-3/4 mx-auto px-10">
				<div class="flex justify-evenly pb-8">
					<div>
						<div class="text-sm">Account Type</div>
						<div class="text-2xl">{{ account.account_type ? account.account_type.name : '' }}</div>
					</div>
		
					<div>
						<div class="text-sm">Account Number</div>
						<div class="font-semibold text-2xl">{{ account.account_number }}</div>
					</div>
					
					<div>
						<div class="text-sm">Total balance</div>
						<div class="font-semibold text-2xl">{{ formatMoney(account.total_balance) }}</div>
					</div>
	
					<div v-if="account.account_name">
						<div class="text-sm">Account Name</div>
						<div class="text-2xl">{{ account.account_name }}</div>
					</div>
				</div>
			</div>
	
			<div class="flex justify-center mt-5">
				<table class="table-fixed divide-y-4 w-3/4 text-center">
					<thead>
						<tr>
							<th class="px-4 py-2">Date created</th>
							<th class="px-4 py-2">Transaction type</th>
							<th class="px-4 py-2">Amount</th>
							<th class="px-4 py-2">Transaction Status</th>
						</tr>
					</thead>
					<tbody v-if="transactions.length" class="divide-y">
						<tr v-for="transaction in transactions" class="py-2 my-2">
							<td class="px-4 py-2">{{ formatLongDateWithTime(transaction.created_at) }}</td>
							<td class="px-4 py-2">{{ transaction.transaction_type.name }}</td>
							<td class="px-4 py-2 font-medium" :class="['WTH'].includes(transaction.transaction_type.code) ? 'text-red-600' : 'text-green-600'">{{ ['WTH'].includes(transaction.transaction_type.code) ? '-' : '' }} {{ formatMoney(transaction.amount) }}</td>
							<td class="px-4 py-2" >{{ transaction.transaction_status.name }}</td>
						</tr>
					</tbody>
					<tbody v-else>
						<tr>
							<td class="text-center px-4 py-2" colspan="5">
								<p class="my-5">You don't have any accounts yet</p>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
    </main>
</template>