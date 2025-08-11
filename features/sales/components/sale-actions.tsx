import React from 'react';
import {View} from 'react-native';
import {Button} from '~/components/ui/button';
import {Text} from '~/components/ui/text';
import {CardFooter} from '~/components/ui/card';
import {CheckCircle, XCircle} from 'lucide-react-native';
import {SaleResponse} from '~/features/sales/types/Sale.type';
import {useSaleContext} from "~/features/sales/context/useSaleContext";
import {useRouter} from "expo-router";

interface SaleActionsProps {
    sale: SaleResponse;
}

export const SaleActions: React.FC<SaleActionsProps> = ({sale}) => {



    return (
        <CardFooter>
            <View className="flex-row justify-end w-full">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500"
                    //onPress={() => onStatusUpdate(saleId, SaleStatus.CANCELLED)}
                >
                    <XCircle size={16} className="mr-1" color="#ef4444"/>
                    <Text className="text-red-500 font-medium">Cancelar</Text>
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-green-500"
                    //onPress={() => onStatusUpdate(saleId, SaleStatus.COMPLETED)}
                >
                    <CheckCircle size={16} className="mr-1" color="white"/>
                    <Text className="text-white font-medium">Completar</Text>
                </Button>
            </View>
        </CardFooter>
    );
};