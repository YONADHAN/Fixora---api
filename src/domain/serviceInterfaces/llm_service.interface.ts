export interface LLMChatParams {
  systemPrompt: string
  message: string
  history?: unknown[]
  tools?: unknown[]
  toolMap?: Record<string, (args?: any) => Promise<any>>
}

export interface ILLMService {
  chat(params: LLMChatParams): Promise<string>
}
