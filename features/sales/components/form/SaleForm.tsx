import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useHookFormNavigationGuard} from '~/hooks/useNavigationGuard';
import {Button} from '~/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '~/components/ui/form';
import {FormProps} from '~/types/FormProps';
import {CopypointResponse} from '~/features/copypoints/types/Copypoint.type';
import {useCopypointContext} from '~/features/copypoints/context/useCopypointContext';
import CurrencySelector from '~/features/currency/components/currency-selector';
import {PaymentMethod} from '~/features/paymentmethod/types/PaymentMethod.type';
import {Text} from "~/components/ui/text";
import {useEffect, useState} from "react";
import {cn} from "~/lib/utils";
import PaymentMethodSelector from "~/features/paymentmethod/components/selector/payment-method-selector";
import CopypointSelector from "~/features/copypoints/components/selector/copypoint-selector";
import {ScrollView, View} from "react-native";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Store, ShoppingCart, Banknote} from "lucide-react-native";


const formSchema = z.object({
    currency: z.string().length(3, 'Name is required.'),
    paymentMethodId: z.number().positive(),
})

export type SaleFormValues = z.infer<typeof formSchema>

export const SaleForm = ({
                             defaultValues = {currency: '', paymentMethodId: 0},
                             handleSubmit,
                             className,
                             finallyFn
                         }: FormProps<SaleFormValues> & { className?: string }) => {
    const {currentCopypoint, setCurrentCopypoint} = useCopypointContext()
    const [showCopypointSelector, setShowCopypointSelector] = useState<boolean>(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)

    const form = useForm<SaleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    function handleOnSelectCopypoint(copypoint: CopypointResponse) {
        setCurrentCopypoint(copypoint)
    }

    const handleOnSelectCurrencyCode = (ISO: string) => {
        form.setValue('currency', ISO, {shouldDirty: true})
    }

    const handleOnSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
        form.setValue('paymentMethodId', paymentMethod.id, {shouldDirty: true})
        setSelectedPaymentMethod(paymentMethod)
    }

    // Función para resetear completamente el formulario
    const resetForm = () => {
        console.log('Resetting form completely')
        form.reset({
            currency: '',
            paymentMethodId: 0
        })
        setSelectedPaymentMethod(null)
        // Forzar actualización de los campos
        setTimeout(() => {
            form.trigger()
        }, 100)
    }

    const {NavigationGuardDialog, markAsSaved, hasUnsavedChanges} =
        useHookFormNavigationGuard(form)

    const onSubmit = async (data: SaleFormValues) => {
        try {
            await handleSubmit(data)
            // Marcar como guardado después del éxito
            markAsSaved(data)
            // Usar la función resetForm para garantizar un reseteo completo
            resetForm()
            if (finallyFn) {
                finallyFn()
            }
        } catch (_) {
            // El formulario sigue bloqueado si hay error
        }
    }

    // Reiniciar selectedPaymentMethod cuando cambie el valor del formulario
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'paymentMethodId' && (!value.paymentMethodId || value.paymentMethodId === 0)) {
                setSelectedPaymentMethod(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    useEffect(() => {
        if (!currentCopypoint) {
            setShowCopypointSelector(true)
        }
    }, []);

    return (
        <Form {...form}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                id='service-form'
                className={cn('px-4', className)}
                contentContainerStyle={{ paddingBottom: 80, gap: 16 }}
            >
                {/* Sección de Copypoint */}
                <Card className="mb-4 border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <View className="flex-row items-center gap-2">
                            <Store size={20} color="#3b82f6" />
                            <CardTitle className="text-lg">Copypoint</CardTitle>
                        </View>
                        <CardDescription>Select copypoint for the sale</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <View className="mb-2">
                            <CopypointSelector onSelect={handleOnSelectCopypoint}/>
                        </View>
                    </CardContent>
                </Card>

                {/* Sección de Detalles de Pago */}
                <Card className="mb-4 border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <View className="flex-row items-center gap-2">
                            <Banknote size={20} color="#10b981" />
                            <CardTitle className="text-lg">Payment details</CardTitle>
                        </View>
                        <CardDescription>Configure currency and payment method</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <View className="space-y-4">
                            {/* Campo de Moneda */}
                            <FormField
                                control={form.control}
                                name='currency'
                                render={({field}) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <CurrencySelector
                                                onSelect={handleOnSelectCurrencyCode}
                                                label={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Campo de Método de Pago */}
                            <FormField
                                control={form.control}
                                name='paymentMethodId'
                                render={({field}) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Payment method</FormLabel>
                                        <FormControl>
                                            <PaymentMethodSelector
                                                selectedPaymentMethod={selectedPaymentMethod}
                                                onSelect={handleOnSelectPaymentMethod}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </View>
                    </CardContent>
                </Card>

                {/* Alerta de cambios sin guardar */}
                {hasUnsavedChanges && (
                    <View
                        className='w-full flex flex-row items-center justify-center gap-2 py-3 px-4 bg-amber-100 rounded-md mb-4'>
                        <Text className="text-amber-600">⚠️</Text>
                        <Text className="text-destructive">There are changes without save</Text>
                    </View>
                )}

                <View>
                    <NavigationGuardDialog/>
                </View>

                {/* Botón de Registro */}
                <View className="w-full mt-4">
                    <Button 
                        onPress={form.handleSubmit(onSubmit)} 
                        className="w-full py-3 flex-row gap-4"
                    >
                        <ShoppingCart size={18} color="black" className="mr-2" />
                        <Text className="font-medium">Register sale</Text>
                    </Button>
                </View>
            </ScrollView>
        </Form>
    )
}
