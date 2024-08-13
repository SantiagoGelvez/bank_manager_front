<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router';

const auth = useAuthStore()
const router = useRouter()

const login = async (data: any) => {
    const formData = new FormData(data.target)
    const usernameValue = formData.get('username') as string | ''
    const passwordValue = formData.get('password') as string | ''

    try {
        await auth.login({username: usernameValue, password: passwordValue})
        router.push('/dashboard')
    } catch (error) {
        alert('Error al iniciar sesion')
    }
}
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login into your account</h2>
        </div>

        <!-- <div class="sm:mx-auto sm:w-full sm:max-w-sm pt-6 block text-sm font-semibold leading-6" :class="authenticationError ? 'text-red-600' : 'text-green-600'">
            {{ authenticationError ? authenticationError : signUpConfirmed ? 'Your account has been created successfully. Please login to continue.' : '' }}
        </div> -->
        
        <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="login">
                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                    <div class="mt-2">
                        <input id="username" name="username" type="text" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                
                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div class="text-sm">
                            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                        </div>
                    </div>
                    
                    <div class="mt-2">
                        <input id="password" name="password" type="password" required="true" class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                
                <div class="pt-6">
                    <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
                </div>
            </form>
            
            <div class="mt-3">
                <button @click="router.push({path: '/signup'})" class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm border hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Don't have an account? Create one</button>
            </div>
        </div>
    </div>
</template>