export type AIRole = 'customer' | 'vendor' | 'admin' | 'public'

export type AIDomain =
  | 'SERVICE'
  | 'BOOKING'
  | 'CATEGORY'
  | 'SUBSCRIPTION_PLAN'
  | 'GENERAL'

export type AIToolFunction<TArgs = any, TResult = any> = (
  args?: TArgs,
) => Promise<TResult>

export type AIToolMap = Record<string, AIToolFunction<any, any>>

export interface AIToolBundle {
  tools: unknown[]
  toolMap: AIToolMap
}

export interface AIToolContext {
  role: AIRole
  userId: string | null
}

export type AIToolProvider = (context: AIToolContext) => AIToolBundle
