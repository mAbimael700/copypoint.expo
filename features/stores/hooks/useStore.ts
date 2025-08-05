// hooks/useStores.ts
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/features/auth/hooks/useAuth'
import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {StoreResponse} from "~/features/stores/types/Store.type";
import StoreService from "~/features/stores/services/StoreService";
// Puedes definir una key reutilizable para el cache
const STORES_QUERY_KEY = ['stores']

export const useStores = () => {
    const { token: accessToken } = useAuth()

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const getAll = () => useQuery<PageResponse<StoreResponse>>({
        queryKey: STORES_QUERY_KEY,
        queryFn: () => StoreService.getAll(accessToken ?? ''),
        enabled: !!accessToken, // Solo ejecutar si hay token
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return { getAll }
}

