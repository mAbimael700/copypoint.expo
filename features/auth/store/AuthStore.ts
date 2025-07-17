import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { AuthUser } from "~/features/auth/types/AuthUser.type"
import AuthService from "~/features/auth/services/auth-service"

const ACCESS_TOKEN = 'thisisjustarandomstring'

interface AuthState {
    // Estado principal
    user: AuthUser | null
    accessToken: string
    isLoading: boolean
    isInitialized: boolean
    isAuthenticated: boolean // Ahora es estado normal, no getter
    error: string | null

    // Acciones
    setUser: (user: AuthUser | null) => void
    setAccessToken: (accessToken: string) => Promise<void>
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    updateAuthState: () => void // Helper para actualizar isAuthenticated

    // Métodos principales
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    loadUserProfile: () => Promise<boolean>
    initialize: () => Promise<void>
    reset: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    // Estado inicial
    user: null,
    accessToken: '',
    isLoading: true,
    isInitialized: false,
    isAuthenticated: false, // Estado normal
    error: null,

    // Helper para actualizar isAuthenticated
    updateAuthState: () => {
        const state = get()
        const isAuth = !!(state.accessToken && state.user)
        set({ isAuthenticated: isAuth })
    },

    // Acciones básicas
    setUser: (user) => {
        set({ user })
        get().updateAuthState()
    },

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    setAccessToken: async (accessToken) => {
        try {
            await AsyncStorage.setItem(ACCESS_TOKEN, accessToken)
            set({ accessToken })
            get().updateAuthState()
        } catch (error) {
            console.error('Error saving access token:', error)
            set({ error: 'Error guardando token' })
        }
    },

    // Método para cargar perfil del usuario
    loadUserProfile: async () => {
        const { accessToken } = get()
        if (!accessToken) return false

        try {
            const response = await AuthService.getUserProfile(accessToken)
            set({ user: response, error: null })
            get().updateAuthState()
            return true
        } catch (error) {
            console.error('Error loading user profile:', error)
            set({ error: 'Error cargando perfil' })
            get().updateAuthState()
            return false
        }
    },

    // Método de login
    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null })

            const response = await AuthService.login({ email, password })
            const token = response.token

            if (token) {
                await get().setAccessToken(token)
                const profileLoaded = await get().loadUserProfile()

                if (profileLoaded) {
                    set({ isLoading: false })
                    get().updateAuthState()
                    return true
                }
            }

            set({ isLoading: false, error: 'Login failed' })
            get().updateAuthState()
            return false
        } catch (error) {
            console.error('Login error:', error)
            set({ isLoading: false, error: 'Error en login' })
            get().updateAuthState()
            return false
        }
    },

    // Método de logout
    logout: async () => {
        const { accessToken } = get()

        try {
            set({ isLoading: true })

            // Invalidar token en el backend
            if (accessToken) {
                try {
                    await AuthService.logout(accessToken)
                } catch (error) {
                    console.warn('Error en logout del servidor:', error)
                }
            }

            // Limpiar estado local
            await get().reset()
        } catch (error) {
            console.error('Error en logout:', error)
            // Aun así, limpiar estado local
            await get().reset()
        } finally {
            set({ isLoading: false })
        }
    },

    // Método de reset
    reset: async () => {
        try {
            await AsyncStorage.removeItem(ACCESS_TOKEN)
            set({
                user: null,
                accessToken: '',
                error: null,
                isLoading: false,
                isAuthenticated: false
            })
        } catch (error) {
            console.error('Error resetting auth state:', error)
            set({
                user: null,
                accessToken: '',
                error: 'Error reseteando estado',
                isLoading: false,
                isAuthenticated: false
            })
        }
    },

    // Método de inicialización
    initialize: async () => {
        const state = get()

        // Evitar inicialización múltiple
        if (state.isInitialized) {
            console.log('🔄 Auth already initialized, skipping...')
            return
        }

        console.log('🚀 Initializing auth store...')
        set({ isLoading: true, isInitialized: true })

        try {
            // Cargar token desde AsyncStorage
            const storedToken = await AsyncStorage.getItem(ACCESS_TOKEN)
            console.log('🔑 Stored token:', storedToken ? 'found' : 'not found')

            if (storedToken) {
                // Actualizar token en el estado
                set({ accessToken: storedToken })

                // Intentar cargar perfil del usuario
                const profileLoaded = await get().loadUserProfile()

                if (!profileLoaded) {
                    console.log('❌ Profile loading failed, clearing token')
                    await AsyncStorage.removeItem(ACCESS_TOKEN)
                    set({ accessToken: '', user: null, isAuthenticated: false })
                }
            }

            console.log('✅ Auth initialization complete')
        } catch (error) {
            console.error('❌ Error initializing auth:', error)
            // En caso de error, limpiar estado
            await AsyncStorage.removeItem(ACCESS_TOKEN)
            set({
                accessToken: '',
                user: null,
                error: 'Error inicializando autenticación',
                isAuthenticated: false
            })
        } finally {
            set({ isLoading: false })
            get().updateAuthState()
        }
    }
}))

// Hook personalizado para usar el store
export const useAuth = () => {
    const store = useAuthStore()

    return {
        // Estado
        user: store.user,
        accessToken: store.accessToken,
        isLoading: store.isLoading,
        isInitialized: store.isInitialized,
        isAuthenticated: store.isAuthenticated,
        error: store.error,

        // Métodos
        login: store.login,
        logout: store.logout,
        loadUserProfile: store.loadUserProfile,
        initialize: store.initialize,
        reset: store.reset,
        setError: store.setError,
        setLoading: store.setLoading,
    }
}