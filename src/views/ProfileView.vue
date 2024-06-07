<script setup lang="ts">
import type { AxiosInstance } from 'axios'
import { inject } from 'vue'
import router from '@/router'
import swal from 'sweetalert2'
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();
const axiosRequest = inject('AxiosRequest') as AxiosInstance

if (!auth.isAuthenticated) {
    axiosRequest.get('user')
    .then(response => {
        auth.setUser(response.data.jwt, response.data.user)
    })
    .catch(() => {
        router.push({path: '/login'})
        auth.logout()
    })
}

function updateUser(event: Event) {
    swal.fire({
        title: 'Are you sure?',
        text: 'You are about to update your profile',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update',
        cancelButtonText: 'No, cancel'
    }).then(result => {
        if (result.isConfirmed) {
            submitUpdate(event)
        }
    })
}

function submitUpdate(event: Event) {
    const formData = new FormData(event.target as HTMLFormElement)
    axiosRequest.put('user', formData)
    .then(response => {
        auth.setUser(response.data.jwt, response.data.user)
        swal.fire('Success', 'Profile updated successfully', 'success')
    })
    .catch(error => {
        console.error(error.response)
        swal.fire('Error', 'An error occurred while updating your profile', 'error')
    })
}

</script>

<template>
    <main>
        <div class="flex justify-center mt-5">
            <div class="w-2/6">
                <h1 class="font-semibold text-3xl pt-10 pb-10">Profile</h1>

                <div v-if="auth.user">
                    <form @submit.prevent="updateUser" class="space-y-6">
                        <div class="flex justify-center">
                            <label for="first_name" class="text-right font-semibold p-2 w-1/3">First Name:</label>
                            <input type="text" name="first_name" id="first_name" :value="auth.user.first_name" class="border border-gray-300 rounded-md p-2 w-2/5" />
                        </div>

                        <div class="flex justify-center">
                            <label for="last_name" class="text-right font-semibold p-2 w-1/3">Last Name:</label>
                            <input type="text" name="last_name" id="last_name" :value="auth.user.last_name" class="border border-gray-300 rounded-md p-2 w-2/5" />
                        </div>

                        <div class="flex justify-center">
                            <label for="email" class="text-right font-semibold p-2 w-1/3">Email:</label>
                            <input type="email" name="email" id="email" :value="auth.user.email" class="border border-gray-300 rounded-md p-2 w-2/5" />
                        </div>

                        <div class="flex justify-center">
                            <label for="phone" class="text-right font-semibold p-2 w-1/3">Phone:</label>
                            <input type="text" name="phone" id="phone" :value="auth.user.phone" class="border border-gray-300 rounded-md p-2 w-2/5" />
                        </div>

                        <div class="flex justify-center">
                            <button type="submit" class="bg-indigo-500 text-white rounded-md p-2 mt-5 w-2/3">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>