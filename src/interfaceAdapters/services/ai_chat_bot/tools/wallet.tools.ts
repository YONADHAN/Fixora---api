import { container } from 'tsyringe'
import { tool, StructuredToolInterface } from '@langchain/core/tools'
import { z } from 'zod'

import { AIToolContext } from '../../../../shared/types/ai/ai.types'
import { IWalletRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { IWalletTransactionRepository } from '../../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'

export function getWalletTools(
  context: AIToolContext,
): { tools: StructuredToolInterface[] } {

  const getWalletBalanceTool = tool(
    async () => {
      try {
        if (!context.userId) return { error: 'User not authenticated' }

        const walletRepo = container.resolve<IWalletRepository>('IWalletRepository')
        const wallet = await walletRepo.findOne({ userRef: context.userId })

        if (!wallet) return { info: 'No wallet found for this user.' }

        return {
          balance: wallet.balance,
          currency: 'INR', // Defaulting to INR for Fixora context based on pricing seen in transcripts
        }
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to fetch wallet balance' }
      }
    },
    {
      name: 'getWalletBalance',
      description: 'Get the current available balance in the user\'s wallet.',
      schema: z.object({}),
    },
  )

  const getWalletTransactionHistoryTool = tool(
    async ({ limit }) => {
      try {
        if (!context.userId) return { error: 'User not authenticated' }

        const walletRepo = container.resolve<IWalletRepository>('IWalletRepository')
        const transactionRepo = container.resolve<IWalletTransactionRepository>('IWalletTransactionRepository')

        const wallet = await walletRepo.findOne({ userRef: context.userId })
        if (!wallet) return { info: 'No wallet found.' }

        const transactions = await transactionRepo.findWithPagination(
          { walletRef: wallet._id },
          { page: 1, limit: limit ?? 10, sortBy: 'createdAt', order: 'desc' }
        )

        if (!transactions.data.length) return { info: 'No transactions found.' }

        return transactions.data.map(t => ({
          transactionId: t.transactionId,
          amount: t.amount,
          type: t.type,
          description: t.description,
          date: t.createdAt,
        }))
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to fetch transactions' }
      }
    },
    {
      name: 'getWalletTransactionHistory',
      description: 'Get the recent transactions (credits/debits) from the user\'s wallet.',
      schema: z.object({
        limit: z.number().optional().describe('Maximum number of transactions to return (default 10)'),
      }),
    }
  )

  return {
    tools: [getWalletBalanceTool, getWalletTransactionHistoryTool],
  }
}
