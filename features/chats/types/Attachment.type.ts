export interface AttachmentResponse {
  id: number
  originalName: string
  fileType: string
  messageId: number
  mimeType: string
  fileSizeBytes: number
  downloadStatus: string
  isAvailable: boolean
  dateCreated: string
  dateDownloaded?: string
}

export interface PresignedUrlResponse {
  attachmentId: number
  presignedUrl: string
  expirationMinutes: number
}

export interface AttachmentAvailabilityResponse {
  id: number
  isAvailable: boolean
}

// Tipo básico para Attachment usado en los mensajes
export interface Attachment {
  id: number
  originalName?: string
  fileType?: string
  messageId?: number
  mimeType?: string
  fileSizeBytes?: number
  isAvailable?: boolean
}

// Tipos de archivos soportados para renderizado especial
export type AttachmentFileType = 'image' | 'video' | 'audio' | 'document' | 'other';