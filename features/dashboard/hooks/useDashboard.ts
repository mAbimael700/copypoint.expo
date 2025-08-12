import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '~/features/auth/store/AuthStore'
import DashboardService from '~/features/dashboard/service/DashboardService'
import {
  SalesTimelineResponse,
  SalesByCopypointResponse,
  PaymentStatusResponse,
  PaymentMethodDistributionResponse,
  TopServicesResponse,
} from '~/features/dashboard/types/types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  salesTimeline: (startDate: string, endDate: string) =>
    [...dashboardKeys.all, 'sales', 'timeline', startDate, endDate] as const,
  salesByCopypoint: (startDate: string, endDate: string) =>
    [...dashboardKeys.all, 'sales', 'by-copypoint', startDate, endDate] as const,
  paymentStatusDistribution: (startDate: string, endDate: string) =>
    [...dashboardKeys.all, 'payments', 'status-distribution', startDate, endDate] as const,
  paymentMethodDistribution: (startDate: string, endDate: string) =>
    [...dashboardKeys.all, 'payments', 'method-distribution', startDate, endDate] as const,
  topServices: (startDate: string, endDate: string, limit: number) =>
    [...dashboardKeys.all, 'services', 'top', startDate, endDate, limit] as const,
}

// Common retry policy: do not retry on 401/403
function shouldRetry(failureCount: number, error: unknown): boolean {
  const status = (error as { response?: { status?: number } } | undefined)?.response?.status
  if (status === 401 || status === 403) {
    return false
  }
  return failureCount < 3
}

interface DateRangeParams {
  startDate: string
  endDate: string
  enabled?: boolean
}

export function useSalesTimeline(
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<SalesTimelineResponse>, 'queryKey' | 'queryFn'>
) {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery<SalesTimelineResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: dashboardKeys.salesTimeline(params.startDate, params.endDate),
    queryFn: async () => {
      if (!accessToken) throw new Error('Token de acceso no disponible')
      return DashboardService.getSalesTimeline(
        params.startDate,
        params.endDate,
        accessToken
      )
    },
    enabled: isAuthenticated && !!params.startDate && !!params.endDate && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    retry: shouldRetry,
    ...options,
  })
}

export function useSalesByCopypoint(
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<SalesByCopypointResponse>, 'queryKey' | 'queryFn'>
) {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery<SalesByCopypointResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: dashboardKeys.salesByCopypoint(params.startDate, params.endDate),
    queryFn: async () => {
      if (!accessToken) throw new Error('Token de acceso no disponible')
      return DashboardService.getSalesByCopypoint(
        params.startDate,
        params.endDate,
        accessToken
      )
    },
    enabled: isAuthenticated && !!params.startDate && !!params.endDate && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    retry: shouldRetry,
    ...options,
  })
}

export function usePaymentStatusDistribution(
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<PaymentStatusResponse>, 'queryKey' | 'queryFn'>
) {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery<PaymentStatusResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: dashboardKeys.paymentStatusDistribution(params.startDate, params.endDate),
    queryFn: async () => {
      if (!accessToken) throw new Error('Token de acceso no disponible')
      return DashboardService.getPaymentStatusDistribution(
        params.startDate,
        params.endDate,
        accessToken
      )
    },
    enabled: isAuthenticated && !!params.startDate && !!params.endDate && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    retry: shouldRetry,
    ...options,
  })
}

export function usePaymentMethodDistribution(
  params: DateRangeParams,
  options?: Omit<UseQueryOptions<PaymentMethodDistributionResponse>, 'queryKey' | 'queryFn'>
) {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery<PaymentMethodDistributionResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: dashboardKeys.paymentMethodDistribution(params.startDate, params.endDate),
    queryFn: async () => {
      if (!accessToken) throw new Error('Token de acceso no disponible')
      return DashboardService.getPaymentMethodDistribution(
        params.startDate,
        params.endDate,
        accessToken
      )
    },
    enabled: isAuthenticated && !!params.startDate && !!params.endDate && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    retry: shouldRetry,
    ...options,
  })
}

interface TopServicesParams extends DateRangeParams {
  limit: number
}

export function useTopServices(
  params: TopServicesParams,
  options?: Omit<UseQueryOptions<TopServicesResponse>, 'queryKey' | 'queryFn'>
) {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery<TopServicesResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: dashboardKeys.topServices(params.startDate, params.endDate, params.limit),
    queryFn: async () => {
      if (!accessToken) throw new Error('Token de acceso no disponible')
      return DashboardService.getTopServices(
        params.startDate,
        params.endDate,
        params.limit,
        accessToken
      )
    },
    enabled:
      isAuthenticated &&
      !!params.startDate &&
      !!params.endDate &&
      typeof params.limit === 'number' &&
      (params.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    retry: shouldRetry,
    ...options,
  })
}
