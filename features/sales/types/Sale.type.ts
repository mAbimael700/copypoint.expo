import UserResponse from "~/features/users/types/User.type";
import {PaymentMethod} from "~/features/paymentmethod/types/PaymentMethod.type";


export interface SaleResponse {
    id: number
    userVendor: UserResponse
    paymentMethod: PaymentMethod
    total: number
    currency: string
    status: SaleStatus
    discount: number
    createdAt: string
    updatedAt: string
}

export interface SaleCreationDTO {
    currency: string
    paymentMethodId: number
}

export interface SaleProfileCreationDTO {
    profileId: number
    serviceId: number
    quantity: number
}
export interface SaleProfileUpdateDTO {
    quantity: number
}

export enum SaleStatus {
    PENDING, // Venta pendiente de procesamiento
    COMPLETED, // Venta concretada/exitosamente finalizada
    PAYMENT_PENDING, // Pago pendiente (ej: venta aprobada pero falta pago)
    CANCELLED, // Venta cancelada
    REFUNDED, // Venta reembolsada
    ON_HOLD, // Venta en espera (por revisión, etc)
    PARTIALLY_PAID, // Pago parcial recibido
    FAILED, // Venta fallida (ej: pago rechazado)
    EXPIRED,
}
