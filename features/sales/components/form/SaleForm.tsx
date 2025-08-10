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
import {View} from "react-native";


const formSchema = z.object({
    currency: z.string().length(3, 'Name is required.'),
    paymentMethodId: z.number().positive(),
})

export type SaleFormValues = z.infer<typeof formSchema>

export const SaleForm = ({
                             defaultValues = {currency: '', paymentMethodId: 0},
                             handleSubmit,
                         }: FormProps<SaleFormValues>) => {
    const {currentCopypoint, setCurrentCopypoint} = useCopypointContext()
    const [showCopypointSelector, setShowCopypointSelector] = useState<boolean>(false);

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
    }

    const {NavigationGuardDialog, markAsSaved, hasUnsavedChanges} =
        useHookFormNavigationGuard(form)

    const onSubmit = async (data: SaleFormValues) => {
        try {
            await handleSubmit(data)
            // Marcar como guardado después del éxito
            markAsSaved(data)
        } catch (_) {
            // El formulario sigue bloqueado si hay error
        }
    }

    useEffect(() => {
        if (!currentCopypoint) {
            setShowCopypointSelector(true)
        }
    }, []);

    return (
        <Form {...form}>
            <View
                id='service-form'
                className='space-y-3'
            >
                <Text className={cn(
                    'text-base font-medium')}>
                    Select copypoint</Text>
                <CopypointSelector onSelect={handleOnSelectCopypoint}/>


                <FormField
                    control={form.control}
                    name='currency'
                    render={({field}) => (
                        <FormItem className='space-y-1'>
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
                <FormField
                    control={form.control}
                    name='paymentMethodId'
                    render={({field}) => (
                        <FormItem className='space-y-1'>
                            <FormLabel>Payment method</FormLabel>
                            <FormControl>
                                <PaymentMethodSelector
                                    onSelect={handleOnSelectPaymentMethod}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />


                {hasUnsavedChanges && (
                    <View className='flex items-center gap-2 text-sm text-amber-600'>
                        <Text>⚠️</Text>
                        <Text>There are changes without save</Text>
                    </View>
                )}
                <NavigationGuardDialog/>

                <Button onPress={form.handleSubmit(handleSubmit)}>Register</Button>
            </View>
        </Form>
    )
}
