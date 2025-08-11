/**
 * Keys para el cache de queries - ACTUALIZADO para incluir serviceId
 * Archivo separado para compartir las claves entre hooks
 */
export const profileKeys = {
  all: ['profiles'] as const,
  byStore: (storeId: number | string, serviceId?: number | string) =>
    [
      ...profileKeys.all,
      'store',
      storeId,
      'service',
      serviceId || 'none',
    ] as const,
  byCopypoint: (copypointId: number | string, serviceId?: number | string) =>
    [
      ...profileKeys.all,
      'copypoint',
      copypointId,
      'service',
      serviceId || 'none',
    ] as const,
  detail: (
    storeId: number | string,
    serviceId: number | string,
    id: number | string
  ) => [...profileKeys.byStore(storeId, serviceId), 'detail', id] as const,
}
