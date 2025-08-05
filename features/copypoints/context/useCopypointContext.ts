import { create } from 'zustand'
import {CopypointResponse} from "~/features/copypoints/types/Copypoint.type";

type CopypointDialogType = 'create' | 'update' | 'delete'

interface CopypointStore {
    // Estados
    open: CopypointDialogType | null
    currentCopypoint: CopypointResponse | null

    // Acciones
    setOpen: (dialogType: CopypointDialogType | null) => void
    setCurrentCopypoint: (copypoint: CopypointResponse | null) => void

    // Acciones adicionales para mayor funcionalidad
    openDialog: (dialogType: CopypointDialogType, copypoint?: CopypointResponse) => void
    closeDialog: () => void
    reset: () => void
}

export const useCopypointStore = create<CopypointStore>((set) => ({
    // Estado inicial
    open: null,
    currentCopypoint: null,


    // Acciones básicas
    setOpen: (dialogType) => set({ open: dialogType }),
    setCurrentCopypoint: (profile) => set({ currentCopypoint: profile }),

    // Acciones compuestas para mayor comodidad
    openDialog: (dialogType, copypoint) => set({
        open: dialogType,
        currentCopypoint: copypoint || null
    }),
    closeDialog: () => set({
        open: null,
        currentCopypoint: null
    }),
    reset: () => set({
        open: null,
        currentCopypoint: null,
    })
}))

// Hook personalizado que mantiene la misma API que tu context original
export const useCopypointContext = () => {
    const store = useCopypointStore()

    return {
        open: store.open,
        setOpen: store.setOpen,
        currentCopypoint: store.currentCopypoint,
        setCurrentCopypoint: store.setCurrentCopypoint,

        // Métodos adicionales disponibles
        openDialog: store.openDialog,
        closeDialog: store.closeDialog,
        reset: store.reset
    }
}