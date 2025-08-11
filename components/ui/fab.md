# FAB (Floating Action Button)

Un componente de botón de acción flotante que se puede posicionar en diferentes partes de la pantalla.

## Uso

```tsx
import { Fab } from '~/components/ui/fab';
import { Plus } from 'lucide-react-native';

// Botón básico en la esquina inferior derecha
<Fab onPress={() => console.log('FAB pressed')}>
  <Plus color="white" size={24} />
</Fab>

// Botón personalizado
<Fab 
  position="top-left"
  size="large"
  color="#10b981" // verde
  onPress={() => console.log('Green FAB pressed')}
>
  <SomeIcon color="white" size={32} />
</Fab>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `position` | `'bottom-right'` \| `'bottom-left'` \| `'top-right'` \| `'top-left'` | `'bottom-right'` | Posición del botón en la pantalla |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Tamaño del botón |
| `color` | `string` | `'#3b82f6'` (blue-500) | Color de fondo del botón |
| `style` | `ViewStyle` | `undefined` | Estilos adicionales para el botón |
| `children` | `React.ReactNode` | *requerido* | Contenido del botón (normalmente un icono) |

Además, el componente acepta todas las props de `TouchableOpacity`.

## Dimensiones

- **Small**: 48x48px, radio 24px
- **Medium**: 60x60px, radio 30px
- **Large**: 72x72px, radio 36px

## Posiciones

- **bottom-right**: 30px desde la parte inferior y derecha
- **bottom-left**: 30px desde la parte inferior e izquierda
- **top-right**: 30px desde la parte superior y derecha
- **top-left**: 30px desde la parte superior e izquierda
