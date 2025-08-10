import React, {useCallback} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from 'react-native';
import {Text} from '~/components/ui/text';
import {Button} from '~/components/ui/button';
import {SaleStatus} from '~/features/sales/types/Sale.type';
import useSalesOperations from '~/features/sales/hooks/useSales';
import SaleItem from "~/features/sales/components/sale-item";


interface SalesListProps {
    showPendingOnly?: boolean;
}

const SalesList = ({showPendingOnly = false}: SalesListProps) => {
    const {
        sales,
        pendingSales,
        isLoading,
        isError,
        error,
        refetch,
        updateSaleStatus,
        isUpdatingStatus
    } = useSalesOperations();

    const salesToDisplay = showPendingOnly ? pendingSales : sales;

    const handleStatusUpdate = useCallback(async (saleId: number | string, status: SaleStatus) => {
        try {
            await updateSaleStatus(saleId, status);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
        }
    }, [updateSaleStatus]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large"/>
                <Text className="mt-4">Cargando ventas...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-500 text-center mb-4">Error al cargar ventas</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                    {error?.message || 'Ocurrió un error desconocido'}
                </Text>
                <Button onPress={refetch}>
                    <Text>Reintentar</Text>
                </Button>
            </View>
        );
    }

    if (salesToDisplay.length === 0) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-xl text-center mb-4">
                    {showPendingOnly ? 'No hay ventas pendientes' : 'No hay ventas registradas'}
                </Text>
                <Button onPress={refetch}>
                    <Text>Actualizar</Text>
                </Button>
            </View>
        );
    }

    return (
        <FlatList
            data={salesToDisplay}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                <SaleItem
                    sale={item}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
            contentContainerStyle={{gap: 4}}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading || isUpdatingStatus}
                    onRefresh={handleRefresh}
                />
            }
            ListFooterComponent={salesToDisplay.length > 0 ? (
                <Text className="text-center text-muted-foreground py-4">
                    {showPendingOnly
                        ? `${salesToDisplay.length} pending sales`
                        : `${salesToDisplay.length} total sales`}
                </Text>
            ) : null}
        />
    );
};

export default SalesList;
