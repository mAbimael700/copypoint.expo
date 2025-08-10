import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useAuth} from '~/features/auth/store/AuthStore'
import {useStoreContext} from "~/features/stores/context/useStoreContext";
import {StoreCreationDTO, StoreResponse} from "~/features/stores/types/Store.type";
import StoreService from "~/features/stores/services/StoreService";


export const useCreateStore = () => {
    const {accessToken} = useAuth()
    const queryClient = useQueryClient()
    const {setActiveStore} = useStoreContext()

    return useMutation({
        mutationFn: (newStore: StoreCreationDTO) =>
            StoreService.create(accessToken ?? '', newStore),

        onSuccess: (createdStore: StoreResponse) => {
            // Actualiza directamente el cache local si ya hay stores cargados
            queryClient.setQueryData(['stores'], (prev: any) => {
                if (!prev) return {content: [createdStore]}
                return {
                    ...prev,
                    content: [createdStore, ...prev.content],
                }
            })

            // Establece la nueva tienda como activa
            setActiveStore(createdStore)
        },
        onError(error, _e, _) {
            console.error(`Error creating store: ${error.message}`)
        },
    })
}
