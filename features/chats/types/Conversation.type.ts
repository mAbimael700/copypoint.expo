import {CustomerContact} from '~/features/chats/types/CustomerContact.type'

export type Conversation = {
    id: number
    createdAt: string
    phoneId: number
    phoneNumber: string
    displayName: string
    contact: CustomerContact
    customerServicePhoneId: number
}
