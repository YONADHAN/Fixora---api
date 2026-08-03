import { ChatGroq } from '@langchain/groq'
import { injectable } from 'tsyringe'
import { ILLMService, LLMChatParams } from '../../../domain/serviceInterfaces/llm_service.interface'
import { HumanMessage, SystemMessage, ToolMessage, BaseMessage } from '@langchain/core/messages'
import { StructuredToolInterface } from '@langchain/core/tools'
import { ToolRegistry } from './tools/tool_registry'
import { PromptBuilder } from './prompt_builder'
import { ToolPermissionGuard } from '../../../application/security/tool_permission.guard'

@injectable()
export class GroqLLMService implements ILLMService {
  private llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL!,
    temperature: 0,
  })

  async chat(params: LLMChatParams): Promise<string> {
    try {
      const { message, history = [], role, userId, domain } = params

      const context = { role, userId: userId ?? null }
      const { tools } = ToolRegistry.getToolsForRole(role, context)
      const systemPrompt = PromptBuilder.buildSystemPrompt({ role, userId, domain })

      const toolMap = tools.reduce((acc: Record<string, (args: Record<string, unknown>) => Promise<unknown>>, tool: StructuredToolInterface) => {
        acc[tool.name] = async (args: Record<string, unknown>) => tool.invoke(args)
        return acc
      }, {})

      const securedToolMap = ToolPermissionGuard.createSecuredToolMap(toolMap)

      const messages: BaseMessage[] = [
        new SystemMessage(systemPrompt),
        ...(history as BaseMessage[]),
        new HumanMessage(message),
      ]

      let llmWithTools: typeof this.llm | ReturnType<typeof this.llm.bindTools> = this.llm
      if (tools.length > 0) {
        llmWithTools = this.llm.bindTools(tools as StructuredToolInterface[])
      }

      let response = await llmWithTools.invoke(messages)

      let iterations = 0
      const MAX_ITERATIONS = 5

      while (response.tool_calls && response.tool_calls.length > 0 && iterations < MAX_ITERATIONS) {
        iterations++
        messages.push(response)

        for (const toolCall of response.tool_calls) {
          const functionName = toolCall.name
          const functionArgs = toolCall.args
          let toolResult

          try {
            const tool = securedToolMap[functionName]
            if (!tool) {
              throw new Error(`Tool ${functionName} is not permitted.`)
            }
            toolResult = await tool(functionArgs)
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err)
            toolResult = { error: `Execution failed: ${errorMessage}` }
          }

          messages.push(new ToolMessage({
            tool_call_id: toolCall.id!,
            content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
            name: functionName
          }))
        }

        response = await llmWithTools.invoke(messages)
      }

      if (iterations >= MAX_ITERATIONS) {
        console.warn("AI CHAT WARNING: Reached MAX_ITERATIONS limit.")
      }

      return String(response.content)
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes('Rate limit')) {
        return "I'm currently receiving too many requests. Please wait a few seconds and try again!"
      }
      console.error("AI CHAT ERROR:", error)
      return "I encountered an unexpected error while processing your request."
    }
  }
}
