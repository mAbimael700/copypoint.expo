import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

const ACCESS_TOKEN = 'thisisjustarandomstring'

interface TokenState {
    token: string | null
    isLoading: boolean
    isInitialized: boolean // Agregar flag para evitar inicialización múltiple
    setToken: (token: string) => Promise<void>
    removeToken: () => Promise<void>
    getToken: () => string | null
    initialize: () => Promise<void>
    setLoading: (loading: boolean) => void
}

export const useTokenStore = create<TokenState>()((set, get) => ({
    token: null,
    isLoading: true,
    isInitialized: false,

    setToken: async (token: string) => {
        try {
            await AsyncStorage.setItem(ACCESS_TOKEN, token)
            set({ token })
        } catch (error) {
            console.error('Error saving access token:', error)
            throw error
        }
    },

    removeToken: async () => {
        try {
            await AsyncStorage.removeItem(ACCESS_TOKEN)
            set({ token: null })
        } catch (error) {
            console.error('Error removing access token:', error)
            throw error
        }
    },

    getToken: () => get().token,

    setLoading: (isLoading: boolean) => set({ isLoading }),

    initialize: async () => {
        const state = get()

        // Evitar inicialización múltiple
        if (state.isInitialized) {
            console.log('Token already initialized, skipping...')
            return
        }

        console.log('Initializing token store...')
        set({ isLoading: true })

        try {
            const storedToken = await AsyncStorage.getItem(ACCESS_TOKEN)
            console.log('Token loaded:', storedToken ? 'exists' : 'not found')
            set({
                token: storedToken,
                isLoading: false,
                isInitialized: true
            })
        } catch (error) {
            console.error('Error initializing token:', error)
            set({
                token: null,
                isLoading: false,
                isInitialized: true
            })
        }
    },
}))

export const useToken = () => useTokenStore((state) => ({
    token: state.token,
    setToken: state.setToken,
    removeToken: state.removeToken,
    getToken: state.getToken,
    initialize: state.initialize,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
}))