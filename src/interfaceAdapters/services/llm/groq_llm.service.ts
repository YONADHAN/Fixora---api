import Groq from 'groq-sdk'
import { injectable } from 'tsyringe'
import { ILLMService, LLMChatParams } from '../../../domain/serviceInterfaces/llm_service.interface'

@injectable()
export class GroqLLMService implements ILLMService {
  private groq = new Groq({ apiKey: process.env.GROK_API_KEY })

  async chat(params: LLMChatParams): Promise<string> {
    const { systemPrompt, message, history = [], tools = [], toolMap = {} } = params

    const groqHistory = history.map((h: any) => {
      let content = h.content;
      if (!content && h.parts && h.parts.length > 0) {
        content = typeof h.parts === 'function' ? h.parts()[0]?.text : h.parts[0]?.text;
      }
      return {
        role: h.role === 'model' ? 'assistant' : 'user',
        content: content || ''
      }
    })

    const groqTools: any[] = []
    for (const bundle of tools as any[]) {
      if (bundle.functionDeclarations) {
        for (const decl of bundle.functionDeclarations) {
          groqTools.push({
            type: 'function',
            function: {
              name: decl.name,
              description: decl.description,
              parameters: decl.parameters || { type: 'object', properties: {} }
            }
          })
        }
      }
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...groqHistory,
      { role: 'user', content: message }
    ]

    let response = await this.groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: messages,
      tools: groqTools.length > 0 ? groqTools : undefined,
      tool_choice: groqTools.length > 0 ? 'auto' : 'none'
    })

    let responseMessage = response.choices[0]?.message
    let toolCalls = responseMessage?.tool_calls

    while (toolCalls?.length) {
      messages.push(responseMessage)

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name
        const functionArgs = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
        let toolResult

        try {
          const tool = toolMap[functionName]
          if (!tool) {
            throw new Error(`Tool ${functionName} is not permitted.`)
          }
          toolResult = await tool(functionArgs)
        } catch (err: any) {
          toolResult = { error: `Execution failed: ${err.message}` }
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          name: functionName,
          content: JSON.stringify(toolResult)
        })
      }

      response = await this.groq.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: messages,
        tools: groqTools.length > 0 ? groqTools : undefined
      })

      responseMessage = response.choices[0]?.message
      toolCalls = responseMessage?.tool_calls
    }

    return responseMessage?.content || ''
  }
}
