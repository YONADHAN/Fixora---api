import { Content } from "@google/generative-ai"

export interface IGeminiService {
  chat(params: {
    systemPrompt: string
    message: string
    history?: Content[]
    tools: unknown[]
    toolMap: Record<string, (args: unknown) => Promise<unknown>>
  }): Promise<string>
}