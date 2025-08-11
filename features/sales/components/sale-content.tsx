import React from 'react';
import { View } from 'react-native';
import { CardContent } from '~/components/ui/card';
import { Banknote, CreditCard, User } from 'lucide-react-native';
import { SaleInfoItem } from '~/features/sales/components/sale-info-item';
import { SaleResponse } from '~/features/sales/types/Sale.type';

interface SaleContentProps {
    sale: SaleResponse;
}

export const SaleContent: React.FC<SaleContentProps> = ({ sale }) => {
    const discountInfo = sale.discount > 0
        ? `(${sale.discount}% de descuento aplicado)`
        : '';

    return (
        <CardContent>
            <View className="bg-gray-50 rounded-lg flex-row gap-4">
                <SaleInfoItem
                    icon={User}
                    iconColor="#3b82f6"
                    iconBgColor="bg-blue-100"
                    label="Vendor"
                    value={`${sale.userVendor.personalInfo?.firstName} ${sale.userVendor.personalInfo?.lastName}`}
                />

                <SaleInfoItem
                    icon={Banknote}
                    iconColor="#10b981"
                    iconBgColor="bg-green-100"
                    label="Total"
                    value={`${sale.total} ${sale.currency}`}
                    additionalText={discountInfo}
                />

                <SaleInfoItem
                    icon={CreditCard}
                    iconColor="#8b5cf6"
                    iconBgColor="bg-purple-100"
                    label="Payment method"
                    value={sale.paymentMethod.description}
                />
            </View>
        </CardContent>
    );
};
