import { GoogleGenerativeAI } from '@google/generative-ai'
import { injectable } from 'tsyringe'
import { IGeminiService } from '../../../domain/serviceInterfaces/gemini_service_interface'

@injectable()
export class GeminiService implements IGeminiService {
  private genAI: GoogleGenerativeAI

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }

  private createModel(systemPrompt: string, tools: any[]) {
    return this.genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt,
      tools,
    })
  }

  async chat(params: {
    systemPrompt: string
    message: string
    history?: any[]
    tools: any[]
    toolMap: Record<string, Function>
  }): Promise<string> {
    const { systemPrompt, message, history = [], tools, toolMap } = params

    const model = this.createModel(systemPrompt, tools)
    const chat = model.startChat({ history })

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
