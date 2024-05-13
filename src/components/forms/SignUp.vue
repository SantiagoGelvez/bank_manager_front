<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router';
import Loader from '@/components/Loader.vue'

const emit = defineEmits(['validate-signup'])
let authenticationError = ref('')
let loading = ref(false)

function signUpUser(event: Event) {
    loading.value = true
    const formData = new FormData(event.target as HTMLFormElement)
    
    axios.post('http://localhost:8000/api/signup', formData)
    .then(response => {
        loading.value = false
        emit('validate-signup', response)
    })
    .catch(error => {
        loading.value = false
        if (error.response.status === 400) {
            if (error.response.data && error.response.data.username) {
                authenticationError.value = error.response.data.username[0]
            } else if (error.response.data && error.response.data.email) {
                authenticationError.value = error.response.data.email[0]
            } else {
                authenticationError.value = error.response.data.detail
            }
        } else if (error.response.status === 403) {
            authenticationError.value = error.response.data.detail
        }
        console.error(error)
    })
}
</script>

<template>
    <Loader v-if="loading"/>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your own account</h2>
        </div>

        <div class="sm:mx-auto sm:w-full sm:max-w-sm pt-6 block text-sm font-medium leading-6 text-red-600">
            {{ authenticationError }}
        </div>
        
        <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-4" @submit.prevent="signUpUser">
                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                    <div class="mt-2">
                        <input id="username" name="username" type="text" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                        <div class="mt-2">
                            <input id="first-name" name="first_name" type="text" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                        <div class="mt-2">
                            <input id="last-name" name="last_name" type="text" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <div class="mt-2">
                        <input id="email" name="email" type="email" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <div class="mt-2">
                        <input id="password" name="password" type="password" required="true" autocomplete="off" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                
                <div class="pt-6">
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
                </div>
            </form>

            <div class="mt-3">
                <button @click="router.push({path: '/login'})" class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm border hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login into your account</button>
            </div>
        </div>
    </div>
</template>