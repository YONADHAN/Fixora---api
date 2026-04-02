import { AIToolMap } from '../../shared/types/ai/ai.types'

export class ToolPermissionGuard {
  static validateMessage(message: string) {
    const blockedPattern = /\b(delete|remove|drop|update|insert|patch)\b/i
    if (blockedPattern.test(message)) {
      throw new Error('This action is not allowed.')
    }
  }

  static validateToolCall(toolName: string, allowedTools: string[]) {
    if (!allowedTools.includes(toolName)) {
      throw new Error(`Tool ${toolName} is not permitted.`)
    }
  }

  static createSecuredToolMap(toolMap: AIToolMap): AIToolMap {
    const allowedTools = Object.keys(toolMap)

    return new Proxy(toolMap, {
      get(target, prop: string) {
        ToolPermissionGuard.validateToolCall(prop, allowedTools)
        return target[prop]
      },
    })
  }
}
