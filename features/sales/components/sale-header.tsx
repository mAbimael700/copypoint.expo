// components/SaleHeader.tsx
import React from 'react';
import { View } from 'react-native';
import { CardTitle, CardDescription } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Calendar } from 'lucide-react-native';
import { formatDate } from '~/lib/utils';
import { SaleStatusBadge } from '~/features/sales/components/sale-status-badge';
import { SaleStatus } from '~/features/sales/types/Sale.type';

interface SaleHeaderProps {
    saleId: number | string;
    status: SaleStatus;
    createdAt: string;
    updatedAt: string;
}

export const SaleHeader: React.FC<SaleHeaderProps> = ({
                                                          saleId,
                                                          status,
                                                          createdAt,
                                                          updatedAt
                                                      }) => {
    return (
        <View>
            <View className="flex-row justify-between items-center">
                <CardTitle className="text-lg font-semibold">Sale #{saleId}</CardTitle>
                <SaleStatusBadge status={status} />
                <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center">
                        <Calendar size={16} color="#f59e0b" />
                    </View>
                    <View>
                        <Text className="text-xs text-muted-foreground">
                            {formatDate(updatedAt)}
                        </Text>
                    </View>
                </View>
            </View>
            <CardDescription className="text-xs text-gray-500">
                {formatDate(createdAt)}
            </CardDescription>
        </View>
    );
};