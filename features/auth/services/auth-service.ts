
import {AuthUser} from "~/features/auth/types/AuthUser.type";
import ApiHttpClient from "~/features/api/ApiHttpClient";
import {SignInResponse} from "~/features/auth/types/SignInResponse.type";
import {LoginCredentials, SignUpResponse, UserCreationDto} from "~/features/auth/types/LoginCredential.type";

export default class AuthService {
    private static readonly endpoint = '/auth'

    static async login(credentials: LoginCredentials) {
        try {
            const response = await ApiHttpClient.post<SignInResponse>(`${this.endpoint}/sign-in`, credentials);
            return response.data
        } catch (error) {
            console.error('Sign-in error:', error);
            throw new Error('Sign-in error. Verify your credentials.');
        }
    }

    static async signup(data: UserCreationDto) {
        try {
            const response = await ApiHttpClient.post<SignUpResponse>(`${this.endpoint}/sign-up`, data);
            return response.data
        } catch (error) {
            console.error('Sign-un error:');
            throw new Error('Sign-un error. Verify your information.');
        }
    }


    /**
     * Obtiene el perfil del usuario autenticado
     */
    static async getUserProfile(accessToken: string): Promise<AuthUser> {
        try {
            const response = await ApiHttpClient.get<AuthUser>(
                `${this.endpoint}/my-profile`,
                {headers: {'Authorization': `Bearer ${accessToken}`}});

            return response.data;

        } catch (error: any) {
            console.error('Error obteniendo perfil:', error);

            if (error.response?.status === 401) {
                throw new Error('Token inválido o expirado');
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para acceder a esta información');
            }

            throw new Error('Error al obtener el perfil del usuario');
        }
    }

    /**
     * Cierra la sesión del usuario
     */
    static async logout(accessToken: string): Promise<void> {
        try {
            await ApiHttpClient.post(
                `${this.endpoint}/logout`, {},
                {headers: {'Authorization': `Bearer ${accessToken}`}});

        } catch (error) {
            // No lanzamos error aquí porque el logout local debe funcionar
            // incluso si el logout del servidor falla
            console.warn('Error en logout del servidor:', error);
        }
    }

}