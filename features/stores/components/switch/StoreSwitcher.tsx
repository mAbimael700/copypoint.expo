import React, {useCallback, useEffect, useMemo} from 'react'
import {ChevronsUpDown, Plus, Store} from 'lucide-react-native'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {useStoreContext} from '~/features/stores/context/useStoreContext'
import {useStores} from '~/features/stores/hooks/useStore'
import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {StoreResponse} from "~/features/stores/types/Store.type";

export const StoreSwitcher = React.memo(() => {
    const {data, isSuccess} = useStores()

    // Usar selector específico para evitar re-renders innecesarios
    const activeStore = useStoreContext((state) => state.activeStore)
    const setActiveStore = useStoreContext((state) => state.setActiveStore)

    // Memorizar el handler para evitar recrear la función
    const handleStoreSelect = useCallback((store: StoreResponse) => {
        setActiveStore(store)
    }, [setActiveStore])

    // Memorizar la lista de stores para evitar re-renders
    const storeItems = useMemo(() => {
        if (!data?.content) return []

        return data.content.map((store, index) => (
            <DropdownMenuItem
                key={store.id}
                onPress={() => handleStoreSelect(store)}
                className='gap-2 px-2'
            >
                <Text>{store.name}</Text>
            </DropdownMenuItem>
        ))
    }, [data?.content, handleStoreSelect])

    // Memorizar la información del store activo
    const activeStoreInfo = useMemo(() => ({
        name: activeStore?.name || 'Not selected store',
        createdAt: activeStore?.createdAt || 'Please select or create a store'
    }), [activeStore?.name, activeStore?.createdAt])


    useEffect(() => {
        if (isSuccess && data && !activeStore) {
            const firstStore = data.content.at(0)
            if (firstStore) {
                setActiveStore(firstStore)
            }
        }
    }, [isSuccess, data, activeStore, setActiveStore])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <View className='data-[state=open]:bg-sidebar-accent
                     data-[state=open]:text-sidebar-accent-foreground
                     border border-border rounded-lg flex flex-row gap-3 w-full justify-between px-4 py-2
                     items-center
                    '
                >
                    <View
                        className={'bg-primary aspect-square flex items-center justify-center px-2 rounded-md border'}>
                        <Store size={22} className='text-primary-foreground'/>
                    </View>
                    <View>
                        <Text className='truncate font-semibold text-lg'>
                            {activeStoreInfo.name}
                        </Text>
                        <Text className='truncate text-xs text-muted-foreground'>
                            {activeStoreInfo.createdAt}
                        </Text>
                    </View>

                    <ChevronsUpDown className='ml-auto' color={'#eee'} size={20}/>
                </View>

            </DropdownMenuTrigger>
            <DropdownMenuContent
                className='w-full'>


                <DropdownMenuLabel className='text-muted-foreground text-xs'>
                    Stores
                </DropdownMenuLabel>
                {storeItems}
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className='gap-2 p-2'
                    onPress={() => {
                        // Implementar lógica para agregar tienda
                    }}
                >
                    <View className=' flex size-6 items-center justify-center rounded-md'>
                        <Plus color={'#eee'}/>
                    </View>
                    <Text className='text-muted-foreground font-medium'>Add store</Text>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
})

StoreSwitcher.displayName = 'StoreSwitcher'