import React, {useCallback, useMemo} from 'react';
import {ActivityIndicator, View} from 'react-native';
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

    // Obtener copypoints usando el hook
    const {currencies, isLoading, isError, error, refetch} = useExchangeRateData()

    // Handler para seleccionar un copypoint
    const handleSelect = useCallback((ISO: string, description: string) => {
        onSelect(ISO, description);
    }, [onSelect]);


    // Memorizar contenido del dropdown según el estado
    const dropdownContent = useMemo(() => {
        if (isLoading) {
            return (
                <View className="p-4 flex items-center justify-center">
                    <ActivityIndicator size="small"/>
                    <Text className="mt-2 text-muted-foreground">Loading...</Text>
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

        return (
            <>
                <DropdownMenuLabel>Copypoints</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {currencies.map((currency) => (
                    <DropdownMenuItem
                        key={currency.code}
                        onPress={() => handleSelect(currency.code, currency.name)}
                        className="flex-row justify-between items-center"
                    >
                        <View className="flex-1">
                            <Text>{currency.code}</Text>
                            <Text>{currency.name}</Text>
                        </View>
                        {label === currency.code && (
                            <Check className="w-4 h-4 text-primary"/>
                        )}
                    </DropdownMenuItem>
                ))}
            </>
        );
    }, [isLoading,
        isError,
        handleSelect,
        currencies,
        error?.message,
        refetch,
        label]);


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`justify-between ${className}`}
                >
                    <Text className={label ? "text-foreground" : "text-muted-foreground"}>
                        {label || placeholder}
                    </Text>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
                {dropdownContent}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default React.memo(CurrencySelector);