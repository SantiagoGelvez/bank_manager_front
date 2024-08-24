<script setup lang="ts">
import apiClient from '@/plugins/axios'

import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'
import { CurrencyDollarIcon, BanknotesIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon, ArchiveBoxArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'
import swal from 'sweetalert2'
import Loader from './Loader.vue'
import router from '@/router'


interface Account {
	account_type: {
		name: string
	},
	account_number: string,
	total_balance: number,
	account_name: string,
	uuid: string
	actual_status: {
		name: string
	}
}

interface AccountType {
	code: string,
	name: string
}

const auth = useAuthStore()

const isOpenNewAccount = ref(false)
const isOpenDeposit = ref(false)
const isOpenWithdraw = ref(false)
const accountSelected = ref<Account | null>(null)

let accounts = ref<Account[]>([])
let accountTypes = ref<AccountType[]>([])
let loading = ref(false)

function closeModalNewAccount() {
	isOpenNewAccount.value = false
}
function openModalNewAccount() {
	isOpenNewAccount.value = true
}

function closeModalDeposit() {
	isOpenDeposit.value = false
	accountSelected.value = null
}
function openModalDeposit(accountUuid: string) {
	isOpenDeposit.value = true
	accountSelected.value = findAccountByUuid(accountUuid)
}

function closeModalWithdraw() {
	isOpenWithdraw.value = false
	accountSelected.value = null
}

function openModalWithdraw(accountUuid: string) {
	isOpenWithdraw.value = true
	accountSelected.value = findAccountByUuid(accountUuid)
}

function findAccountByUuid(uuid: string): Account | null {
    return accounts.value.find(account => account.uuid === uuid) || null;
}

async function getBankAccounts() {
	await auth.checkAuth()

	if (auth.isAuthenticated) {
		loading.value = true
		
		await apiClient.get('accounts')
		.then(response => {
			loading.value = false
			accounts.value = response.data
		})
	} else {
		router.push({path: '/'})
		auth.logout()
	}
}

function toCurrency(value: number) {
	return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(value)
}

function makeDeposit(event: Event) {
	loading.value = true
	const formData = new FormData(event.target as HTMLFormElement)
	
	if (!accountSelected.value) {
		swal.fire('Error', 'An error occurred while making the deposit', 'error')
		return
	}

	apiClient.post(`accounts/${accountSelected.value.uuid}/deposit`, formData)
	.then(() => {
		swal.fire('Success', 'Deposit made successfully', 'success')
		closeModalDeposit()
		getBankAccounts()
	})
	.catch(error => {
		swal.fire('Error', 'An error occurred while making the deposit', 'error')
		console.error(error)
	})
}

function makeWithdraw(event: Event) {
	loading.value = true
	const formData = new FormData(event.target as HTMLFormElement)

	if (!accountSelected.value) {
		swal.fire('Error', 'An error occurred while making the withdraw', 'error')
		return
	}

	apiClient.post(`accounts/${accountSelected.value.uuid}/withdraw`, formData)
	.then(() => {
		swal.fire('Success', 'Withdraw made successfully', 'success')
		closeModalWithdraw()
		getBankAccounts()
	})
	.catch(error => {
		swal.fire('Error', 'An error occurred while making the withdraw', 'error')
		console.error(error)
	})
}

async function getAccountTypes() {
	const response = await apiClient.get('accounts/types')
	accountTypes.value = response.data
}

function addNewAccount(event: Event) {
	loading.value = true
	const formData = new FormData(event.target as HTMLFormElement)
	apiClient.post('accounts/register', formData)
	.then(() => {
		loading.value = false
		swal.fire('Success', 'Account created successfully', 'success')
		closeModalNewAccount()
		getBankAccounts()
	})
	.catch(error => {
		loading.value = false
		swal.fire('Error', 'An error occurred while creating the account', 'error')
		console.error(error)
	})
}

onMounted(() => {
	getBankAccounts()	
	getAccountTypes()
})
</script>

<template>
	<Loader v-if="loading" />
	
	<main v-if="auth.isAuthenticated">
		<h1 class="text-center text-xl pt-10 pb-3"><span class="font-semibold">Hi {{ auth.user?.first_name || auth.user?.username }}!</span> Welcome to your bank accounts</h1>
		<div class="flex justify-center mt-5">
			<table class="table-fixed divide-y-4 w-3/4 text-center">
				<thead>
					<tr>
						<th class="px-4 py-2">Account Type</th>
						<th class="px-4 py-2">Account Number</th>
						<th class="px-4 py-2">Account Name</th>
						<th class="px-4 py-2">Account Status</th>
						<th class="px-4 py-2">Balance</th>
						<th class="px-4 py-2">Actions</th>
					</tr>
				</thead>
				<tbody v-if="accounts.length" class="divide-y">
					<tr v-for="account in accounts" class="py-2 my-2">
						<td class="px-4 py-2">{{ account.account_type.name }}</td>
						<td class="px-4 py-2">{{ account.account_number }}</td>
						<td class="px-4 py-2">{{ account.account_name }}</td>
						<td class="px-4 py-2">{{ account.actual_status.name }}</td>
						<td class="px-4 py-2">{{ toCurrency(account.total_balance) }}</td>
						<td class="px-4 py-2 flex justify-evenly">
							<div class="has-tooltip">
								<span class="tooltip rounded ring-1 ring-indigo-600 text-sm shadow-lg p-1 bg-white -mt-8">Deposit</span>
								<button @click="openModalDeposit(account.uuid)" class="border font-semibold text-gray-900 shadow-sm px-3 py-1.5 rounded-md text-sm hover:bg-indigo-600 hover:text-white">
									<ArrowPathIcon class="h-5 w-5" />
								</button>
							</div>

							<div class="has-tooltip">
								<span class="tooltip rounded ring-1 ring-indigo-600 text-sm shadow-lg p-1 bg-white -mt-8">Withdraw</span>
								<button @click="openModalWithdraw(account.uuid)" class="border font-semibold text-gray-900 shadow-sm px-3 py-1.5 rounded-md text-sm hover:bg-indigo-600 hover:text-white">
									<ArchiveBoxArrowDownIcon class="h-5 w-5" />
								</button>
							</div>

							<div class="has-tooltip">
								<span class="tooltip rounded ring-1 ring-indigo-600 text-sm shadow-lg p-1 bg-white -mt-8">Transactions</span>
								<button @click="router.push({name: 'transactions', params: {uuid: account.uuid}})" class="border font-semibold text-gray-900 shadow-sm px-3 py-1.5 rounded-md text-sm hover:bg-indigo-600 hover:text-white">
								<ArrowsUpDownIcon class="h-5 w-5" />
							</button>
							</div>
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td class="text-center px-4 py-2" colspan="6">
							<p class="my-5">You don't have any accounts yet</p>
						</td>
					</tr>
				</tbody>
				<tbody>
					<tr>
						<td class="text-center px-4 py-2" colspan="6">
							<button @click="openModalNewAccount" class="border my-5 bg-indigo-600 font-semibold text-white shadow-sm px-3 py-1.5 rounded-md text-sm">Add account</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<!-- Modals -->
		
		<TransitionRoot appear :show="isOpenNewAccount" as="template">
			<Dialog as="div" @close="closeModalNewAccount" class="relative z-10">
				<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
					<div class="fixed inset-0 bg-black/25" />
				</TransitionChild>
				<div class="fixed inset-0 overflow-y-auto">
					<div class="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
							<DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
								<DialogTitle as="h3" class="text-xl text-center font-medium leading-6 text-gray-900">
									Add a new account
								</DialogTitle>

								<DialogDescription as="div" class="mt-6 p-2">
									<form @submit.prevent="addNewAccount">
										<div>
											<label for="account_type" class="block text-sm font-medium leading-6 text-gray-900">Account Type</label>
											<div class="mb-3">
												<select name="account_type" id="account_type" class="w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
													<option v-for="accountType in accountTypes" :value="accountType.code">{{ accountType.name }}</option>
												</select>
											</div>
										</div>

										<div>
											<label for="account_number" class="block text-sm font-medium leading-6 text-gray-900">Account Number</label>
											<div class="mb-3">
												<input id="account_number" name="account_number" type="text" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div>
											<label for="account_name" class="block text-sm font-medium leading-6 text-gray-900">Account Name</label>
											<div class="mb-3">
												<input id="account_name" name="account_name" type="text" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div>
											<label for="balance" class="block text-sm font-medium leading-6 text-gray-900">Balance</label>
											<div class="mb-3">
												<input id="balance" name="balance" type="number" required="true" min="0" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div class="pt-6">
											<button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Account</button>
										</div>
									</form>
								</DialogDescription>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</TransitionRoot>

		<TransitionRoot appear :show="isOpenDeposit" as="template">
			<Dialog as="div" @close="closeModalDeposit" class="relative z-10">
				<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
					<div class="fixed inset-0 bg-black/25" />
				</TransitionChild>
				<div class="fixed inset-0 overflow-y-auto">
					<div class="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
							<DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
								<DialogTitle as="h3" class="text-xl text-center font-medium leading-6 text-gray-900">
									<div class="flex justify-center mb-4">
										<CurrencyDollarIcon class="h-10 w-10 text-yellow-500" />
									</div>
									Deposit money
								</DialogTitle>

								<DialogDescription as="div" class="mt-6 p-2" v-if="accountSelected">
									<form @submit.prevent="makeDeposit">
										<div>
											<label for="account_number" class="block text-sm font-medium leading-6 text-gray-900">Account Number</label>
											<div class="mb-3">
												<input id="account_number" name="account_number" type="text" :value="accountSelected.account_number" disabled class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div>
											<label for="account_name" class="block text-sm font-medium leading-6 text-gray-900">Account Name</label>
											<div class="mb-3">
												<input id="account_name" name="account_name" type="text" :value="accountSelected.account_name" disabled class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div>
											<label for="amount" class="block text-sm font-medium leading-6 text-gray-900">Amount</label>
											<div class="mb-3">
												<input id="amount" name="amount" type="number" required="true" min="1" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div class="pt-6">
											<button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Deposit</button>
										</div>
									</form>
								</DialogDescription>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</TransitionRoot>

		<TransitionRoot appear :show="isOpenWithdraw" as="template">
			<Dialog as="div" @close="closeModalWithdraw" class="relative z-10">
				<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
					<div class="fixed inset-0 bg-black/25" />
				</TransitionChild>
				<div class="fixed inset-0 overflow-y-auto">
					<div class="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
							<DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
								<DialogTitle as="h3" class="text-xl text-center font-medium leading-6 text-gray-900">
									<div class="flex justify-center mb-4">
										<BanknotesIcon class="h-10 w-10 text-green-500" />
									</div>
									Withdraw cash
								</DialogTitle>

								<DialogDescription as="div" class="mt-6 p-2" v-if="accountSelected">
									<form @submit.prevent="makeWithdraw">
										<div>
											<label for="account_number" class="block text-sm font-medium leading-6 text-gray-900">Account Number</label>
											<div class="mb-3">
												<input id="account_number" name="account_number" type="text" :value="accountSelected.account_number" disabled  class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div>
											<label for="account_name" class="block text-sm font-medium leading-6 text-gray-900">Account Name</label>
											<div class="mb-3">
												<input id="account_name" name="account_name" type="text" :value="accountSelected.account_name" disabled class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div>
											<label for="amount" class="block text-sm font-medium leading-6 text-gray-900">Balance</label>
											<div class="mb-3">
												<input id="amount" name="amount" type="number" required="true" min="1" :max="accountSelected.total_balance" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
											</div>
										</div>

										<div class="pt-6">
											<button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Withdraw</button>
										</div>
									</form>
								</DialogDescription>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</TransitionRoot>
	</main>
	
	<div v-else>
		<h1 class="text-center font-semibold text-xl pt-10 pb-3">You are not logged in</h1>
		<div class="flex justify-center">
			<button @click="router.push({path: '/login'})" class="border m-1.5 px-3 py-1.5 rounded-md text-sm">Login</button>
			<button @click="router.push({path: '/signup'})" class="border m-1.5 bg-indigo-600 font-semibold text-white shadow-sm px-3 py-1.5 rounded-md text-sm">Sign Up</button>
		</div>
	</div>
</template>
