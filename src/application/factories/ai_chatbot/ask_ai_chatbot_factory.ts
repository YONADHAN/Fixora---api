import { inject, injectable } from 'tsyringe'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ROLES,
  TRole,
} from '../../../shared/constants'
import { CustomError } from '../../../domain/utils/custom.error'
import { IAskAIChatbotFactory } from './ask_ai_chatbot_factory.interface'
import { IAskAIChatbotVendorStrategy } from '../../strategies/ai_chatbot/ask_ai_chatbot/ask_ai_chatbot_vendor_strategy.interface'
import { IAskAIChatbotCustomerStrategy } from '../../strategies/ai_chatbot/ask_ai_chatbot/ask_ai_chatbot_customer_strategy.interface'

@injectable()
export class AskAIChatbotFactory implements IAskAIChatbotFactory {
  constructor(
    @inject('IAskAIChatbotCustomerStrategy')
    private readonly _askAIChatbotStrategyForCustomer: IAskAIChatbotCustomerStrategy,
    @inject('IAskAIChatbotVendorStrategy')
    private readonly _askAIChatbotStrategyForVendor: IAskAIChatbotVendorStrategy,
  ) {}

  getStrategy(role: TRole) {
    switch (role) {
      case ROLES.CUSTOMER:
        return this._askAIChatbotStrategyForCustomer
      case ROLES.VENDOR:
        return this._askAIChatbotStrategyForVendor
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        )
    }
  }
}
