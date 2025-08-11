// components/SaleStatusBadge.tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { SaleStatus } from '~/features/sales/types/Sale.type';
import { getStatusConfig } from '~/features/sales/utils/getStatus';

interface SaleStatusBadgeProps {
    status: SaleStatus;
}

export const SaleStatusBadge: React.FC<SaleStatusBadgeProps> = ({ status }) => {
    const { icon: StatusIcon, color: statusColor, bgColor: statusBgColor } = getStatusConfig(status);

    return (
        <View className={`flex-row items-center gap-1 px-2 rounded-full ${statusBgColor}`}>
            <StatusIcon
                size={16}
                color={statusColor
                    .replace('text', '#')
                    .split('-')[1]}
            />
            <Text className={`text-xs font-medium ${statusColor}`}>
                {SaleStatus[status]}
            </Text>
        </View>
    );
};