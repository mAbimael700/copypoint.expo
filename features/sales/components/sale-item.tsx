import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { SaleResponse, SaleStatus } from "~/features/sales/types/Sale.type";
import { getStatusConfig } from "~/features/sales/utils/getStatus";
import {useSaleBottomSheet} from "~/features/sales/hooks/useSaleBottomSheet";
import {SaleHeader} from "~/features/sales/components/sale-header";
import {SaleContent} from "~/features/sales/components/sale-content";
import {SaleActions} from "~/features/sales/components/sale-actions";
import {SaleBottomSheet} from "~/features/sales/components/sale-bottom-sheet";


interface SaleItemProps {
    sale: SaleResponse;
    onStatusUpdate: (saleId: number | string, status: SaleStatus) => Promise<void>;
    onEdit?: (sale: SaleResponse) => void;
    onDelete?: (saleId: number | string) => void;
    onViewDetails?: (sale: SaleResponse) => void;
}

const SaleItem: React.FC<SaleItemProps> = ({
                                               sale,
                                               onStatusUpdate,
                                               onEdit,
                                               onDelete,
                                               onViewDetails
                                           }) => {
    const isPending = sale.status === SaleStatus.PENDING;
    const { color: statusColor } = getStatusConfig(sale.status);
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const { bottomSheetModalRef, handlePresentModal } = useSaleBottomSheet();

    return (
        <>
            <Pressable
                onLongPress={handlePresentModal}
                delayLongPress={200}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                className="w-full overflow-hidden border-l-4 active:bg-gray-50 border-b border-muted-foreground"
                style={{
                    borderLeftColor: statusColor
                        .replace('text', 'border')
                        .split('-')
                        .slice(0, 2)
                        .join('-'),
                    opacity: isPressed ? 0.7 : 1
                }}
            >
                <View>
                    <SaleHeader
                        saleId={sale.id}
                        status={sale.status}
                        createdAt={sale.createdAt}
                        updatedAt={sale.updatedAt}
                    />
                </View>

                <SaleContent sale={sale} />

                {isPending && (
                    <SaleActions
                        sale={sale}
                    />
                )}
            </Pressable>

            <SaleBottomSheet
                ref={bottomSheetModalRef}
                sale={sale}
                onStatusUpdate={onStatusUpdate}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
            />
        </>
    );
};

export default SaleItem;