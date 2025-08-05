import {StoreResponse} from "~/features/stores/types/Store.type";
import {create} from "zustand";

interface StoreState {
    activeStore: StoreResponse | null
    setActiveStore: (store: StoreResponse) => void
}

export const useStoreContext = create<StoreState>((set) => ({
    activeStore: null,
    setActiveStore: (store) => set({activeStore: store}),
}))
