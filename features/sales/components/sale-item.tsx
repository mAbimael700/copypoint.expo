import React from "react";
import {SaleResponse, SaleStatus} from "~/features/sales/types/Sale.type";
import {Text} from "~/components/ui/text";
import {Button} from "~/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {View} from "react-native";
import {formatDate} from "~/lib/utils";

interface SaleItemProps {
    sale: SaleResponse;
    onStatusUpdate: (saleId: number | string, status: SaleStatus) => Promise<void>;
}

const SaleItem = ({sale, onStatusUpdate}: SaleItemProps) => {
    const isPending = sale.status === SaleStatus.PENDING;

    return (
        <View className="mb-4 w-full">
            <CardHeader>
                <CardTitle className="flex-row justify-between items-center">
                    <Text className="text-lg font-semibold">Venta #{sale.id}</Text>
                    <Text className={`text-sm ${isPending ? 'text-yellow-500' : 'text-green-500'}`}>
                        {SaleStatus[sale.status]}
                    </Text>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <View className="space-y-2">

                    <View className={'flex-row justify-between items-center gap-2'}>
                        <Text className={'font-bold'}>Vendor:</Text>
                        <Text>
                            {sale.userVendor.personalInfo?.firstName} {sale.userVendor.personalInfo?.lastName}
                        </Text>
                    </View>
                    <View className={'flex-row justify-between items-center gap-2'}>
                        <Text className={'font-bold'}>Total:</Text>
                        <Text>
                            {sale.total} {sale.currency}
                        </Text>
                    </View>
                    <View className={'flex-row justify-between items-center gap-2'}>
                        <Text className={'font-bold'}>Payment method:</Text>
                        <Text>
                            {sale.paymentMethod.description}
                        </Text>
                    </View>
                    <View className={'flex-row justify-between items-center gap-2'}>
                        <Text className={'font-bold'}>Created:</Text>
                        <Text>
                            {formatDate(sale.createdAt)}

                        </Text>
                    </View>

                </View>
            </CardContent>
            {isPending && (
                <CardFooter>
                    <View className="flex-row justify-end space-x-2 w-full">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onPress={() => onStatusUpdate(sale.id, SaleStatus.CANCELLED)}
                        >
                            <Text className="text-white">Cancelar</Text>
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onPress={() => onStatusUpdate(sale.id, SaleStatus.COMPLETED)}
                        >
                            <Text className="text-white">Completar</Text>
                        </Button>
                    </View>
                </CardFooter>
            )}
        </View>
    );
};

export default SaleItem;