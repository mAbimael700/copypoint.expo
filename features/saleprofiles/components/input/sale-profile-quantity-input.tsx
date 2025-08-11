import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Control } from 'react-hook-form';
import { Minus, PencilLine, Plus } from 'lucide-react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { View, Pressable, TextInput } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetHandle,
} from '~/components/ui/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { SaleProfilesFormValues } from "~/features/saleprofiles/components/form/sale-form-schema";

interface SaleProfileQuantityDrawerProps {
  profileId: number;
  serviceId: number;
  profileName: string;
  currentQuantity: number;
  onQuantityChange: (
      profileId: number,
      serviceId: number,
      increment: number
  ) => void;
  onValueChange: (
      fieldName: string,
      profile: number,
      serviceId: number,
      value: number
  ) => void;
}

export function SaleProfileQuantityDrawer({
                                            profileId,
                                            serviceId,
                                            profileName,
                                            currentQuantity,
                                            onQuantityChange,
                                            onValueChange,
                                          }: SaleProfileQuantityDrawerProps) {

  // Bottom Sheet refs and values
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  const snapPoints = useMemo(() => ["50%", "70%"], []);

  // Estado local para mantener el valor dentro del drawer
  const [localValue, setLocalValue] = useState(currentQuantity);
  const [isPressed, setIsPressed] = useState(false);

  // Actualizar el estado local cuando cambia currentQuantity (para mantener sincronización)
  useEffect(() => {
    setLocalValue(currentQuantity);
  }, [currentQuantity]);

  // Callbacks para el Bottom Sheet
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleInputChange = (value: string) => {
    const numValue = Math.max(1, Number(value) || 1);
    setLocalValue(numValue);
  };

  // Aplicar cambios al formulario cuando se cierra el drawer
  const applyChanges = useCallback(() => {
    console.log('Applying changes for profile:', profileId, 'service:', serviceId, 'new value:', localValue);

    try {
      // Intentar actualizar a través de la función callback - sin fieldName (lo calculará la función padre)
      onValueChange('', profileId, serviceId, localValue);
      console.log('Successfully applied value change');
    } catch (error) {
      console.error('Error applying value change:', error);
    }

    handleCloseModal();
  }, [profileId, serviceId, localValue, onValueChange, handleCloseModal]);

  const handleDecrease = useCallback(() => {
    const newValue = Math.max(1, localValue - 1);
    setLocalValue(newValue);
    onQuantityChange && onQuantityChange(profileId, serviceId, -1);
  }, [localValue, onQuantityChange, profileId, serviceId]);

  const handleIncrease = useCallback(() => {
    const newValue = localValue + 1;
    setLocalValue(newValue);
    onQuantityChange && onQuantityChange(profileId, serviceId, 1);
  }, [localValue, onQuantityChange, profileId, serviceId]);


  return (
      <>
        {/* Trigger */}
        <Pressable
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handlePresentModalPress}
            className="flex-row items-center gap-2"
            style={{ opacity: isPressed ? 0.7 : 1 }}
        >
          <PencilLine strokeWidth={1.25} height={20} color="#6b7280" />
          <View style={{
            width: 28,
            height: 28,

            alignItems: 'center',
            justifyContent: 'center',
          }}
          className={'rounded-full bg-primary '}>
            <Text className="text-primary-foreground text-xs font-medium">
              {currentQuantity}
            </Text>
          </View>


        </Pressable>

        {/* Bottom Sheet Modal */}
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            handleComponent={() => (
                <BottomSheetHandle
                    className="bg-primary/20 mt-2"
                    animatedIndex={animatedIndex}
                    animatedPosition={animatedPosition}
                />
            )}
        >
          <BottomSheetView className="flex-1 px-4 py-2 items-center">
            <View className="mx-auto w-full max-w-sm">
              {/* Header */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-center mb-2">
                  Edit quantity
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Adjust quantity for profile: {profileName}
                </Text>
                <Text className="text-xs text-gray-500 text-center mt-1">
                  The changes will be applied when you click Apply
                </Text>
              </View>

              {/* Simple quantity selector - sin form context */}
              <View className="flex-row items-center justify-center space-x-4 mb-8">
                {/* Decrease Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onPress={handleDecrease}
                  disabled={localValue <= 1}
                >
                  <Minus size={24} color={localValue <= 1 ? "#9ca3af" : "#374151"} />
                </Button>

                {/* Quantity Input */}
                <View className="flex-1 items-center">
                  <TextInput
                    value={localValue.toString()}
                    onChangeText={handleInputChange}
                    keyboardType="numeric"
                    style={{
                      fontWeight: 'bold',
                      fontSize: 72,
                      textAlign: 'center',
                      color: '#111827',
                      minWidth: 120
                    }}
                    maxLength={3}
                    selectTextOnFocus
                  />
                </View>

                {/* Increase Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onPress={handleIncrease}
                >
                  <Plus size={24} color="#374151" />
                </Button>
              </View>

              {/* Footer Buttons */}
              <View className="space-y-3 mt-auto">
                <Button
                  className="w-full"
                  onPress={applyChanges}
                >
                  <Text className="text-white font-medium">Apply</Text>
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onPress={handleCloseModal}
                >
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </>
  );
}