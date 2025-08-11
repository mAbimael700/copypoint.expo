import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {useAuth} from "~/features/auth/store/AuthStore";
import {ExchangeRateCurrencyResponse} from "~/features/currency/types/ExchangeRate.type";
import ExchangeRateService from "~/features/currency/service/ExchangeRateService";

// Query keys para mantener consistencia
export const exchangeRateKeys = {
    all: ['exchangeRate'] as const,
    codes: () => [...exchangeRateKeys.all, 'codes'] as const,
    latest: () => [...exchangeRateKeys.all, 'latest'] as const,
    latestByCurrency: (currency: string) =>
        [...exchangeRateKeys.latest(), currency] as const,
}

// Hook para obtener todos los códigos de moneda
export const useExchangeRateCodes = (
    accessToken: string
): UseQueryResult<ExchangeRateCurrencyResponse, Error> => {
    // @ts-ignore
    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: exchangeRateKeys.codes(),
        queryFn: () => ExchangeRateService.getAllCodes(accessToken),
        staleTime: 1000 * 60 * 60 * 24, // 24 horas - los códigos no cambian frecuentemente
        gcTime: 1000 * 60 * 60 * 24, // 24 horas en caché
        //cacheTime: 1000 * 60 * 60 * 24, // 24 horas en caché
        refetchOnMount: false, // No recargar al montar
        refetchOnWindowFocus: false, // No recargar al enfocar ventana
    })
}


// Hook compuesto para casos donde necesites ambos datos
export const useExchangeRateData = () => {
    const {accessToken} = useAuth()
    const codesQuery = useExchangeRateCodes(accessToken)

    const refetch = () => {
        return codesQuery.refetch();
    };

    return {
        currencies: codesQuery.data || [],
        //rates: ratesQuery,
        isLoading: codesQuery.isLoading,
        isError: codesQuery.isError,
        error: codesQuery.error,
        refetch
    }
}

// Tipos de utilidad para mayor comodidad
export type ExchangeRateCodesQuery = ReturnType<typeof useExchangeRateCodes>
//export type LatestExchangeRateQuery = ReturnType<typeof useLatestExchangeRate>
export type ExchangeRateDataQuery = ReturnType<typeof useExchangeRateData>
