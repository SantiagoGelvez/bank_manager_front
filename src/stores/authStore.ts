import { defineStore } from 'pinia'
import axios  from 'axios'

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        token: null as string | null,
        user: null as any | null,
    }),
    getters: {
        isAuthenticated(state) {
            return !!state.user
        }
    },
    actions: {
        login(token: string, user: any) {
            this.token = token
            this.user = user
        },
        setUser(token: string, user: any) {
            this.token = token
            this.user = user
        },
        logout() {
            this.token = null
            this.user = null
        }
    }
})
