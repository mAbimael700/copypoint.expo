'use client'
import {useFieldArray, useForm} from 'react-hook-form'
import React, {useMemo, useCallback} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useHookFormNavigationGuard} from '~/hooks/useNavigationGuard'
import {Button} from '~/components/ui/button'
import {Form} from '~/components/ui/form'
import {ProfileResponse} from '~/features/profiles/types/Profile.type'
import ProfileSelector from '~/features/profiles/components/profile-selector'
import * as ProfileHooks from '~/features/profiles/hooks/useProfiles'
import {SaleProfileItem} from '~/features/saleprofiles/components/input/sale-profile-item'
import useSaleProfiles from '~/features/saleprofiles/hooks/useSaleProfiles'
import {ServiceSelector} from '~/features/service/components/selector/service-selector'
import {useServiceContext} from '~/features/service/context/useServiceContext'
import {saleProfileFormSchema, SaleProfilesFormValues} from '~/features/saleprofiles/components/form/sale-form-schema'
import {FormProps} from "~/types/FormProps"
import {View} from "react-native"
import {Text} from "~/components/ui/text"

type saleProfileInput =
    | 'profiles'
    | `profiles.${number}`
    | `profiles.${number}.profileId`
    | `profiles.${number}.quantity`

export interface SaleProfileFormProps extends FormProps<SaleProfilesFormValues> {
    isSubmitting?: boolean
}

export function SaleProfileForm({
                                    defaultValues = {profiles: []},
                                    handleSubmit,
                                    isSubmitting = false,
                                }: SaleProfileFormProps) {
    const {currentService} = useServiceContext()
    const {profiles, isLoading: isLoadingProfiles} = ProfileHooks.useProfileByCopypointOperations()
    const {saleProfiles} = useSaleProfiles()

    // 1. Define your form.
    const form = useForm<SaleProfilesFormValues>({
        resolver: zodResolver(saleProfileFormSchema),
        defaultValues,
        values: defaultValues,
    })

    // 4. Usar useFieldArray con el tipo explícito
    const profilesArray = useFieldArray({
        control: form.control,
        name: 'profiles',
    })

    const {
        NavigationGuardDialog,
        hasUnsavedChanges,
        markAsSaved,
        markAsChanged,
    } = useHookFormNavigationGuard(form)

    // Usar form.watch para obtener los valores actuales del formulario y forzar re-render
    const watchedProfiles = form.watch('profiles')

    const handleOnProfileSelect = useCallback((profile: ProfileResponse) => {
        if (currentService) {
            console.log('Profile selected:', profile.id, profile.name);
            const currentSelectedProfiles = form.getValues('profiles')
            console.log('Current profiles in form:', currentSelectedProfiles);

            const profileResult = currentSelectedProfiles.findIndex(
                (sp) => sp.profileId === profile.id
            )

            if (profileResult !== -1) {
                console.log('Profile already exists at index:', profileResult);
                const currentValue = form.getValues(
                    `profiles.${profileResult}.quantity`
                )
                const newQuantity = currentValue + 1

                form.setValue(`profiles.${profileResult}.quantity`, newQuantity, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                })

                console.log('Updated quantity for existing profile:', newQuantity);
                markAsChanged()
                return
            }

            // Crear nuevo perfil para agregar
            const newProfile = {
                profileId: profile.id,
                serviceId: currentService.id,
                quantity: 1,
            };

            // Agregar nuevo perfil al formulario
            profilesArray.append(newProfile);
            console.log('Profile appended, new form values:', form.getValues('profiles'));

            markAsChanged()
        }
    }, [currentService, form, profilesArray, markAsChanged])

    const handleQuantityChange = useCallback(
        (profileId: number, serviceId: number, increment: number) => {
            console.log('Changing quantity for profile:', profileId, 'serviceId:', serviceId, 'increment:', increment);

            const profiles = form.getValues('profiles');
            console.log('Current profiles before change:', profiles);

            const fieldIndex = profiles.findIndex(
                (field) =>
                    field.profileId === profileId && field.serviceId === serviceId
            )

            console.log('Found profile at index:', fieldIndex);

            if (fieldIndex === -1) {
                console.log('Profile not found in form values');
                return;
            }

            const currentValue = form.getValues(`profiles.${fieldIndex}.quantity`);
            const newValue = Math.max(1, currentValue + increment);

            console.log('Updating quantity from', currentValue, 'to', newValue);

            form.setValue(`profiles.${fieldIndex}.quantity`, newValue, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            });

            const updatedValue = form.getValues(`profiles.${fieldIndex}.quantity`);
            console.log('Value after update:', updatedValue);

            markAsChanged();
        },
        [form, markAsChanged]
    )

    const handleRemoveProfile = useCallback(
        (profileId: number) => {
            // Buscar el índice del perfil en el array de campos del formulario
            const fieldIndex = profilesArray.fields.findIndex(
                (field) => field.profileId === profileId
            )
            // Si se encuentra el perfil en el formulario, eliminarlo
            if (fieldIndex !== -1) {
                profilesArray.remove(fieldIndex)
                markAsChanged()
            }
        },
        [profilesArray, markAsChanged]
    )

    const handleValueChange = useCallback(
        (
            fieldName: string,
            profileId: number,
            serviceId: number,
            value: number
        ) => {
            console.log('Setting value for field:', fieldName, 'to value:', value);
            try {
                if (fieldName && fieldName.includes('.')) {
                    form.setValue(fieldName as saleProfileInput, value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true
                    });
                } else {
                    console.log('Field path not valid, searching by profileId and serviceId');
                    const profiles = form.getValues('profiles');
                    const fieldIndex = profiles.findIndex(
                        p => p.profileId === profileId && p.serviceId === serviceId
                    );

                    if (fieldIndex !== -1) {
                        console.log('Found profile at index:', fieldIndex);
                        form.setValue(`profiles.${fieldIndex}.quantity` as saleProfileInput, value, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true
                        });
                    } else {
                        console.warn('Profile not found in form values, cannot update');
                    }
                }

                const profiles = form.getValues('profiles');
                console.log('Form profiles after update:', profiles);

                form.trigger('profiles');
                markAsChanged();
            } catch (error) {
                console.error('Error updating form value:', error);
            }
        },
        [form, markAsChanged]
    )

    const onSubmit = useCallback(async (values: SaleProfilesFormValues) => {
        console.log('onSubmit called with values:', values);

        const currentFormValues = form.getValues();
        console.log('Current form state values:', currentFormValues);

        if (values.profiles.length !== currentFormValues.profiles.length) {
            console.log('Warning: values received in onSubmit differ from current form state');
            values = currentFormValues;
        }
        try {
            markAsSaved()
            if (handleSubmit) {
                await handleSubmit(values)
            }
        } catch (error: any) {
            markAsChanged()
        }
    }, [handleSubmit, markAsSaved, markAsChanged, form])

    // Memoizar servicios únicos - CORREGIDO: usar watchedProfiles en lugar de form.watch
    const uniqueServices = useMemo(() => {
        const apiServices = saleProfiles
            ? Array.from(new Set(saleProfiles.map((sp) => sp.service.name)))
            : []

        const formServices: string[] = []

        // Usar watchedProfiles para asegurar que se detecten cambios
        watchedProfiles.forEach((profile) => {
            if (currentService && profile.serviceId === currentService.id) {
                if (!formServices.includes(currentService.name)) {
                    formServices.push(currentService.name)
                }
            }
        })

        const allServices = [...new Set([...apiServices, ...formServices])]
        return allServices
    }, [saleProfiles, currentService, watchedProfiles])

    // Memoizar perfiles nuevos - CORREGIDO: usar watchedProfiles
    const getNewProfilesForService = useCallback((serviceDescription: string) => {
        if (!currentService || currentService.name !== serviceDescription) {
            return []
        }

        // Usar watchedProfiles para detectar cambios en tiempo real
        const serviceProfiles = watchedProfiles.filter(fp => fp.serviceId === currentService.id)

        const newProfiles = serviceProfiles.filter((formProfile) => {
            return !saleProfiles?.some(
                (apiProfile) =>
                    apiProfile.profileId === formProfile.profileId &&
                    apiProfile.service.id === formProfile.serviceId
            )
        })

        console.log('New profiles for service', serviceDescription, ':', newProfiles)

        return newProfiles
            .map((newProfile) => {
                const profileData = profiles?.find(
                    (p) => p.id === newProfile.profileId
                )
                if (!profileData) {
                    console.warn('Profile data not found for profileId:', newProfile.profileId)
                    return null
                }

                // Encontrar el índice en watchedProfiles (que es la fuente de verdad actual)
                const fieldIndex = watchedProfiles.findIndex(
                    (field) =>
                        field.profileId === newProfile.profileId &&
                        field.serviceId === newProfile.serviceId
                )

                const tempSaleProfile = {
                    profileId: newProfile.profileId,
                    name: profileData.name,
                    description: profileData.description,
                    unitPrice: profileData.unitPrice,
                    quantity: newProfile.quantity,
                    service: {
                        id: newProfile.serviceId,
                        name: serviceDescription,
                    },
                }

                console.log('Created temp sale profile:', tempSaleProfile)

                return {
                    key: `new-${newProfile.profileId}-${newProfile.serviceId}`,
                    fieldIndex,
                    newProfile,
                    tempSaleProfile,
                }
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
    }, [watchedProfiles, profiles, saleProfiles, currentService])

    // Memorizar el conteo de cambios pendientes - CORREGIDO: usar watchedProfiles
    const pendingChanges = useMemo(() => {
        if (!saleProfiles) return null

        const currentApiProfiles = saleProfiles

        const newProfilesCount = watchedProfiles.filter(
            (fp) =>
                !currentApiProfiles.some(
                    (ap) =>
                        ap.profileId === fp.profileId &&
                        ap.service.id === fp.serviceId
                )
        ).length

        const modifiedProfilesCount = watchedProfiles.filter((fp) => {
            const apiProfile = currentApiProfiles.find(
                (ap) =>
                    ap.profileId === fp.profileId &&
                    ap.service.id === fp.serviceId
            )
            return apiProfile && apiProfile.quantity !== fp.quantity
        }).length

        const parts = []
        if (newProfilesCount > 0)
            parts.push(
                `${newProfilesCount} ${newProfilesCount === 1 ? 'new profile' : 'new profiles'}`
            )
        if (modifiedProfilesCount > 0)
            parts.push(
                `${modifiedProfilesCount} ${modifiedProfilesCount === 1 ? 'modified profile' : 'modified profiles'}`
            )

        return parts.length ? `Pending changes: ${parts.join(' and ')}` : null
    }, [saleProfiles, watchedProfiles])

    return (
        <Form {...form}>
            <View className='w-full flex-col gap-4 px-3'>
                <View className='flex-col gap-4'>
                    <Text className='text-xs font-semibold'>SERVICES</Text>
                    <ServiceSelector/>
                    <Text className='text-xs font-semibold'>PROFILES</Text>
                    <ProfileSelector
                        handleOnSelect={handleOnProfileSelect}
                        profiles={profiles || []}
                        disabled={isSubmitting || isLoadingProfiles}
                    />
                </View>

                {((saleProfiles && saleProfiles.length > 0) ||
                    watchedProfiles.length > 0) && (
                    <View className='space-y-6'>
                        {uniqueServices.map((serviceDescription) => (
                            <View key={serviceDescription} className='space-y-3'>
                                <Text className='text-xs font-semibold uppercase'>
                                    {serviceDescription}
                                </Text>
                                <View className='flex-col gap-2'>
                                    {/* Mostrar perfiles existentes en la API */}
                                    {saleProfiles &&
                                        saleProfiles
                                            .filter((sp) => sp.service.name === serviceDescription)
                                            .map((sp) => {
                                                const fieldIndex = watchedProfiles.findIndex(
                                                    (field) =>
                                                        field.profileId === sp.profileId &&
                                                        field.serviceId === sp.service.id
                                                )

                                                const formQuantity =
                                                    fieldIndex !== -1
                                                        ? watchedProfiles[fieldIndex].quantity
                                                        : sp.quantity

                                                const isModified =
                                                    fieldIndex !== -1 && formQuantity !== sp.quantity

                                                return (
                                                    <SaleProfileItem
                                                        key={sp.profileId}
                                                        form={form}
                                                        fieldIndex={fieldIndex}
                                                        saleProfile={sp}
                                                        currentQuantity={formQuantity}
                                                        isModified={isModified}
                                                        handleRemoveProfile={handleRemoveProfile}
                                                        handleQuantityChange={handleQuantityChange}
                                                        handleValueChange={handleValueChange}
                                                    />
                                                )
                                            })}

                                    {/* Mostrar perfiles nuevos que solo existen en el formulario */}
                                    {(() => {
                                        const newProfiles = getNewProfilesForService(serviceDescription)
                                        console.log('Rendering new profiles for', serviceDescription, ':', newProfiles)

                                        return newProfiles.map((item) => (
                                            <View
                                                key={item.key}
                                                className='relative'
                                            >
                                                <View className='absolute top-0 right-0 z-10 translate-x-1/2 -translate-y-1/2'>
                                                    <Text className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                                                        New
                                                    </Text>
                                                </View>
                                                <SaleProfileItem
                                                    form={form}
                                                    fieldIndex={item.fieldIndex}
                                                    saleProfile={item.tempSaleProfile}
                                                    currentQuantity={item.newProfile.quantity}
                                                    isModified={true}
                                                    handleRemoveProfile={handleRemoveProfile}
                                                    handleQuantityChange={handleQuantityChange}
                                                    handleValueChange={handleValueChange}
                                                />
                                            </View>
                                        ))
                                    })()}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {hasUnsavedChanges && (
                    <View className='flex items-center gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-600'>
                        <Text>⚠️</Text>
                        <View className='flex flex-col gap-1'>
                            <Text>
                                You are viewing a preview of the changes. Profiles will only be
                                created or updated when you click the submit button.
                            </Text>
                            {pendingChanges && (
                                <Text className='text-xs'>
                                    {pendingChanges}
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                <NavigationGuardDialog/>

                <Button
                    onPress={() => {
                        console.log('Submit button pressed');

                        try {
                            const values = form.getValues();
                            console.log('Current form values:', values);

                            if (!values.profiles || values.profiles.length === 0) {
                                console.log('WARNING: No profiles in form values');

                                if (saleProfiles && saleProfiles.length > 0) {
                                    console.log('Using visible profiles from UI state');
                                    const manualData = {
                                        profiles: saleProfiles.map(sp => ({
                                            serviceId: sp.service.id,
                                            profileId: sp.profileId,
                                            quantity: sp.quantity
                                        }))
                                    };

                                    if (handleSubmit) {
                                        console.log('Submitting with manual data:', manualData);
                                        handleSubmit(manualData);
                                        return;
                                    }
                                }
                            }

                            if (handleSubmit) {
                                console.log('Submitting form values directly');
                                handleSubmit(values);
                            } else {
                                console.log('Using form.handleSubmit with onSubmit');
                                form.handleSubmit(onSubmit)();
                            }
                        } catch (error) {
                            console.error('Error submitting form:', error);

                            if (handleSubmit && saleProfiles && saleProfiles.length > 0) {
                                console.log('Error recovery: submitting using saleProfiles');
                                const recoveryData = {
                                    profiles: saleProfiles.map(sp => ({
                                        serviceId: sp.service.id,
                                        profileId: sp.profileId,
                                        quantity: sp.quantity
                                    }))
                                };
                                handleSubmit(recoveryData);
                            }
                        }
                    }}
                    disabled={isSubmitting}
                >
                    <Text>
                        {isSubmitting
                            ? 'Processing...'
                            : hasUnsavedChanges
                                ? 'Save'
                                : 'Confirm'}
                    </Text>
                </Button>

                {Object.keys(form.formState.errors).length > 0 && (
                    <View className="p-3 bg-red-50 rounded-md">
                        <Text className="text-red-600 font-semibold mb-1">Errores del formulario:</Text>
                        <Text className="text-destructive text-xs">{JSON.stringify(form.formState.errors, null, 2)}</Text>
                    </View>
                )}

                <Button
                    variant="outline"
                    onPress={() => {
                        console.log('DEBUG - Form values:', form.getValues());
                        console.log('DEBUG - Watched profiles:', watchedProfiles);
                        console.log('DEBUG - Form state:', form.formState);
                        console.log('DEBUG - Sale profiles:', saleProfiles);
                        console.log('DEBUG - Unique services:', uniqueServices);
                        console.log('DEBUG - Current service:', currentService);
                    }}
                    className="mt-4"
                >
                    <Text>Debug Form State</Text>
                </Button>
            </View>
        </Form>
    )
}