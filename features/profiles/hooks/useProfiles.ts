/**
 * Archivo de re-exportación que unifica los hooks separados
 * Esto mantiene la compatibilidad con el código existente
 */
import { useCallback, useState } from 'react';
import { ProfileResponse } from '../types/Profile.type';
import { useQuery } from '@tanstack/react-query';

// Hook para obtener perfiles por tienda
export const useProfileByCopypointOperations = () => {
  const [profiles, setProfiles] = useState<ProfileResponse[]>([]);

  // Esta función simula una petición a la API para obtener perfiles
  const fetchProfiles = useCallback(async () => {
    // Aquí debería haber una llamada real a la API
    // Por ahora devolvemos datos de ejemplo
    const mockProfiles: ProfileResponse[] = [
      { id: 1, name: 'Blanco y Negro', description: 'Impresión B/N simple', unitPrice: 0.10 },
      { id: 2, name: 'Color', description: 'Impresión a color', unitPrice: 0.25 },
      { id: 3, name: 'Alta calidad', description: 'Impresión alta calidad', unitPrice: 0.50 },
      { id: 4, name: 'Fotográfico', description: 'Papel fotográfico', unitPrice: 1.00 },
      { id: 5, name: 'Acetato', description: 'Impresión en acetato', unitPrice: 1.50 },
      { id: 6, name: 'Cartulina', description: 'Impresión en cartulina', unitPrice: 0.75 }
    ];

    return mockProfiles;
  }, []);

  // Consulta para obtener los perfiles
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
  });

  // Actualizar el estado cuando lleguen los datos
  if (data && !isLoading) {
    setProfiles(data);
  }

  return { 
    profiles, 
    isLoading, 
    error, 
    refetch 
  };
};
// Re-exportar las keys para uso externo
export { profileKeys } from './profileKeys'

// Re-exportar hooks para tiendas (con mutaciones)
export {
  useProfilesByStore,
  useCreateProfile,
  useProfileByStoreOperations,
  usePrefetchProfiles,
} from './useProfilesByStore'

// Re-exportar hooks para copypoints (solo lectura)
export {
  useProfilesByCopypoint,
  useProfileByCopypointOperations,
} from './useProfilesByCopypoint'

// Export por defecto del hook principal
export { useProfileByStoreOperations as default } from './useProfilesByStore'
