import React, { useCallback, useEffect, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu';
import { ChevronsUpDown, Check, PlusCircle } from 'lucide-react-native';
import { CopypointResponse } from '~/features/copypoints/types/Copypoint.type';
import { useCopypointContext } from '~/features/copypoints/context/useCopypointContext';
import useCopypointOperations from '~/features/copypoints/hooks/useCopypoints';
import { useStoreContext } from '~/features/stores/context/useStoreContext';

interface CopypointSelectorProps {
  /**
   * Función opcional que se ejecutará cuando se seleccione un copypoint
   * Si no se proporciona, se usará setCurrentCopypoint del contexto
   */
  onSelect?: (copypoint: CopypointResponse) => void;

  /**
   * ID de la tienda de la cual se obtendrán los copypoints
   * Si no se proporciona, se usará el store activo del contexto
   */
  storeId?: number | string;

  /**
   * Texto que se mostrará cuando no hay copypoint seleccionado
   */
  placeholder?: string;

  /**
   * Clase CSS adicional para el botón principal
   */
  className?: string;

  /**
   * Si es true, muestra un botón para crear un nuevo copypoint
   */
  showCreateOption?: boolean;
}

const CopypointSelector: React.FC<CopypointSelectorProps> = ({
  onSelect,
  storeId: propStoreId,
  placeholder = "Select copypoint",
  className,
  showCreateOption = true,
}) => {
  // Obtener el store activo del contexto si no se proporciona un storeId
  const activeStore = useStoreContext((state) => state.activeStore);
  const storeId = propStoreId || activeStore?.id;

  // Context para manejar el copypoint actual
  const { 
    currentCopypoint, 
    setCurrentCopypoint,
    openDialog 
  } = useCopypointContext();

  // Obtener copypoints usando el hook
  const { 
    copypoints, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useCopypointOperations(storeId!);

  // Handler para seleccionar un copypoint
  const handleSelect = useCallback((copypoint: CopypointResponse) => {
    if (onSelect) {
      onSelect(copypoint);
    } else {
      setCurrentCopypoint(copypoint);
    }
  }, [onSelect, setCurrentCopypoint]);

  // Handler para abrir el diálogo de creación
  const handleOpenCreateDialog = useCallback(() => {
    openDialog('create');
  }, [openDialog]);

  // Seleccionar automáticamente el primer copypoint si no hay ninguno seleccionado
  useEffect(() => {
    if (!currentCopypoint && copypoints.length > 0 && !isLoading && !isError) {
      handleSelect(copypoints[0]);
    }
  }, [copypoints, currentCopypoint, isLoading, isError, handleSelect]);

  // Memorizar contenido del dropdown según el estado
  const dropdownContent = useMemo(() => {
    if (isLoading) {
      return (
        <View className="p-4 flex items-center justify-center">
          <ActivityIndicator size="small" />
          <Text className="mt-2 text-muted-foreground">Loading...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="p-4">
          <Text className="text-destructive text-center mb-2">Error loading</Text>
          <Text className="text-muted-foreground text-sm mb-2">
            {error?.message || 'Can\'t load copypoints.'}
          </Text>
          <Button variant="outline" size="sm" className="w-full" onPress={() => refetch()}>
            <Text>Reintentar</Text>
          </Button>
        </View>
      );
    }

    if (copypoints.length === 0) {
      return (
        <View className="p-4">
          <Text className="text-center text-muted-foreground mb-3">
            There are no copypoints yet.
          </Text>
          {showCreateOption && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex-row items-center" 
              onPress={handleOpenCreateDialog}
            >
              <PlusCircle size={16} className="mr-2" />
              <Text>Create new copypoint</Text>
            </Button>
          )}
        </View>
      );
    }

    return (
      <>
        <DropdownMenuLabel>Copypoints</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {copypoints.map((copypoint) => (
          <DropdownMenuItem
            key={copypoint.id}
            onPress={() => handleSelect(copypoint)}
            className="flex-row justify-between items-center"
          >
            <View className="flex-1">
              <Text>{copypoint.name}</Text>
              <Text className="text-xs text-muted-foreground">
                Responsible: {copypoint.responsible.personalInfo?.firstName} {copypoint.responsible.personalInfo?.lastName}
              </Text>
            </View>
            {currentCopypoint?.id === copypoint.id && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        {showCreateOption && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onPress={handleOpenCreateDialog} className="flex-row items-center">
              <PlusCircle size={16} className="mr-2" />
              <Text>Create a new copypoint</Text>
            </DropdownMenuItem>
          </>
        )}
      </>
    );
  }, [isLoading,
    isError,
    copypoints,
    showCreateOption,
    handleOpenCreateDialog,
    handleSelect, refetch,
    error?.message,
    currentCopypoint?.id]);

  // No renderizar si no hay storeId
  if (!storeId) {
    return (
      <Button 
        variant="outline" 
        disabled 
        className={className}
      >
        <Text className="text-muted-foreground">Select a store first</Text>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className={`flex-row items-center w-full ${className}`}
        >
          <View style={{ flex: 1 }}>
            <Text className={currentCopypoint ? "text-foreground" : "text-muted-foreground"}>
              {currentCopypoint?.name || placeholder}
            </Text>
          </View>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {dropdownContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default React.memo(CopypointSelector);