// shared/types/socket/video-chat.type.ts

export interface CallInitiatePayload {
  chatId: string
  callType: 'audio' | 'video'
}

export interface CallAcceptPayload {
  chatId: string
}

export interface CallRejectPayload {
  chatId: string
}

export interface CallEndPayload {
  chatId: string
}

type ActiveCall = {
  callerId: string
  receiverId: string
}

export const activeCalls = new Map<string, ActiveCall>()
