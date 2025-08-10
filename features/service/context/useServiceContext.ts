import { create } from 'zustand'
import {Service} from "~/features/service/types/Service.type";


type ServicesDialogType = 'create' | 'update' | 'delete'

interface ServiceStore {
    open: ServicesDialogType | null
    currentService: Service | null
    setOpen: (dialogType: ServicesDialogType | null) => void
    setCurrentService: (service: Service | null) => void
    // Métodos de conveniencia
    openCreateDialog: () => void
    openUpdateDialog: (service: Service) => void
    openDeleteDialog: (service: Service) => void
    closeDialog: () => void
}

export const useServiceContext = create<ServiceStore>((set) => ({
    open: null,
    currentService: null,
    setOpen: (dialogType) => set({ open: dialogType }),
    setCurrentService: (service) => set({ currentService: service }),
    // Métodos de conveniencia para facilitar el uso
    openCreateDialog: () => set({ open: 'create', currentService: null }),
    openUpdateDialog: (service) => set({ open: 'update', currentService: service }),
    openDeleteDialog: (service) => set({ open: 'delete', currentService: service }),
    closeDialog: () => set({ open: null, currentService: null }),
}))