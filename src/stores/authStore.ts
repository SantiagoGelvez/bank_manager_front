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
                console.log('Error in loggin in:', error)
                throw error
            }
        },

        async register(userData: { username: string; firstName: string; lastName: string, email: string; password: string }) {
            try {
                const response = await apiClient.post('register', userData)
                this.user = response.data.user
                this.token = response.data.jwt
            } catch (error) {
                console.error('Error registering:', error)
                throw error
            }
        },

        async logout() {
            const response = await apiClient.post('logout')

            this.user = null
            this.token = null
        },

        async checkAuth() {
            try {
                const response = await apiClient.get('user')
                this.user = response.data.user
                this.token = response.data.jwt
            } catch (error) {
                console.error('Error fetching user data:', error)
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
