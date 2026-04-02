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

    //  Adapter-level type narrowing
    const geminiTools = tools as Tool[]
    const geminiHistory = history as Content[]

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt,
      tools: geminiTools,
    })

    try {
      const chat = model.startChat({
        history: geminiHistory,
      })

      let result = await chat.sendMessage(message)
      let response = result.response
      let functionCalls = response.functionCalls()

      while (functionCalls?.length) {
        const call = functionCalls[0]
        let toolResult;
        try {
          const tool = toolMap[call.name]
          if (!tool) {
            throw new Error(`Tool ${call.name} is not permitted or does not exist.`)
          }
          toolResult = await tool(call.args)
        } catch (err: unknown) {
          if (err instanceof Error) {
            toolResult = {
              error: `Tool execution failed: ${err.message}. Please use exactly the tool names provided in your schema (e.g. ${Object.keys(toolMap).join(', ')}). Do not invent tool names or namespaces.`
            }
          } else {
            toolResult = {
              error: `Tool execution failed: Unknown error. Please use exactly the tool names provided in your schema (e.g. ${Object.keys(toolMap).join(', ')}). Do not invent tool names or namespaces.`
            }
          }
        }

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
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('429')) {
         console.warn('Gemini 429 Error Internally Caught - Re-throwing for Proxy Wrapper!')
         throw error
      }
      console.error('Gemini LLM Error:', error)
      return "I'm sorry, I'm having trouble connecting right now due to a network or system error. Please try again later."
    }
  }
}
