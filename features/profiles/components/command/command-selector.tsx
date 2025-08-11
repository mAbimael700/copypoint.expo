import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, TextInput, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetHandle } from '~/components/ui/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';

interface CommandSelectorProps<T> {
  /**
   * Datos para mostrar en el selector
   */
  data: T[];
  /**
   * Estado de carga
   */
  isLoading?: boolean;
  /**
   * Estado de error
   */
  isError?: boolean;
  /**
   * Mensaje de error
   */
  error?: Error | null;
  /**
   * Función para reintentar en caso de error
   */
  refetch?: () => void;
  /**
   * Texto placeholder cuando no hay selección
   */
  placeholder?: string;
  /**
   * Texto placeholder para la búsqueda
   */
  searchPlaceholder?: string;
  /**
   * Etiqueta del selector
   */
  label?: string;
  /**
   * Valor seleccionado actualmente
   */
  value?: string;
  /**
   * Función a ejecutar cuando se selecciona un elemento
   */
  onSelect: (value: string, label: string) => void;
  /**
   * Función para obtener el valor único de cada elemento
   */
  getItemValue: (item: T) => string;
  /**
   * Función para obtener la etiqueta de cada elemento
   */
  getItemLabel: (item: T) => string;
  /**
   * Función para renderizar cada elemento (opcional)
   */
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  /**
   * Función para filtrar elementos al buscar
   */
  filterItems?: (items: T[], query: string) => T[];
  /**
   * Clases adicionales para el componente
   */
  className?: string;
  /**
   * Título del selector
   */
  title?: string;
}

export function CommandSelector<T>({ 
  data, 
  isLoading = false, 
  isError = false, 
  error = null, 
  refetch, 
  placeholder = 'Select item...', 
  searchPlaceholder = 'Search...', 
  label, 
  value, 
  onSelect, 
  getItemValue, 
  getItemLabel, 
  renderItem, 
  filterItems, 
  className = '', 
  title = 'Select item'
}: CommandSelectorProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Bottom sheet refs y animaciones
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);

  // Definir puntos de anclaje para el bottom sheet
  const snapPoints = useMemo(() => ['60%', '80%'], []);

  // Función para abrir/cerrar el selector
  const toggleSelector = useCallback(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.dismiss();
      setIsOpen(false);
    } else {
      bottomSheetModalRef.current?.present();
      setIsOpen(true);
    }
  }, [isOpen]);

  // Manejar los cambios en el bottom sheet
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpen(false);
    }
  }, []);

  // Manejar la selección de un elemento
  const handleSelect = useCallback((item: T) => {
    const itemValue = getItemValue(item);
    const itemLabel = getItemLabel(item);
    onSelect(itemValue, itemLabel);
    setSearchQuery('');
    setIsOpen(false);
    bottomSheetModalRef.current?.dismiss();
  }, [getItemValue, getItemLabel, onSelect]);

  // Filtrar los elementos según la búsqueda
  const filteredItems = useMemo(() => {
    if (!searchQuery) return data;

    if (filterItems) {
      return filterItems(data, searchQuery);
    }

    // Filtro por defecto si no se proporciona uno personalizado
    return data.filter(item => {
      const itemLabel = getItemLabel(item).toLowerCase();
      const itemValue = getItemValue(item).toLowerCase();
      const query = searchQuery.toLowerCase();
      return itemLabel.includes(query) || itemValue.includes(query);
    });
  }, [data, searchQuery, filterItems, getItemLabel, getItemValue]);

  // Renderizar el contenido del selector según el estado
  const commandContent = useMemo(() => {
    if (isLoading) {
      return (
        <View className="p-4 flex items-center justify-center" style={{ height: 150 }}>
          <ActivityIndicator size="small" />
          <Text className="mt-2 text-muted-foreground">Loading items...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="p-4">
          <Text className="text-destructive text-center mb-2">Error loading data</Text>
          <Text className="text-muted-foreground text-sm mb-2">
            {error?.message || 'Could not load items.'}
          </Text>
          {refetch && (
            <Button variant="outline" size="sm" className="w-full" onPress={() => refetch()}>
              <Text>Retry</Text>
            </Button>
          )}
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View className="p-4">
          <Text className="text-center text-muted-foreground mb-3">
            No items available.
          </Text>
        </View>
      );
    }

    if (filteredItems.length === 0 && searchQuery) {
      return (
        <View className="p-4">
          <Text className="text-center text-muted-foreground">
            No items found for "{searchQuery}"
          </Text>
        </View>
      );
    }

    // Renderizar la lista de elementos
    return (
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => getItemValue(item)}
        style={{ maxHeight: 300 }}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={5}
        showsVerticalScrollIndicator={true}
        contentContainerClassName="px-2 py-1"
        renderItem={({ item }) => {
          const itemValue = getItemValue(item);
          const isSelected = value === itemValue;

          // Usar un renderizador personalizado si se proporciona
          if (renderItem) {
            return (
              <Pressable onPress={() => handleSelect(item)}>
                {renderItem(item, isSelected)}
              </Pressable>
            );
          }

          // Renderizado por defecto
          return (
            <Pressable
              onPress={() => handleSelect(item)}
              className="flex-row justify-between items-center py-3 px-2 rounded-md active:bg-accent"
            >
              <View className="flex-1">
                <Text className="font-medium">{getItemValue(item)}</Text>
                <Text className="text-xs text-muted-foreground">{getItemLabel(item)}</Text>
              </View>
              {isSelected && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </Pressable>
          );
        }}
      />
    );
  }, [isLoading, isError, refetch, filteredItems, searchQuery, value, getItemValue, getItemLabel, handleSelect, renderItem, error?.message, data.length]);

  return (
    <View className={`w-full ${className}`}>
      {/* Botón para abrir el selector */}
      <Button
        variant="outline"
        className="flex-row items-center justify-between w-full"
        onPress={toggleSelector}
      >
        <View style={{ flex: 1 }}>
          <Text className={value ? "text-foreground" : "text-muted-foreground"}>
            {value ? label || value : placeholder}
          </Text>
        </View>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </Button>

      {/* Bottom Sheet Modal para el selector */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={() => (
          <BottomSheetHandle
            className="bg-primary/20 mt-2"
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        )}
      >
        <BottomSheetView className="flex-1 px-4 pt-2 pb-6">
          {/* Encabezado del selector */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">{title}</Text>
            <Pressable 
              onPress={() => {
                bottomSheetModalRef.current?.dismiss();
                setIsOpen(false);
              }}
              className="p-2"
            >
              <X size={20} />
            </Pressable>
          </View>

          {/* Campo de búsqueda */}
          <View className="flex-row items-center border border-input rounded-md px-2 py-1 mb-4">
            <Text className="text-muted-foreground text-xs mr-2">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={searchPlaceholder}
              className="flex-1 text-sm text-foreground"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')} className="p-1">
                <X size={16} className="text-muted-foreground" />
              </Pressable>
            ) : null}
          </View>

          {/* Mostrar texto de resultados si hay búsqueda */}
          {searchQuery ? (
            <View className="px-2 py-1 mb-2">
              <Text className="text-xs text-muted-foreground">Showing results for "{searchQuery}"</Text>
            </View>
          ) : null}

          {/* Contenido del selector */}
          {commandContent}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
