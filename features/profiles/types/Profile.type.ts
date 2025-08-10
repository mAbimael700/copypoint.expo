import { Service } from "~/features/service/types/Service.type"

export interface ProfileResponse {
    id: number
    name: string
    description: string
    unitPrice: number
    createdAt: string
    modifiedAt: string
    status: boolean
    services: Service[]
}

export interface ProfileCreationDTO {
    name: string
    description: string
    unitPrice: number
    services: number[]
}