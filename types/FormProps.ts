export interface FormProps<T> {
    defaultValues?: T
    handleSubmit: (values: T) => void | Promise<void>
    isSubmitting?: boolean
}