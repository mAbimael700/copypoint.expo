import { Attachment } from '@/features/chats/types/Attachment.type'

export type Message = {
  id: number
  messageSid: string
  direction: MessageDirection
  body: string
  timestamp: string
  conversationId: number
  status: string
  attachments: Attachment[]
}

export type MessageDirection = 'INBOUND' | 'OUTBOUND'
