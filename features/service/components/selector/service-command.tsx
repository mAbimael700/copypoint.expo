import React, { useCallback } from 'react';
import { Service } from '~/features/service/types/Service.type';
import { CommandSelector } from '~/features/profiles/components/command/command-selector';

interface ServiceCommandProps {
  /**
   * Lista de servicios disponibles
   */
  services: Service[];

  /**
   * Servicio seleccionado actualmente
   */
  currentService?: Service | null;

  /**
   * Función que se ejecuta cuando se selecciona un servicio
   */
  handleOnClick: (service: Service) => void;

  /**
   * Etiqueta personalizada para mostrar
   */
  label?: string;

  /**
   * Estado de carga
   */
  isLoading?: boolean;

  /**
   * Clases adicionales para el componente
   */
  className?: string;
}

export const ServiceCommand: React.FC<ServiceCommandProps> = ({
  services = [],
  currentService = null,
  handleOnClick,
  label = 'Select service...',
  isLoading = false,
  className = '',
}) => {
  // Filtrar servicios para mostrar solo los que no estén en los primeros 4 botones
  const visibleServices = services.length > 4 ? services.slice(4) : services;

  // Función para manejar la selección de un servicio
  const onSelectService = useCallback(
    (serviceId: string, _name: string) => {
      const service = services.find((s) => s.id.toString() === serviceId);
      if (service) {
        handleOnClick(service);
      }
    },
    [services, handleOnClick]
  );

  return (
    <CommandSelector
      data={visibleServices}
      isLoading={isLoading}
      placeholder="Select service..."
      searchPlaceholder="Search services..."
      title="Select a Service"
      value={currentService ? currentService.id.toString() : undefined}
      label={label}
      onSelect={onSelectService}
      getItemValue={(service) => service.id.toString()}
      getItemLabel={(service) => service.name}
      className={className}
    />
  );
};
