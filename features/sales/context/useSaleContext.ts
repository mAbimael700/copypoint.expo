import {create} from 'zustand'
import {SaleResponse} from "~/features/sales/types/Sale.type";


interface SaleStore {
    currentSale: SaleResponse | null
    setCurrentSale: (sale: SaleResponse | null) => void
    // Métodos de conveniencia
}

export const useSaleContext = create<SaleStore>
((set) => ({
    currentSale: null,
    setCurrentSale: (sale) => set({currentSale: sale}),
    // Métodos de conveniencia para facilitar el uso
}))