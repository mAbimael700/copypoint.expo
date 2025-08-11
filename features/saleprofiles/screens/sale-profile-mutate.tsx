import React from 'react';
import {SaleProfileForm} from "~/features/saleprofiles/components/form/sale-profile-form";
import {FormProvider, useForm} from "react-hook-form";
import {saleProfileFormSchema, SaleProfilesFormValues} from "~/features/saleprofiles/components/form/sale-form-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import FormLayout from "~/components/layout/form-layout";
import {useSaleContext} from "~/features/sales/context/useSaleContext";
import useSaleProfiles from "~/features/saleprofiles/hooks/useSaleProfiles";
import useCreateSaleProfileOperations from "~/features/saleprofiles/hooks/useCreateSaleProfile";
import {useRouter} from "expo-router";

const SaleProfileMutate = () => {
    // Crear un formulario a nivel superior para asegurar que el contexto esté disponible


    const {currentSale} = useSaleContext()
    const {saleProfiles} = useSaleProfiles()
    const {createSaleProfile, updateSaleProfile, isCreating, refetchSales} =
        useCreateSaleProfileOperations()
    const router = useRouter()
    const methods = useForm<SaleProfilesFormValues>({
        resolver: zodResolver(saleProfileFormSchema),
        defaultValues: {
            profiles: [],
        },
    });

    // Actualizar los valores del formulario cuando los perfiles cambian
    React.useEffect(() => {
        if (saleProfiles && saleProfiles.length > 0) {
            console.log('Updating form with saleProfiles:', saleProfiles);
            methods.reset({
                profiles: saleProfiles.map((sp) => ({
                    serviceId: sp.service.id,
                    profileId: sp.profileId,
                    quantity: sp.quantity,
                }))
            });
        }
    }, [saleProfiles, methods]);

    // Log para depuración
    React.useEffect(() => {
        console.log('Sale Profiles:', saleProfiles);
        console.log('Current Sale:', currentSale);
    }, [saleProfiles, currentSale]);

    // Lógica de procesamiento de perfiles extraída del formulario
    async function handleSaleProfileSubmit(
        values: SaleProfilesFormValues
    ): Promise<void> {
        // Log de los valores recibidos para depuración
        console.log('Form values submitted:', values);

        // Comprobar si hay perfiles en el formulario
        if (!values.profiles || values.profiles.length === 0) {
            console.warn('No profiles found in form submission!');

            // Intentar obtener los perfiles directamente del formulario (posible solución alternativa)
            const formValues = methods.getValues();
            if (formValues.profiles && formValues.profiles.length > 0) {
                console.log('Retrieved profiles directly from form state:', formValues.profiles);
                values = formValues;
            } else {
                console.error('No profiles found in form state either');
            }
        }
        try {
            // Obtener los perfiles actuales en la API
            const currentApiProfiles = saleProfiles || []
            const formProfiles = values.profiles

            // Perfiles que necesitan ser creados (no existen en la API)
            const profilesToCreate = formProfiles.filter((formProfile) => {
                return !currentApiProfiles.some(
                    (apiProfile) =>
                        apiProfile.profileId === formProfile.profileId &&
                        apiProfile.service.id === formProfile.serviceId
                )
            })

            // Perfiles que necesitan ser actualizados (existen pero con valores diferentes)
            const profilesToUpdate = formProfiles.filter((formProfile) => {
                const apiProfile = currentApiProfiles.find(
                    (ap) =>
                        ap.profileId === formProfile.profileId &&
                        ap.service.id === formProfile.serviceId
                )
                return apiProfile && apiProfile.quantity !== formProfile.quantity
            })

            // Crear nuevos perfiles
            const createPromises = profilesToCreate.map((profile) => {
                return createSaleProfile({
                    profileId: profile.profileId,
                    serviceId: profile.serviceId,
                    quantity: profile.quantity,
                })
            })

            // Actualizar perfiles existentes
            const updatePromises = profilesToUpdate.map((profile) => {
                return updateSaleProfile(profile.profileId, profile.serviceId, {
                    quantity: profile.quantity,
                })
            })

            // Ejecutar todas las operaciones
            await Promise.all([...createPromises, ...updatePromises])
            await refetchSales()

            // Mostrar mensaje de éxito
            const createdCount = profilesToCreate.length
            const updatedCount = profilesToUpdate.length
            let message = ''

            if (createdCount > 0 && updatedCount > 0) {
                message = `${createdCount} perfiles creados y ${updatedCount} actualizados correctamente`
            } else if (createdCount > 0) {
                message = `${createdCount} perfiles creados correctamente`
            } else if (updatedCount > 0) {
                message = `${updatedCount} perfiles actualizados correctamente`
            } else {
                message = 'No se realizaron cambios en los perfiles'
            }

            console.log(message)


            // Opcional: navegar de vuelta o hacer alguna acción post-submit
            // await navigate({ to: '/sales' })
        } catch (error: any) {
            console.error('Error al procesar perfiles:', error)

        }
    }

    // Verificar si tenemos venta activa y redirigir si no
    React.useEffect(() => {
        const checkSaleAndRedirect = async () => {
            console.log('Checking currentSale:', currentSale);
            if (!currentSale) {
                console.log('No currentSale, redirecting to /sales');
                await router.push('/sales');
            }
        };

        checkSaleAndRedirect();
    }, [currentSale, router]);

    return (
        <FormLayout header={'Create a new sale profile'}
                    className={'px-5'}
                    description={'Register a new sale profile for your copypoint.'}>
            <FormProvider {...methods}>
                <SaleProfileForm
                    defaultValues={methods.getValues()} // Usar los valores actuales del contexto FormProvider
                    handleSubmit={(values) => {
                        console.log('Submitting with form values:', values);

                        // Verificar perfiles
                        if (!values.profiles || values.profiles.length === 0) {
                            console.log('No profiles in submitted values, using form context values');
                            return handleSaleProfileSubmit(methods.getValues());
                        }

                        return handleSaleProfileSubmit(values);
                    }}
                    isSubmitting={isCreating}
                />
            </FormProvider>
        </FormLayout>
    );
};

export default SaleProfileMutate;