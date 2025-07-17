import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {LoginCredentials, UserCreationDto} from '~/features/auth/types/LoginCredential.type'
import AuthService from '~/features/auth/services/auth-service'
import {useToken} from "~/features/auth/store/TokenStore";
import { useMemo } from 'react';

// Query Keys
export const authKeys = {
    all: ['auth'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
}

// Hook para obtener el perfil del usuario
export const useUserProfile = (enabled: boolean = true) => {
    const { token } = useToken()

    return useQuery({
        queryKey: authKeys.profile(),
        queryFn: async () => {
            if (!token) throw new Error('No access token available')
            return await AuthService.getUserProfile(token)
        },
        enabled: !!token && enabled, // Solo ejecuta si hay token Y está habilitado
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: (failureCount, error: any) => {
            // No reintentar si es error 401 o 403
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false
            }
            return failureCount < 2
        },
    })
}

// Hook para login
export const useLogin = () => {
    const { setToken } = useToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            return await AuthService.login(credentials)
        },
        onSuccess: async (data) => {
            if (data.token) {
                await setToken(data.token)
                // Invalidar queries relacionadas con auth
                queryClient.invalidateQueries({ queryKey: authKeys.all })
            }
        },
        onError: (error) => {
            console.error('Login error:', error)
        },
    })
}

// Hook para signup
export const useSignup = () => {
    return useMutation({
        mutationFn: async (data: UserCreationDto) => {
            return await AuthService.signup(data)
        },
        onError: (error) => {
            console.error('Signup error:', error)
        },
    })
}

// Hook para logout
export const useLogout = () => {
    const { token, removeToken } = useToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            if (token) {
                try {
                    await AuthService.logout(token)
                } catch (error) {
                    console.warn('Error en logout del servidor:', error)
                }
            }
        },
        onSuccess: async () => {
            await removeToken()
            // Limpiar todas las queries del cache
            queryClient.clear()
        },
        onError: async (error) => {
            console.error('Logout error:', error)
            // Aun así, limpiar el token local
            await removeToken()
            queryClient.clear()
        },
    })
}

// Hook personalizado para el estado de autenticación - OPTIMIZADO
export const useAuth = (enableUserProfile: boolean = false) => {
    const { token, isLoading: tokenLoading } = useToken()
    const { data: user, isLoading: profileLoading, error } = useUserProfile(enableUserProfile)
    const loginMutation = useLogin()
    const logoutMutation = useLogout()
    const signupMutation = useSignup()

    // CLAVE: Usar useMemo para estabilizar isAuthenticated
    // Solo depende del token, no del usuario
    const isAuthenticated = useMemo(() => {
        return !!token
    }, [token])

    // isLoading solo depende del token, no del perfil
    const isLoading = useMemo(() => {
        return tokenLoading
    }, [tokenLoading])

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        signup: signupMutation.mutate,
        loginLoading: loginMutation.isPending,
        logoutLoading: logoutMutation.isPending,
        signupLoading: signupMutation.isPending,
        loginError: loginMutation.error,
        logoutError: logoutMutation.error,
        signupError: signupMutation.error,
        // Agregar información adicional para debugging
        profileLoading,
        hasUserData: !!user,
    }
}