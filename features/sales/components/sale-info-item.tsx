// components/SaleInfoItem.tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { LucideIcon } from 'lucide-react-native';

interface SaleInfoItemProps {
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
    label: string;
    value: string;
    additionalText?: string;
}

export const SaleInfoItem: React.FC<SaleInfoItemProps> = ({
                                                              icon: Icon,
                                                              iconColor,
                                                              iconBgColor,
                                                              label,
                                                              value,
                                                              additionalText
                                                          }) => {
    return (
        <View className="flex-row items-center gap-3">
            <View className={`w-8 h-8 rounded-full ${iconBgColor} items-center justify-center`}>
                <Icon size={16} color={iconColor} />
            </View>
            <View>
                <Text className="text-xs text-muted-foreground">{label}</Text>
                <Text className="text-sm font-medium">
                    {value}
                    {additionalText && (
                        <Text className="text-xs font-normal text-gray-500"> {additionalText}</Text>
                    )}
                </Text>
            </View>
        </View>
    );
};