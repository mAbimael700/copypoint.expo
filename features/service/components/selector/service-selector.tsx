import React, { useMemo, useCallback } from 'react';
import {GestureResponderEvent, View} from 'react-native';
import { useServiceByStoreOperations } from '~/features/service/hooks/useService';
import { Service } from '~/features/service/types/Service.type';
import { useStoreContext } from '~/features/stores/context/useStoreContext';
import { Button } from '~/components/ui/button';
import { ServiceCommand } from './service-command';
import { useServiceContext } from '~/features/service/context/useServiceContext';
import { Text } from '~/components/ui/text';

const ServiceSelectorComp: React.FC = () => {
  const { activeStore } = useStoreContext();
  const { services } = useServiceByStoreOperations(activeStore?.id || 0);
  const { currentService, setCurrentService } = useServiceContext();

  // Mostrar solo los primeros 4 servicios en los botones - memoizado para evitar recálculos
  const visibleServices = useMemo(() => services.slice(0, 4), [services]);

  // Función para manejar la selección en botones
  const handleOnClickBtn = useCallback((service: Service, e: GestureResponderEvent) => {
    e.preventDefault();
    setCurrentService(service);
  }, [setCurrentService]);

  // Función para manejar la selección en el selector
  const handleOnClick = useCallback((service: Service) => {
    setCurrentService(service);
  }, [setCurrentService]);


  // Calcular la etiqueta para el ServiceCommand de manera memoizada
  const commandLabel = useMemo(() => {
    if (currentService) {
      return services.find((s) => s.id === currentService.id)?.name || "Select service...";
    }
    return "Select service...";
  }, [currentService, services]);

  return (
    <View className='flex flex-row gap-4'>
      <View className='bg-accent rounded-lg p-1 flex flex-row gap-1'>
        {visibleServices.map((service) => (
          <Button
            variant={currentService?.id === service.id ? "default" : "ghost"}
            onPress={(e) => handleOnClickBtn(service, e)}
            key={`service-selector-${service.id}`}
          >
            <Text className={'text-xs'}>{service.name}</Text>
          </Button>
        ))}
      </View>

      <ServiceCommand
        services={services}
        currentService={currentService}
        label={commandLabel}
        handleOnClick={handleOnClick}
      />
    </View>
  );
};

// Exportar el componente memoizado para evitar re-renders innecesarios
export const ServiceSelector = React.memo(ServiceSelectorComp);
