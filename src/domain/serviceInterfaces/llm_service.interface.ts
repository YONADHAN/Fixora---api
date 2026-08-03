import { AIRole } from '../../shared/types/ai/ai.types'

export interface LLMChatParams {
  message: string
  history?: unknown[]
  role: AIRole
  userId?: string | null
  domain: string
}

export interface ILLMService {
  chat(params: LLMChatParams): Promise<string>
}
