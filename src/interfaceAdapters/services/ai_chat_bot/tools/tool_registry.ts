import { ROLES } from "../../../../shared/constants";
import { AIRole, AIToolContext } from "../../../../shared/types/ai/ai.types";
import { getBookingTools } from "./booking.tools";
import { getCategoryTools } from "./category.tools";
import { getServiceTools } from "./service.tools";
import { getSubscriptionTools } from "./subscription.tools";
import { getProfileTools } from "./profile.tools";
import { getWalletTools } from "./wallet.tools";
import { getAddressTools } from "./address.tools";
import { StructuredToolInterface } from "@langchain/core/tools"

export class ToolRegistry {
  static getToolsForRole(
    role: AIRole,
    context: AIToolContext
  ): { tools: StructuredToolInterface[] } {

    const bookingTools = getBookingTools(context).tools
    const serviceTools = getServiceTools(context).tools
    const categoryTools = getCategoryTools(context).tools
    const subscriptionTools = getSubscriptionTools(context).tools
    const profileTools = getProfileTools(context).tools
    const walletTools = getWalletTools(context).tools
    const addressTools = getAddressTools(context).tools

    switch (role) {
      case ROLES.CUSTOMER:
        return {
          tools: [
            ...bookingTools,
            ...serviceTools,
            ...profileTools,
            ...walletTools,
            ...addressTools,
          ],
        }

      case ROLES.VENDOR:
        return {
          tools: [
            ...bookingTools,
            ...serviceTools,
            ...subscriptionTools,
            ...profileTools,
            ...walletTools,
          ],
        }

      case ROLES.ADMIN:
        return {
          tools: [
            ...bookingTools,
            ...serviceTools,
            ...categoryTools,
            ...subscriptionTools,
          ],
        }

      default:
        return {
          tools: [],
        }
    }
  }
}