// Tipos para los parámetros
import {Service, ServiceCreationDTO} from "~/features/service/types/Service.type";
import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {useAuth} from '~/features/auth/store/AuthStore'
import {useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import ServiceService from "~/features/service/services/ServiceService";

interface ServicesQueryParams {
    storeId: number | string;
    enabled?: boolean;
}

interface ServicesByCopypointQueryParams {
    copypointId: number | string;
    enabled?: boolean;
}

interface CreateServiceParams {
    storeId: number | string;
    data: ServiceCreationDTO;
}

// Keys para el cache de queries
export const serviceKeys = {
    all: ['services'] as const,
    byStore: (storeId: number | string) => [...serviceKeys.all, 'store', storeId] as const,
    byCopypoint: (copypointId: number | string) => [...serviceKeys.all, 'copypoint', copypointId] as const,
    detail: (storeId: number | string, id: number | string) =>
        [...serviceKeys.byStore(storeId), 'detail', id] as const,
};

/**
 * Hook para obtener todos los copypoints de una tienda por storeId
 */
export const useServicesByStore = (
    params: ServicesQueryParams,
    options?: Omit<UseQueryOptions<PageResponse<Service>>, 'queryKey' | 'queryFn'>
) => {
    const {accessToken, isAuthenticated} = useAuth();

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: serviceKeys.byStore(params.storeId),
        queryFn: async (): Promise<PageResponse<Service>> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await ServiceService.getAllByStore(params.storeId, accessToken);
        },
        enabled: isAuthenticated && !!params.storeId && (params.enabled ?? true),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: (failureCount, error: any) => {
            // No reintentar si es error de autorización
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        ...options,
    });
};


/**
 * Hook para obtener todos los copypoints de una tienda por copypoint
 */
export const useServicesByCopypoint = (
    params: ServicesByCopypointQueryParams,
    options?: Omit<UseQueryOptions<PageResponse<Service>>, 'queryKey' | 'queryFn'>
) => {
    const {accessToken, isAuthenticated} = useAuth();

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: serviceKeys.byCopypoint(params.copypointId),
        queryFn: async (): Promise<PageResponse<Service>> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await ServiceService.getAllByCopypoint(params.copypointId, accessToken);
        },
        enabled: isAuthenticated && !!params.copypointId && (params.enabled ?? true),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: (failureCount, error: any) => {
            // No reintentar si es error de autorización
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        ...options,
    });
};


/**
 * Hook para crear un nuevo copypoint
 */
export const useCreateService = (
    options?: UseMutationOptions<Service, Error, CreateServiceParams>
) => {
    const queryClient = useQueryClient();
    const {accessToken} = useAuth();

    return useMutation({
        mutationFn: async (params: CreateServiceParams): Promise<Service> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await ServiceService.create(params.storeId, accessToken, params.data);
        },
        onSuccess: (data, variables) => {
            // Invalidar y actualizar cache
            queryClient.invalidateQueries({
                queryKey: serviceKeys.byStore(variables.storeId)
            });

            // Opcional: Actualizar cache optimísticamente
            queryClient.setQueryData<PageResponse<Service>>(
                serviceKeys.byStore(variables.storeId),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        content: [data, ...oldData.content],
                        totalElements: oldData.totalElements + 1,
                    };
                }
            );


        },
        onError: (error) => {
            console.error(`Error creating service: ${error.message}`);
        },
        ...options,
    });
};

/**
 * Hook principal que agrupa todas las funcionalidades
 */
export const useServiceByStoreOperations = (storeId: number | string) => {
    const {isAuthenticated} = useAuth();
    const queryClient = useQueryClient();

    // Query para obtener copypoints
    const servicessQuery = useServicesByStore({
        storeId,
        enabled: !!storeId && isAuthenticated
    });

    // Mutation para crear
    const createMutation = useCreateService();

    // Función para refrescar datos
    const refetch = () => {
        return servicessQuery.refetch();
    };

    // Función para invalidar cache
    const invalidateCache = () => {
        queryClient.invalidateQueries({
            queryKey: serviceKeys.byStore(storeId)
        });
    };

    // Función para crear copypoint
    const createService = (data: ServiceCreationDTO) => {
        return createMutation.mutateAsync({storeId, data});
    };

    // Estados derivados
    const isLoading = servicessQuery.isLoading;
    const isError = servicessQuery.isError;
    const isSuccess = servicessQuery.isSuccess;
    const data = servicessQuery.data;
    const error = servicessQuery.error;

    // Estados de mutación
    const isCreating = createMutation.isPending;
    const createError = createMutation.error;

    return {
        // Datos
        services: data?.content || [],
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,

        // Estados de query
        isLoading,
        isError,
        isSuccess,
        error,

        // Estados de mutación
        isCreating,
        createError,

        // Funciones
        createService,
        refetch,
        invalidateCache,

        // Query original (por si necesitas acceso completo)
        query: servicessQuery,
        createMutation,
    };
};

/**
 * Hook para prefetch de copypoints (útil para optimizaciones)
 */
export const usePrefetchServicesByStore = () => {
    const queryClient = useQueryClient();
    const {accessToken} = useAuth();

    const prefetchServices = async (storeId: number | string) => {
        if (!accessToken) return;

        await queryClient.prefetchQuery({
            // eslint-disable-next-line @tanstack/query/exhaustive-deps
            queryKey: serviceKeys.byStore(storeId),
            queryFn: () => ServiceService.getAllByStore(storeId, accessToken),
            staleTime: 5 * 60 * 1000,
        });
    };

    return {prefetchServices};
};