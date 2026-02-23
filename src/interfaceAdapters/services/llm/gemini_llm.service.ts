import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Tool, Content } from '@google/generative-ai'
import { injectable } from 'tsyringe'
import {
  ILLMService,
  LLMChatParams,
} from '../../../domain/serviceInterfaces/llm_service.interface'

@injectable()
export class GeminiLLMService implements ILLMService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  async chat(params: LLMChatParams): Promise<string> {
    const {
      systemPrompt,
      message,
      history = [],
      tools = [],
      toolMap = {},
    } = params

    // 🔒 Adapter-level type narrowing
    const geminiTools = tools as Tool[]
    const geminiHistory = history as Content[]

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt,
      tools: geminiTools,
    })

    const chat = model.startChat({
      history: geminiHistory,
    })

    let result = await chat.sendMessage(message)
    let response = result.response
    let functionCalls = response.functionCalls()

    while (functionCalls?.length) {
      const call = functionCalls[0]
      const tool = toolMap[call.name]

      if (!tool) {
        throw new Error(`Unauthorized tool call: ${call.name}`)
      }

      const toolResult = await tool(call.args)

      result = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: { result: toolResult },
          },
        },
      ])

      response = result.response
      functionCalls = response.functionCalls()
    }

    return response.text()
  }
}
