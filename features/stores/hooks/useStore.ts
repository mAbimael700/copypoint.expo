// hooks/useStores.ts
import {useQuery} from '@tanstack/react-query'
import {useAuth} from '~/features/auth/store/AuthStore'
import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {StoreResponse} from "~/features/stores/types/Store.type";
import StoreService from "~/features/stores/services/StoreService";

// Puedes definir una key reutilizable para el cache
const STORES_QUERY_KEY = ['stores']

export const useStores = () => {
    const {accessToken} = useAuth()

    // ✅ Usar useQuery directamente, no devolver una función
    const getAllQuery = useQuery<PageResponse<StoreResponse>>({
        queryKey: STORES_QUERY_KEY,
        queryFn: () => StoreService.getAll(accessToken ?? ''),
        enabled: !!accessToken, // Solo ejecutar si hay token
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return {
        data: getAllQuery.data,
        isLoading: getAllQuery.isLoading,
        isSuccess: getAllQuery.isSuccess,
        error: getAllQuery.error,
        refetch: getAllQuery.refetch
    }
}