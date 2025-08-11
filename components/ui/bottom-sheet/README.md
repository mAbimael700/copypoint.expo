# Universal Bottom Sheet

Este componente combina [Gorhom Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet) y [Vaul](https://github.com/emilkowalski/vaul) para crear una experiencia de bottom sheet consistente tanto en dispositivos móviles como en web.

## Uso básico

```tsx
import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { Button } from '~/components/ui/button';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTrigger,
  BottomSheetHandle
} from '~/components/ui/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';

const MyComponent = () => {
  const bottomSheetModalRef = useRef(null);
  const animatedIndex = useSharedValue(0);
  const animatedPosition = useSharedValue(0);

  const handleOpenSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View>
      <Button onPress={handleOpenSheet}>
        <Text>Abrir Bottom Sheet</Text>
      </Button>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={['25%', '50%', '75%']}
        handleComponent={() => (
          <BottomSheetHandle
            className="bg-gray-200 mt-2"
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        )}
      >
        <BottomSheetView className="flex-1 p-4">
          <Text className="text-xl font-bold">Contenido del Bottom Sheet</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
```

## Compatibilidad Web

Para que funcione correctamente en web, usa el componente `BottomSheetTrigger` dentro del `BottomSheetModal`:

```tsx
<BottomSheetModal ref={bottomSheetModalRef} snapPoints={['50%']}>
  <BottomSheetTrigger>
    <Button>
      <Text>Abrir desde Web</Text>
    </Button>
  </BottomSheetTrigger>
  <BottomSheetView>
    <Text>Contenido</Text>
  </BottomSheetView>
</BottomSheetModal>
```

## Componentes disponibles

- `BottomSheet`: Componente base
- `BottomSheetModal`: Versión modal del bottom sheet
- `BottomSheetView`: Contenedor de contenido
- `BottomSheetScrollView`: Contenedor con scroll
- `BottomSheetHandle`: Componente de manija para arrastrar
- `BottomSheetTrigger`: Disparador para web
- `BottomSheetModalProvider`: Proveedor necesario (ya está configurado en el árbol de componentes principal)

## Consideraciones

1. Siempre envuelve tu aplicación con `BottomSheetModalProvider`
2. Usa diferentes aproximaciones según la plataforma (Platform.OS)
3. Para móvil, usa refs y métodos imperativos (present, dismiss)
4. Para web, usa `BottomSheetTrigger` dentro del modal
