export interface IGeminiService {
  chat(params: {
    systemPrompt: string
    message: string
    history?: any[]
    tools: any[]
    toolMap: Record<string, Function>
  }): Promise<string>
}
