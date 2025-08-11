import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ViewStyle } from 'react-native';
import { cn } from '~/lib/utils';

interface FabProps extends TouchableOpacityProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Fab = ({
  position = 'bottom-right',
  size = 'medium',
  color = '#3b82f6', // blue-500
  style,
  children,
  ...props
}: FabProps) => {
  // Determinar el tamaño del botón según el prop size
  const sizeStyles = {
    small: { width: 48, height: 48, borderRadius: 24 },
    medium: { width: 60, height: 60, borderRadius: 30 },
    large: { width: 72, height: 72, borderRadius: 36 }
  };

  // Determinar la posición del botón según el prop position
  const positionStyles = {
    'bottom-right': { bottom: 30, right: 30 },
    'bottom-left': { bottom: 30, left: 30 },
    'top-right': { top: 30, right: 30 },
    'top-left': { top: 30, left: 30 }
  };

  return (
    <TouchableOpacity
      style={[{
        position: 'absolute',
        ...sizeStyles[size],
        ...positionStyles[position],
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 999
      }, style]}
      activeOpacity={0.8}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
