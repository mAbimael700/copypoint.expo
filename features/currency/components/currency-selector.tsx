import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, TextInput, View} from 'react-native';
import {Text} from '~/components/ui/text';
import {Button} from '~/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {Check, ChevronsUpDown} from 'lucide-react-native';
import {useExchangeRateData} from "~/features/currency/hooks/useExchangeRate";

interface CurrencySelectorProps {
    /**
     * Función opcional que se ejecutará cuando se seleccione un currency
     */
    onSelect: (ISO: string, description: string) => void

    /**
     * Texto que se mostrará cuando no hay copypoint seleccionado
     */
    placeholder?: string;

    /**
     * Clase CSS adicional para el botón principal
     */
    className?: string;

    label: string

}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
                                                               onSelect,
                                                               placeholder = "Select currency",
                                                               className,
                                                               label
                                                           }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);

    // Obtener copypoints usando el hook
    const {currencies, isLoading, isError, error, refetch} = useExchangeRateData()

    // Handler para seleccionar un copypoint
    const handleSelect = useCallback((ISO: string, description: string) => {
        onSelect(ISO, description);
        setOpen(false);
        setSearchQuery('');
    }, [onSelect]);


    // Memorizar contenido del dropdown según el estado
    const dropdownContent = useMemo(() => {
        if (isLoading) {
            return (
                <View className="p-4 flex items-center justify-center" style={{height: 150}}>
                    <ActivityIndicator size="small"/>
                    <Text className="mt-2 text-muted-foreground">Loading currencies...</Text>
                </View>
            );
        }

        if (isError) {
            return (
                <View className="p-4">
                    <Text className="text-destructive text-center mb-2">Error loading</Text>
                    <Text className="text-muted-foreground text-sm mb-2">
                        {error?.message || 'Can\'t load copypoints.'}
                    </Text>
                    <Button variant="outline" size="sm" className="w-full" onPress={() => refetch()}>
                        <Text>Reintentar</Text>
                    </Button>
                </View>
            );
        }

        if (currencies.length === 0) {
            return (
                <View className="p-4">
                    <Text className="text-center text-muted-foreground mb-3">
                        There are no currencies.
                    </Text>
                </View>
            );
        }

        // Filtrar monedas basado en la búsqueda
        const filteredCurrencies = searchQuery
            ? currencies.filter(currency =>
                currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                currency.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : currencies;

        // Verificar si no hay resultados después de filtrar
        if (filteredCurrencies.length === 0 && searchQuery) {
            return (
                <View style={{maxHeight: 300}}>
                    <DropdownMenuLabel>Currencies</DropdownMenuLabel>
                    <View className="px-2 py-2">
                        <View className="flex-row items-center border border-input rounded-md px-2 py-1 mb-1">
                            <Text className="text-muted-foreground text-xs mr-2">🔍</Text>
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search currency..."
                                className="flex-1 text-sm text-foreground"
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                    </View>
                    <DropdownMenuSeparator/>
                    <View className="p-4">
                        <Text className="text-center text-muted-foreground">
                            No currencies found for "{searchQuery}"
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <View>
                <DropdownMenuLabel>Currencies</DropdownMenuLabel>
                <View className="px-2 py-2">
                    <View className="flex-row items-center border border-input rounded-md px-2 py-1 mb-1">
                        <Text className="text-muted-foreground text-xs mr-2">🔍</Text>
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search currency..."
                            className="flex-1 text-sm"
                            placeholderTextColor="#9ca3af"
                            autoCapitalize="none"
                        />
                    </View>
                </View>
                <DropdownMenuSeparator/>
                {searchQuery ? (
                    <View className="px-2 py-1">
                        <Text className="text-xs text-muted-foreground">Showing results for "{searchQuery}"</Text>
                    </View>
                ) : null}
                <FlatList
                    data={filteredCurrencies}
                    keyExtractor={(item) => item.code}
                    style={{height: 300}}
                    initialNumToRender={10}
                    maxToRenderPerBatch={20}
                    windowSize={5}
                    showsVerticalScrollIndicator={true}
                    renderItem={({item}) => (
                        <DropdownMenuItem
                            key={item.code}
                            onPress={() => handleSelect(item.code, item.name)}
                            className="flex-row justify-between items-center py-3"
                        >
                            <View className="flex-1">
                                <Text className="font-medium">{item.code}</Text>
                                <Text className="text-xs text-muted-foreground">{item.name}</Text>
                            </View>
                            {label === item.code && (
                                <Check className="w-4 h-4 text-primary"/>
                            )}
                        </DropdownMenuItem>
                    )}
                />
            </View>
        );
    }, [isLoading,
        isError,
        handleSelect,
        currencies,
        error?.message,
        refetch,
        label,
        searchQuery,
        setSearchQuery]);


    return (
        <DropdownMenu onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>

                <Button
                    variant="outline"
                    className={`flex-row items-center w-full ${className}`}
                >
                    <View style={{ flex: 1 }}>
                        <Text className={label  ? "text-foreground" : "text-muted-foreground"}>
                            {label || placeholder}
                        </Text>
                    </View>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-full p-0"
                style={{
                    maxHeight: 350,
                    width: '100%'
                }}
            >
                {dropdownContent}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default React.memo(CurrencySelector);