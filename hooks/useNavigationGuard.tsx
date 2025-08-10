import { useRouter } from 'expo-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import { BackHandler, Alert } from 'react-native'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { FieldValues, UseFormReturn } from 'react-hook-form'

interface NavigationGuardOptions {
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    useNativeAlert?: boolean // Opción para usar Alert nativo de RN
}

interface NavigationGuardReturn {
    NavigationGuardDialog: React.ComponentType
    setBlocked: (blocked: boolean) => void
    isBlocked: boolean
}

export function useNavigationGuard(
    shouldBlock: boolean,
    options: NavigationGuardOptions = {}
): NavigationGuardReturn {
    const [isBlocked, setIsBlocked] = useState(shouldBlock)
    const [showDialog, setShowDialog] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)
    const router = useRouter()
    const isBlockedRef = useRef(isBlocked)

    // Actualizar isBlocked cuando cambie shouldBlock
    useEffect(() => {
        setIsBlocked(shouldBlock)
        isBlockedRef.current = shouldBlock
    }, [shouldBlock])

    const {
        title = "Are you sure you want to exit?",
        description = "You have unsaved changes. If you exit now, your changes will be lost.",
        confirmText = "Exit",
        cancelText = "Cancel",
        useNativeAlert = false
    } = options

    // Función para mostrar el diálogo de confirmación
    const showConfirmationDialog = useCallback((navigation: () => void) => {
        if (useNativeAlert) {
            Alert.alert(
                title,
                description,
                [
                    {
                        text: cancelText,
                        style: 'cancel'
                    },
                    {
                        text: confirmText,
                        style: 'destructive',
                        onPress: () => {
                            setIsBlocked(false)
                            isBlockedRef.current = false
                            navigation()
                        }
                    }
                ]
            )
        } else {
            setPendingNavigation(() => navigation)
            setShowDialog(true)
        }
    }, [title, description, confirmText, cancelText, useNativeAlert])

    // Interceptar navegación del Expo Router
    useEffect(() => {
        if (!isBlocked) return

        const originalPush = router.push
        const originalReplace = router.replace
        const originalBack = router.back
        const originalNavigate = router.navigate

        // Interceptar router.push
        const interceptedPush = (href: any) => {
            if (isBlockedRef.current) {
                showConfirmationDialog(() => {
                    originalPush.call(router, href)
                })
                return
            }
            return originalPush.call(router, href)
        }

        // Interceptar router.replace
        const interceptedReplace = (href: any) => {
            if (isBlockedRef.current) {
                showConfirmationDialog(() => {
                    originalReplace.call(router, href)
                })
                return
            }
            return originalReplace.call(router, href)
        }

        // Interceptar router.back
        const interceptedBack = () => {
            if (isBlockedRef.current) {
                showConfirmationDialog(() => {
                    originalBack.call(router)
                })
                return
            }
            return originalBack.call(router)
        }

        // Interceptar router.navigate
        const interceptedNavigate = (href: any) => {
            if (isBlockedRef.current) {
                showConfirmationDialog(() => {
                    originalNavigate.call(router, href)
                })
                return
            }
            return originalNavigate.call(router, href)
        }

        // Reemplazar métodos del router
        router.push = interceptedPush
        router.replace = interceptedReplace
        router.back = interceptedBack
        router.navigate = interceptedNavigate

        return () => {
            // Restaurar métodos originales
            router.push = originalPush
            router.replace = originalReplace
            router.back = originalBack
            router.navigate = originalNavigate
        }
    }, [isBlocked, router, showConfirmationDialog])

    // Manejar el botón de retroceso de Android
    useEffect(() => {
        const backAction = () => {
            if (isBlockedRef.current) {
                showConfirmationDialog(() => {
                    router.back()
                })
                return true // Prevenir la acción por defecto
            }
            return false // Permitir la acción por defecto
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

        return () => backHandler.remove()
    }, [showConfirmationDialog, router])

    const handleConfirm = useCallback(() => {
        setShowDialog(false)
        if (pendingNavigation) {
            setIsBlocked(false)
            isBlockedRef.current = false
            pendingNavigation()
            setPendingNavigation(null)
        }
    }, [pendingNavigation])

    const handleCancel = useCallback(() => {
        setShowDialog(false)
        setPendingNavigation(null)
    }, [])

    const setBlocked = useCallback((blocked: boolean) => {
        setIsBlocked(blocked)
        isBlockedRef.current = blocked
    }, [])

    const NavigationGuardDialog = useCallback(() => (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onPress={handleCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onPress={handleConfirm}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ), [showDialog, title, description, confirmText, cancelText, handleConfirm, handleCancel])

    return {
        NavigationGuardDialog,
        setBlocked,
        isBlocked
    }
}

// Hook específico para formularios
export function useFormNavigationGuard(hasUnsavedChanges: boolean, useNativeAlert: boolean = false) {
    return useNavigationGuard(hasUnsavedChanges, {
        title: "¿Descartar cambios?",
        description: "Tienes cambios sin guardar en el formulario. Si sales ahora, se perderán todos los cambios realizados.",
        confirmText: "Descartar cambios",
        cancelText: "Continuar editando",
        useNativeAlert
    })
}

interface FormNavigationGuardOptions extends NavigationGuardOptions {
    // Opciones adicionales específicas para formularios
}

/**
 * Hook especializado para usar con React Hook Form
 * Automáticamente detecta cambios usando form.formState.isDirty
 */
export function useHookFormNavigationGuard<T extends FieldValues = FieldValues>(
    form: UseFormReturn<T>,
    options: FormNavigationGuardOptions = {}
) {
    const defaultOptions: FormNavigationGuardOptions = {
        title: "Discard changes?",
        description: "Are you sure you want to discard your changes? If you exit now, all changes will be lost.",
        confirmText: "Discard",
        cancelText: "Continue",
        useNativeAlert: false,
        ...options
    }

    const [manuallyChanged, setManuallyChanged] = useState(false)
    const isDirty = form.formState.isDirty || manuallyChanged

    const { NavigationGuardDialog, setBlocked, isBlocked } = useNavigationGuard(
        isDirty,
        defaultOptions
    )

    // Función para desbloquear después de guardar exitosamente
    const markAsSaved = (newData?: T) => {
        setBlocked(false)
        setManuallyChanged(false)
        if (newData) {
            form.reset(newData)
        } else {
            form.reset(form.getValues())
        }
    }

    // Función para marcar manualmente como modificado
    const markAsChanged = () => {
        setManuallyChanged(true)
        setBlocked(true)
    }

    return {
        NavigationGuardDialog,
        setBlocked,
        isBlocked,
        markAsSaved,
        markAsChanged,
        hasUnsavedChanges: isDirty
    }
}

// Ejemplo de uso:
/*
import { useHookFormNavigationGuard } from './useNavigationGuard'

function MyFormScreen() {
  const form = useForm()
  const { NavigationGuardDialog, markAsSaved } = useHookFormNavigationGuard(form, {
    useNativeAlert: true // Usar Alert nativo en lugar del diálogo personalizado
  })

  const onSubmit = async (data) => {
    try {
      await saveData(data)
      markAsSaved(data) // Marcar como guardado después del éxito
    } catch (error) {
      // Manejar error
    }
  }

  return (
    <View>
      // Tu formulario aquí
      <NavigationGuardDialog />
    </View>
  )
}
*/