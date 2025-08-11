import React, { useRef, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import {
    BottomSheetHandle,
    BottomSheetModal,
    BottomSheetView,
} from '~/components/ui/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import {
    CheckCircle,
    Edit,
    MoreVertical,
    Trash2,
    XCircle
} from 'lucide-react-native';
import { SaleResponse, SaleStatus } from '~/features/sales/types/Sale.type';
import {useSaleContext} from "~/features/sales/context/useSaleContext";
import {useRouter} from "expo-router";

interface SaleBottomSheetProps {
    sale: SaleResponse;
    onStatusUpdate: (saleId: number | string, status: SaleStatus) => Promise<void>;
    onEdit?: (sale: SaleResponse) => void;
    onDelete?: (saleId: number | string) => void;
    onViewDetails?: (sale: SaleResponse) => void;
}

export const SaleBottomSheet = React.forwardRef<BottomSheetModal, SaleBottomSheetProps>(
    ({ sale, onStatusUpdate, onEdit, onDelete, onViewDetails }, ref) => {
        const animatedIndex = useSharedValue<number>(0);
        const animatedPosition = useSharedValue<number>(0);
        const snapPoints = useMemo(() => ["40%", "60%"], []);
        const isPending = sale.status === SaleStatus.PENDING;

        const {setCurrentSale} = useSaleContext();
        const router = useRouter();


        const handleCloseModal = useCallback(() => {
            (ref as React.MutableRefObject<BottomSheetModal>)?.current?.dismiss();
        }, [ref]);

        const handleStatusUpdateAndClose = useCallback(async (status: SaleStatus) => {
            try {
                await onStatusUpdate(sale.id, status);
                handleCloseModal();
            } catch (error) {
                console.error('Error al actualizar estado:', error);
                handleCloseModal();
            }
        }, [onStatusUpdate, sale.id, handleCloseModal]);

        const handleEditAndClose = useCallback(() => {
            setCurrentSale(sale);
            router.push('/(app)/sales/profiles');
            handleCloseModal();
        }, [sale, handleCloseModal, setCurrentSale, router]);

        const handleDeleteAndClose = useCallback(() => {
            onDelete?.(sale.id);
            handleCloseModal();
        }, [onDelete, sale.id, handleCloseModal]);

        const handleViewDetailsAndClose = useCallback(() => {
            onViewDetails?.(sale);
            handleCloseModal();
        }, [onViewDetails, sale, handleCloseModal]);

        return (
            <BottomSheetModal
                ref={ref}
                index={0}
                snapPoints={snapPoints}
                handleComponent={() => (
                    <BottomSheetHandle
                        className="bg-primary/20 mt-2"
                        animatedIndex={animatedIndex}
                        animatedPosition={animatedPosition}
                    />
                )}
            >
                <BottomSheetView className="flex-1 justify-between gap-4 px-4 py-6 bg-background">
                    <View className="space-y-2 bg-accent border border-muted rounded-lg w-full">
                        {/* Ver detalles */}
                        {onViewDetails && (
                            <Button
                                variant="ghost"
                                className="w-full justify-start border-b border-muted-foreground"
                                onPress={handleViewDetailsAndClose}
                            >
                                <View className="flex-row items-center">
                                    <MoreVertical size={20} color="#6b7280" />
                                    <Text className="ml-3 text-base">Ver detalles</Text>
                                </View>
                            </Button>
                        )}

                        {/* Editar */}
                        {onEdit && (
                            <Button
                                variant="ghost"
                                className="w-full justify-start border-b border-muted-foreground"
                                onPress={handleEditAndClose}
                            >
                                <View className="flex-row items-center">
                                    <Edit size={20} color="#3b82f6" />
                                    <Text className="ml-3 text-base">Editar venta</Text>
                                </View>
                            </Button>
                        )}

                        {/* Acciones de estado */}
                        {isPending && (
                            <>
                                <View className="border-t border-gray-200 my-2" />
                                <Text className="text-sm font-medium text-gray-600 mb-2">
                                    Cambiar estado:
                                </Text>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onPress={() => handleStatusUpdateAndClose(SaleStatus.COMPLETED)}
                                >
                                    <View className="flex-row items-center">
                                        <CheckCircle size={20} color="#10b981" />
                                        <Text className="ml-3 text-base text-green-600">Completar venta</Text>
                                    </View>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start border-b border-muted-foreground"
                                    onPress={() => handleStatusUpdateAndClose(SaleStatus.CANCELLED)}
                                >
                                    <View className="flex-row items-center">
                                        <XCircle size={20} color="#ef4444" />
                                        <Text className="ml-3 text-base text-red-600">Cancelar venta</Text>
                                    </View>
                                </Button>
                            </>
                        )}

                        {/* Eliminar */}
                        {onDelete && (
                            <>
                                <View className="border-t border-gray-200 my-2" />
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onPress={handleDeleteAndClose}
                                >
                                    <View className="flex-row items-center">
                                        <Trash2 size={20} color="#ef4444" />
                                        <Text className="ml-3 text-base">Eliminar venta</Text>
                                    </View>
                                </Button>
                            </>
                        )}
                    </View>

                    <Button
                        variant="outline"
                        className="mt-6"
                        onPress={handleCloseModal}
                    >
                        <Text>Cancelar</Text>
                    </Button>
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);