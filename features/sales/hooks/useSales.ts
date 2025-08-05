// Tipos para los parámetros
import {SaleCreationDTO, SaleProfileCreationDTO, SaleResponse, SaleStatus} from "~/features/sales/types/Sale.type";
import {useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {useAuth} from "~/features/auth/hooks/useAuth";
import SaleService from "../services/SaleService";
import {useCopypointContext} from "~/features/copypoints/context/useCopypointContext";

interface SaleQueryParams {
    copypointId?: number | string;
    enabled?: boolean;
}

interface CreateSaleParams {
    copypoint: number | string;
    data: SaleCreationDTO;
}

interface AddProfileToSaleParams {
    copypointId: number | string;
    saleId: number | string;
    data: SaleProfileCreationDTO;
}

interface UpdateSaleStatusParams {
    copypointId: number | string;
    saleId: number | string;
    status: SaleStatus;
}

// Keys para el cache de queries
export const saleKeys = {
    all: ['sales'] as const,
    byCopypoint: (copypointId: number | string) =>
        [...saleKeys.all, 'copypoint', copypointId] as const,
    pending: (copypointId: number | string) =>
        [...saleKeys.byCopypoint(copypointId), 'pending'] as const,
    detail: (copypointId: number | string, id: number | string) =>
        [...saleKeys.byCopypoint(copypointId), 'detail', id] as const,
};

/**
 * Hook para obtener todas las ventas de un copypoint
 */
export const useSales = (
    params?: SaleQueryParams,
    options?: Omit<UseQueryOptions<PageResponse<SaleResponse>>, 'queryKey' | 'queryFn'>
) => {
    const {token: accessToken, isAuthenticated} = useAuth();
    const {currentCopypoint} = useCopypointContext();

    // Usar el copypoint del store si no se proporciona uno específico
    const copypointId = params?.copypointId || currentCopypoint?.id;

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: saleKeys.byCopypoint(copypointId!),
        queryFn: async (): Promise<PageResponse<SaleResponse>> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await SaleService.getSales(copypointId!, accessToken);
        },
        enabled: isAuthenticated &&
            !!copypointId &&
            (params?.enabled ?? true),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        ...options,
    });
};

/**
 * Hook para obtener las ventas pendientes de un copypoint
 */
export const usePendingSales = (
    params?: SaleQueryParams,
    options?: Omit<UseQueryOptions<PageResponse<SaleResponse>>, 'queryKey' | 'queryFn'>
) => {
    const {token: accessToken, isAuthenticated} = useAuth();
    const {currentCopypoint} = useCopypointContext();

    const copypointId = params?.copypointId || currentCopypoint?.id;

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: saleKeys.pending(copypointId!),
        queryFn: async (): Promise<PageResponse<SaleResponse>> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            try {
                return await SaleService.getPendingSales(copypointId!, accessToken);
            } catch (error: any) {
                console.error(error.message)
                throw error;
            }
        },
        enabled: isAuthenticated &&
            !!copypointId &&
            (params?.enabled ?? true),
        staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente para pendientes)
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        ...options,
    });
};

/**
 * Hook para crear una nueva venta
 */
export const useCreateSale = (
    options?: UseMutationOptions<SaleResponse, Error, CreateSaleParams>
) => {
    const queryClient = useQueryClient();
    const {token: accessToken} = useAuth();

    return useMutation({
        mutationFn: async (params: CreateSaleParams): Promise<SaleResponse> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await SaleService.create(params.copypoint, accessToken, params.data);
        },
        onSuccess: (data, variables) => {
            // Invalidar cache para el copypoint actual
            queryClient.invalidateQueries({
                queryKey: saleKeys.byCopypoint(variables.copypoint)
            });

            // Actualizar cache optimísticamente para todas las ventas
            queryClient.setQueryData<PageResponse<SaleResponse>>(
                saleKeys.byCopypoint(variables.copypoint),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        content: [data, ...oldData.content],
                        totalElements: oldData.totalElements + 1,
                    };
                }
            );

            // También invalidar pendientes si la venta creada está pendiente
            if (data.status === SaleStatus.PENDING) {
                queryClient.invalidateQueries({
                    queryKey: saleKeys.pending(variables.copypoint)
                });
            }

            console.log('Venta creada exitosamente');
        },
        onError: (error) => {
            console.error(`Error al crear la venta: ${error.message}`);
        },
        ...options,
    });
};

/**
 * Hook para agregar un perfil a una venta
 */
export const useAddProfileToSale = (
    options?: UseMutationOptions<SaleResponse, Error, AddProfileToSaleParams>
) => {
    const queryClient = useQueryClient();
    const {token: accessToken} = useAuth();

    return useMutation({
        mutationFn: async (params: AddProfileToSaleParams): Promise<SaleResponse> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await SaleService.addProfileToSale(
                params.copypointId,
                params.saleId,
                accessToken,
                params.data
            );
        },
        onSuccess: (data, variables) => {
            // Invalidar cache para refrescar los datos
            queryClient.invalidateQueries({
                queryKey: saleKeys.byCopypoint(variables.copypointId)
            });

            // Actualizar cache optimísticamente
            queryClient.setQueryData<PageResponse<SaleResponse>>(
                saleKeys.byCopypoint(variables.copypointId),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        content: oldData.content.map(sale =>
                            sale.id === variables.saleId ? data : sale
                        ),
                    };
                }
            );

            console.log('Perfil agregado a la venta exitosamente');
        },
        onError: (_) => {
            console.error(`Error al agregar perfil a la venta`);
        },
        ...options,
    });
};

/**
 * Hook para actualizar el estado de una venta
 */
export const useUpdateSaleStatus = (
    options?: UseMutationOptions<SaleResponse, Error, UpdateSaleStatusParams>
) => {
    const queryClient = useQueryClient();
    const {token: accessToken} = useAuth();

    return useMutation({
        mutationFn: async (params: UpdateSaleStatusParams): Promise<SaleResponse> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await SaleService.updateSaleStatus(
                params.copypointId,
                params.saleId,
                accessToken,
                params.status
            );
        },
        onSuccess: (data, variables) => {
            // Invalidar todos los caches relacionados
            queryClient.invalidateQueries({
                queryKey: saleKeys.byCopypoint(variables.copypointId)
            });

            // Actualizar cache optimísticamente
            queryClient.setQueryData<PageResponse<SaleResponse>>(
                saleKeys.byCopypoint(variables.copypointId),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        content: oldData.content.map(sale =>
                            sale.id === variables.saleId ? data : sale
                        ),
                    };
                }
            );

            // Si cambia a/desde PENDING, invalidar cache de pendientes
            queryClient.invalidateQueries({
                queryKey: saleKeys.pending(variables.copypointId)
            });

            console.log('Estado de venta actualizado exitosamente');
        },
        onError: (_) => {
            console.log('Error al actualizar estado de venta');
        },
        ...options,
    });
};

/**
 * Hook principal que agrupa todas las funcionalidades de ventas
 */
export const useSalesOperations = (copypointId?: number | string) => {
    const {isAuthenticated} = useAuth();
    const {currentCopypoint} = useCopypointContext();
    const queryClient = useQueryClient();

    // Usar el copypoint del store si no se proporciona uno específico
    const activeCopypointId = copypointId || currentCopypoint?.id;

    // Queries
    const salesQuery = useSales({
        copypointId: activeCopypointId,
        enabled: !!activeCopypointId && isAuthenticated
    });

    const pendingSalesQuery = usePendingSales({
        copypointId: activeCopypointId,
        enabled: !!activeCopypointId && isAuthenticated
    });

    // Mutations
    const createSaleMutation = useCreateSale();
    const addProfileMutation = useAddProfileToSale();
    const updateStatusMutation = useUpdateSaleStatus();

    // Funciones de utilidad
    const refetch = () => {
        return Promise.all([
            salesQuery.refetch(),
            pendingSalesQuery.refetch()
        ]);
    };

    const invalidateCache = () => {
        if (activeCopypointId) {
            queryClient.invalidateQueries({
                queryKey: saleKeys.byCopypoint(activeCopypointId)
            });
        }
    };

    // Funciones de acciones
    const createSale = (data: SaleCreationDTO) => {
        if (!activeCopypointId) {
            throw new Error('No hay copypoint seleccionado');
        }
        return createSaleMutation.mutateAsync({
            copypoint: activeCopypointId,
            data
        });
    };

    const addProfileToSale = (saleId: number | string, data: SaleProfileCreationDTO) => {
        if (!activeCopypointId) {
            throw new Error('No hay copypoint seleccionado');
        }
        return addProfileMutation.mutateAsync({
            copypointId: activeCopypointId,
            saleId,
            data
        });
    };

    const updateSaleStatus = (saleId: number | string, status: SaleStatus) => {
        if (!activeCopypointId) {
            throw new Error('No hay copypoint seleccionado');
        }
        return updateStatusMutation.mutateAsync({
            copypointId: activeCopypointId,
            saleId,
            status
        });
    };

    return {
        // Datos
        sales: salesQuery.data?.content || [],
        pendingSales: pendingSalesQuery.data?.content || [],
        totalSales: salesQuery.data?.totalElements || 0,
        totalPendingSales: pendingSalesQuery.data?.totalElements || 0,
        totalPages: salesQuery.data?.totalPages || 0,

        // Estados de queries
        isLoading: salesQuery.isLoading || pendingSalesQuery.isLoading,
        isError: salesQuery.isError || pendingSalesQuery.isError,
        isSuccess: salesQuery.isSuccess && pendingSalesQuery.isSuccess,
        error: salesQuery.error || pendingSalesQuery.error,

        // Estados de mutaciones
        isCreatingSale: createSaleMutation.isPending,
        isAddingProfile: addProfileMutation.isPending,
        isUpdatingStatus: updateStatusMutation.isPending,
        createError: createSaleMutation.error,
        addProfileError: addProfileMutation.error,
        updateStatusError: updateStatusMutation.error,

        // Estado general de loading para mutaciones
        isMutating: createSaleMutation.isPending ||
            addProfileMutation.isPending ||
            updateStatusMutation.isPending,

        // Funciones
        createSale,
        addProfileToSale,
        updateSaleStatus,
        refetch,
        invalidateCache,

        // Queries y mutations originales (por si necesitas acceso completo)
        salesQuery,
        pendingSalesQuery,
        createSaleMutation,
        addProfileMutation,
        updateStatusMutation,

        // Info del copypoint activo
        activeCopypointId,
        hasCopypoint: !!activeCopypointId,
    };
};

/**
 * Hook para prefetch de ventas (útil para optimizaciones)
 */
export const usePrefetchSales = () => {
    const queryClient = useQueryClient();
    const {token: accessToken} = useAuth();

    const prefetchSales = async (copypointId: number | string) => {
        if (!accessToken) return;

        await Promise.all([
            queryClient.prefetchQuery({
                // eslint-disable-next-line @tanstack/query/exhaustive-deps
                queryKey: saleKeys.byCopypoint(copypointId),
                queryFn: () => SaleService.getSales(copypointId, accessToken),
                staleTime: 5 * 60 * 1000,
            }),
            queryClient.prefetchQuery({
                // eslint-disable-next-line @tanstack/query/exhaustive-deps
                queryKey: saleKeys.pending(copypointId),
                queryFn: () => SaleService.getPendingSales(copypointId, accessToken),
                staleTime: 2 * 60 * 1000,
            })
        ]);
    };

    return {prefetchSales};
};

// Export por defecto del hook principal
export default useSalesOperations;