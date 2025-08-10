import React, {useCallback, useEffect, useMemo} from 'react';
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
import {PaymentMethod} from '~/features/paymentmethod/types/PaymentMethod.type';
import {usePaymentMethodsList} from '~/features/paymentmethod/hooks/usePaymentMethods';

interface PaymentMethodSelectorProps {
    /**
     * Función que se ejecutará cuando se seleccione un método de pago
     */
    onSelect: (paymentMethod: PaymentMethod) => void;

    /**
     * Método de pago seleccionado actualmente
     */
    selectedPaymentMethod?: PaymentMethod | null;

    /**
     * Texto que se mostrará cuando no hay método de pago seleccionado
     */
    placeholder?: string;

    /**
     * Clase CSS adicional para el botón principal
     */
    className?: string;

    /**
     * Si es true, el selector estará deshabilitado
     */
    disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
                                                                         onSelect,
                                                                         selectedPaymentMethod,
                                                                         placeholder = "Select payment method",
                                                                         className,
                                                                         disabled = false,
                                                                     }) => {
    // Obtener métodos de pago usando el hook
    const {
        data: paymentMethods = [],
        isLoading,
        isError,
        error,
        refetch
    } = usePaymentMethodsList();

    // Handler para seleccionar un método de pago
    const handleSelect = useCallback((paymentMethod: PaymentMethod) => {
        onSelect(paymentMethod);
    }, [onSelect]);

    // Seleccionar automáticamente el primer método de pago si no hay ninguno seleccionado
    useEffect(() => {
        if (!selectedPaymentMethod && paymentMethods.length > 0 && !isLoading && !isError) {
            handleSelect(paymentMethods[0]);
        }
    }, [paymentMethods, selectedPaymentMethod, isLoading, isError, handleSelect]);

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
                        {error?.message || 'Can\'t load payment methods.'}
                    </Text>
                    <Button variant="outline" size="sm" className="w-full" onPress={() => refetch()}>
                        <Text>Retry</Text>
                    </Button>
                </View>
            );
        }

        if (paymentMethods.length === 0) {
            return (
                <View className="p-4">
                    <Text className="text-center text-muted-foreground mb-3">
                        There are no payment methods.
                    </Text>
                </View>
            );
        }

        return (
            <>
                <DropdownMenuLabel>Métodos de pago</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {paymentMethods.map((paymentMethod) => (
                    <DropdownMenuItem
                        key={paymentMethod.id}
                        onPress={() => handleSelect(paymentMethod)}
                        className="flex-row justify-between items-center"
                    >
                        <View className="flex-1">
                            <Text>{paymentMethod.description}</Text>
                        </View>
                        {selectedPaymentMethod?.id === paymentMethod.id && (
                            <Check className="w-4 h-4 text-primary"/>
                        )}
                    </DropdownMenuItem>
                ))}
            </>
        );
    }, [isLoading,
        isError,
        paymentMethods,
        handleSelect,
        refetch,
        error?.message,
        selectedPaymentMethod?.id]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`justify-between ${className}`}
                    disabled={disabled}
                >
                    <Text className={selectedPaymentMethod ? "text-foreground" : "text-muted-foreground"}>
                        {selectedPaymentMethod?.description || placeholder}
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

export default React.memo(PaymentMethodSelector);