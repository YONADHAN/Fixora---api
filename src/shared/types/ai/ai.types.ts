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

export type AIToolMap = Record<string, AIToolFunction>

export interface AIToolBundle {
  tools: unknown[]
  toolMap: AIToolMap
}
