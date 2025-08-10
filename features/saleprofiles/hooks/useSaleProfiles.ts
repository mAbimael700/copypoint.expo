import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {SaleProfileResponse} from "~/features/saleprofiles/type/SaleProfile.type";

import {useQuery, UseQueryOptions} from '@tanstack/react-query'
import {useAuth} from '~/features/auth/store/AuthStore'
import {useSaleContext} from "~/features/sales/context/useSaleContext";
import {useCopypointContext} from "~/features/copypoints/context/useCopypointContext";

import SaleProfileService from "~/features/saleprofiles/services/SaleProfileService";

interface ProfilesSaleQueryBySaleParams {
    saleId: number
    copypointId: number
    enabled?: boolean
}

export const profileKeys = {
    all: ['sale-profiles'] as const,
    bySale: (copypointId: number | string, saleId: number | string) =>
        [
            ...profileKeys.all,
            'copypoint',
            copypointId,
            'sale',
            saleId || 'none',
        ] as const,
    detail: (
        copypointId: number | string,
        saleId: number | string,
        profileId: number | string
    ) =>
        [...profileKeys.bySale(copypointId, saleId), 'detail', profileId] as const,
}

export const useSaleProfilesBySale = (
    params: ProfilesSaleQueryBySaleParams,
    options?: Omit<
        UseQueryOptions<PageResponse<SaleProfileResponse>>,
        'queryKey' | 'queryFn'
    >
) => {
    const {accessToken, isAuthenticated} = useAuth()
    const {currentSale} = useSaleContext()
    return useQuery({
        // La queryKey ahora incluye el serviceId para que se actualice automáticamente
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: profileKeys.bySale(params.copypointId, params.saleId),
        queryFn: async (): Promise<PageResponse<SaleProfileResponse>> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible')
            }
            return await SaleProfileService.getBySaleId(
                params.copypointId,
                params.saleId,
                accessToken
            )
        },
        enabled:
            isAuthenticated &&
            !!params.saleId &&
            !!currentSale?.id && // Solo ejecutar si hay un servicio seleccionado
            (params.enabled ?? true),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: (failureCount, error: any) => {
            // No reintentar si es error de autorización
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false
            }
            return failureCount < 3
        },
        ...options,
    })
}

export default function useSaleProfiles() {
    const {currentSale} = useSaleContext()
    const {currentCopypoint} = useCopypointContext()

    const query = useSaleProfilesBySale({
        copypointId: currentCopypoint?.id || 0,
        saleId: currentSale?.id || 0,
        enabled: !!currentSale?.id,
    })

    return {
        saleProfiles: query.data?.content || [],
        totalElements: query.data?.totalElements || 0,
        totalPages: query.data?.totalPages || 0,
        isLoading: query.isLoading,
        isError: query.isError,
        isSuccess: query.isSuccess,
        error: query.error,
        refetch: query.refetch,
        query,
    }
}
