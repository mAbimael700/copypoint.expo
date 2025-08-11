import {useCallback, useRef} from 'react';
import {BottomSheetModal} from '~/components/ui/bottom-sheet';

export const useSaleBottomSheet = () => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handlePresentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    return {
        bottomSheetModalRef,
        handlePresentModal,
        handleCloseModal
    };
};
