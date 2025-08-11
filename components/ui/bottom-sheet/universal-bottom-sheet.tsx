import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTrigger,
  BottomSheetHandle,
} from "~/components/ui/bottom-sheet";
import { Pressable, Platform } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Button } from "~/components/ui/button";

interface UniversalBottomSheetProps {
  triggerText?: string;
  contentText?: string;
  snapPoints?: Array<string | number>;
}

export const UniversalBottomSheet = ({
  triggerText = "Abrir Bottom Sheet",
  contentText = "Contenido del Bottom Sheet",
  snapPoints = ["20%", "50%", "70%"],
}: UniversalBottomSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const sheetSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.dismiss();
      setIsOpen(false);
    } else {
      bottomSheetModalRef.current?.present();
      setIsOpen(true);
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    // Si el índice es 0 (cerrado), actualizar el estado
    if (index === -1) {
      setIsOpen(false);
    }
  }, []);

  return (
    <View className="flex-1">
      {Platform.OS !== "web" && (
        <Button onPress={handlePresentModalPress} className="my-2">
          <Text>{triggerText}</Text>
        </Button>
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={sheetSnapPoints}
        onChange={handleSheetChanges}
        handleComponent={() => (
          <BottomSheetHandle
            className="bg-primary/20 mt-2"
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        )}
      >
        {Platform.OS === "web" && (
          <BottomSheetTrigger>
            <Button className="my-2">
              <Text>{triggerText}</Text>
            </Button>
          </BottomSheetTrigger>
        )}
        <BottomSheetView className="flex-1 items-center px-4 py-6">
          <Text className="text-xl font-bold mb-4">{contentText}</Text>
          <View className="bg-primary/10 p-4 rounded-lg w-full mb-4">
            <Text className="text-base">Este es un ejemplo de Universal Bottom Sheet que funciona tanto en web como en móvil.</Text>
          </View>
          <Button 
            variant="outline" 
            className="mt-4" 
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              setIsOpen(false);
            }}
          >
            <Text>Cerrar</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
