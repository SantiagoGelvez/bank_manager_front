import { defineStore } from 'pinia'
import apiClient from '@/plugins/axios'

interface User{
    id: number
    uuid: string
    username: string
    first_name: string
    last_name: string
    email: string
    phone: string
}

interface AuthState {
    user: User | null
    token: string | null
}

export const useAuthStore = defineStore('authStore', {
    state: (): AuthState => ({
        user: null,
        token: null,
    }),

    actions: {
        async login(credentials: {username: string; password: string}) {
            try {
                const response = await apiClient.post('login', credentials)
                this.user = response.data.user
                this.token = response.data.jwt
            } catch (error) {
                throw error
            }
        },

        async register(formData: FormData) {
            try {
                const response = await apiClient.post('signup', formData)
                this.user = response.data.user
                this.token = response.data.jwt
            } catch (error) {
                throw error
            }
        },

        async logout() {
            apiClient.post('logout')

            this.user = null
            this.token = null

            window.location.href = '/'
        },

        async checkAuth() {
            try {
                const response = await apiClient.get('user')

                this.user = response.data.user
                this.token = response.data.jwt
            } catch (error) {
                this.logout()
            }
        },

        updateUser(user: User) {
            this.user = user
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.user
    }
})
