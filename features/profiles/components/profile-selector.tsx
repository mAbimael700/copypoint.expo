
import React, { useCallback } from 'react';
import { ProfileResponse } from '~/features/profiles/types/Profile.type';
import { CommandSelector } from '~/features/profiles/components/command/command-selector';
import {View} from "react-native";
import {Text} from "~/components/ui/text";

interface ProfileSelectorProps {
  /**
   * Función que se ejecuta cuando se selecciona un perfil
   */
  handleOnSelect: (profile: ProfileResponse) => void;

  /**
   * Lista de perfiles disponibles
   */
  profiles: ProfileResponse[];

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
   * Perfil seleccionado actualmente
   */
  selectedProfile?: ProfileResponse | null;

  /**
   * Indica si el selector está deshabilitado
   */
  disabled?: boolean;

  /**
   * Clases adicionales para el componente
   */
  className?: string;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  handleOnSelect,
  profiles = [],
  isLoading = false,
  isError = false,
  error = null,
  refetch,
  selectedProfile = null,
  disabled = false,
  className = '',
}) => {
  // Función para manejar la selección de un perfil
  const onSelectProfile = useCallback(
    (profileId: string, _description: string) => {
      const profile = profiles.find((p) => p.id.toString() === profileId);
      if (profile) {
        handleOnSelect(profile);
      }
    },
    [profiles, handleOnSelect]
  );

  return (
    <CommandSelector
      data={profiles}
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      placeholder="Select profile..."
      searchPlaceholder="Search profiles..."
      title="Select a Profile"
      value={selectedProfile ? selectedProfile.id.toString() : undefined}
      label={selectedProfile ? selectedProfile.description : undefined}
      onSelect={onSelectProfile}
      getItemValue={(profile) => profile.id.toString()}
      getItemLabel={(profile) => profile.description}
      filterItems={(items, query) => 
        items.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          (item.id.toString()).includes(query)
        )
      }
      renderItem={(profile, isSelected) => (
        <View className={`flex flex-row justify-between items-center py-3 px-2 rounded-md ${isSelected ? 'bg-accent' : ''}`}>
          <View className="flex-1 space-y-1">
            <View className="flex flex-row items-center gap-2">
              <Text className="font-medium">{profile.name}</Text>
              <Text className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                ${profile.unitPrice.toFixed(2)}
              </Text>
            </View>
            <Text className="text-xs text-muted-foreground">{profile.description}</Text>
          </View>
          {isSelected && (
            <View className="h-4 w-4 text-primary">

            </View>
          )}
        </View>
      )}
      className={className}
    />
  );
};



export default ProfileSelector;