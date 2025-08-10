import {StoreResponse} from "~/features/stores/types/Store.type";
import {create} from "zustand";
import {subscribeWithSelector} from 'zustand/middleware'

interface StoreState {
    activeStore: StoreResponse | null
    setActiveStore: (store: StoreResponse) => void
}

export const useStoreContext = create<StoreState>()(
    subscribeWithSelector((set, get) => ({
        activeStore: null,
        setActiveStore: (store) => {
            // Solo actualizar si realmente cambió
            const currentStore = get().activeStore
            if (currentStore?.id !== store.id) {
                set({ activeStore: store })
            }
        },
    }))
)