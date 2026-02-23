const BLOCKED_KEYWORDS = [
  'delete',
  'remove',
  'drop',
  'update',
  'insert',
  'patch',
]

export class ToolPermissionGuard {
  static validateMessage(message: string) {
    const lower = message.toLowerCase()

    if (BLOCKED_KEYWORDS.some((word) => lower.includes(word))) {
      throw new Error('This action is not allowed.')
    }
  }

  static validateToolCall(toolName: string, allowedTools: string[]) {
    if (!allowedTools.includes(toolName)) {
      throw new Error(`Tool ${toolName} is not permitted.`)
    }
  }
}
