import * as React from 'react'
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form'
import { View, Text, ViewProps, TextProps } from 'react-native'
import { cn } from '~/lib/utils' // Asegúrate de que esta función esté disponible

const Form = FormProvider

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
      ...props
  }: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState } = useFormContext()
    const formState = useFormState({ name: fieldContext.name })
    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>')
    }

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    }
}

type FormItemContextValue = {
    id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
)

interface FormItemProps extends ViewProps {
    className?: string
}

function FormItem({ className, ...props }: FormItemProps) {
    const id = React.useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <View
                className={cn('gap-2', className)}
                {...props}
            />
        </FormItemContext.Provider>
    )
}

interface FormLabelProps extends TextProps {
    className?: string
}

function FormLabel({
                       className,
                       ...props
                   }: FormLabelProps) {
    const { error } = useFormField()

    return (
        <Text
            className={cn(
                'text-base font-medium text-foreground',
                error && 'text-destructive',
                className
            )}
            {...props}
        />
    )
}

interface FormControlProps extends ViewProps {
    className?: string
    children: React.ReactNode
}

function FormControl({ className, children, ...props }: FormControlProps) {
    const { error } = useFormField()

    return (
        <View
            className={cn(className)}
            {...props}
        >
            {children}
        </View>
    )
}

interface FormDescriptionProps extends TextProps {
    className?: string
}

function FormDescription({ className, ...props }: FormDescriptionProps) {
    return (
        <Text
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    )
}

interface FormMessageProps extends TextProps {
    className?: string
}

function FormMessage({ className, ...props }: FormMessageProps) {
    const { error } = useFormField()
    const body = error ? String(error?.message ?? '') : props.children

    if (!body) {
        return null
    }

    return (
        <Text
            className={cn('text-sm text-destructive', className)}
            {...props}
        >
            {body}
        </Text>
    )
}

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
}