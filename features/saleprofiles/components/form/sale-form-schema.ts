import {z} from 'zod';

// Esquema de validación para cada perfil de venta
export const saleProfileSchema = z.object({
    profileId: z.number().positive(),
    serviceId: z.number().positive(),
    quantity: z.number().min(1, 'La cantidad debe ser al menos 1'),
});

// Esquema de validación para el formulario completo
export const saleProfileFormSchema = z.object({
    profiles: z.array(saleProfileSchema),
});


export type SaleProfilesFormValues = z.infer<typeof saleProfileFormSchema>