import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {PaymentMethod} from "~/features/paymentmethod/types/PaymentMethod.type";
import PaymentMethodService from "~/features/paymentmethod/services/PaymentMethodService";


// Query keys para mantener consistencia
export const paymentMethodKeys = {
    all: ['paymentMethods'] as const,
    lists: () => [...paymentMethodKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...paymentMethodKeys.lists(), filters] as const,
};

// Hook principal para obtener todos los métodos de pago
export const usePaymentMethods = (
    options?: {
        enabled?: boolean;
        staleTime?: number;
        refetchOnWindowFocus?: boolean;
    }
): UseQueryResult<PageResponse<PaymentMethod>, Error> => {
    return useQuery({
        queryKey: paymentMethodKeys.list(),
        queryFn: () => PaymentMethodService.getAll(),
        enabled: options?.enabled ?? true,
        staleTime: options?.staleTime ?? 1000 * 60 * 10, // 10 minutos por defecto
        gcTime: 1000 * 60 * 15, // 15 minutos en caché
        refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    });
};

// Hook con transformación de datos - solo los métodos sin metadatos de paginación
export const usePaymentMethodsList = (
    options?: {
        enabled?: boolean;
        staleTime?: number;
    }
): UseQueryResult<PaymentMethod[], Error> => {
    return useQuery({
        queryKey: [...paymentMethodKeys.list(), 'items-only'],
        queryFn: async () => {
            const response = await PaymentMethodService.getAll();
            return response.content || []; // Adaptable a diferentes estructuras de PageResponse
        },
        enabled: options?.enabled ?? true,
        staleTime: options?.staleTime ?? 1000 * 60 * 10,
        gcTime: 1000 * 60 * 15,
    });
};

// Hook para obtener un método de pago específico por ID (útil para futuras expansiones)
export const usePaymentMethodById = (
    id: string | number,
    options?: {
        enabled?: boolean;
    }
): UseQueryResult<PaymentMethod | undefined, Error> => {
    return useQuery({
        queryKey: [...paymentMethodKeys.all, 'detail', id],
        queryFn: async () => {
            const response = await PaymentMethodService.getAll();
            const methods = response.content || [];
            return methods.find(method => method.id === id);
        },
        enabled: (options?.enabled ?? true) && Boolean(id),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 15,
    });
};

// Hook para obtener métodos de pago activos/habilitados (asumiendo que existe una propiedad 'active' o 'enabled')
export const useActivePaymentMethods = (
    options?: {
        enabled?: boolean;
    }
): UseQueryResult<PaymentMethod[], Error> => {
    return useQuery({
        queryKey: [...paymentMethodKeys.list(), 'active-only'],
        queryFn: async () => {
            const response = await PaymentMethodService.getAll();
            const methods = response.content || [];
            // Asumiendo que existe una propiedad para filtrar métodos activos
            return methods.filter(method =>
                (method as any).active !== false &&
                (method as any).enabled !== false &&
                (method as any).status !== 'inactive'
            );
        },
        enabled: options?.enabled ?? true,
        staleTime: 1000 * 60 * 5, // 5 minutos para datos más críticos
        gcTime: 1000 * 60 * 10,
    });
};

// Hook compuesto con información adicional y estadísticas
export const usePaymentMethodsWithStats = (
    options?: {
        enabled?: boolean;
    }
) => {
    const paymentMethodsQuery = usePaymentMethods(options);

    const stats = paymentMethodsQuery.data ? {
        total: paymentMethodsQuery.data.totalElements || 0,
        totalPages: paymentMethodsQuery.data.totalPages || 1,
        currentPage: paymentMethodsQuery.data.number || 0,
        size: paymentMethodsQuery.data.size || 0,
        isEmpty: (paymentMethodsQuery.data.content || []).length === 0,
    } : null;

    return {
        ...paymentMethodsQuery,
        stats,
        methods: paymentMethodsQuery.data?.content || [],
    };
};

// Tipos de utilidad para mayor comodidad
export type PaymentMethodsQuery = ReturnType<typeof usePaymentMethods>;
export type PaymentMethodsListQuery = ReturnType<typeof usePaymentMethodsList>;
export type PaymentMethodByIdQuery = ReturnType<typeof usePaymentMethodById>;
export type ActivePaymentMethodsQuery = ReturnType<typeof useActivePaymentMethods>;
export type PaymentMethodsWithStatsQuery = ReturnType<typeof usePaymentMethodsWithStats>;