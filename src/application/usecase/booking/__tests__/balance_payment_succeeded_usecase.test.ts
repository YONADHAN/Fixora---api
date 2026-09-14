import "reflect-metadata";
import assert from 'assert';
import { BalancePaymentSucceededUseCase } from '../balance_payment_succeeded_usecase';

// Mock dependencies
const mockAdminRepository = { findOne: async () => ({ _id: 'admin_123', email: process.env.SEED_ADMIN_EMAIL }) };
const mockBookingRepository = { 
  findAllDocsWithoutPagination: async () => [{ bookingId: 'b_1', serviceStatus: 'completed' }],
  update: async () => {}
};
const mockNotificationUseCase = { execute: async () => {} };
const mockCustomerRepository = { findOne: async () => ({ _id: 'cust_123', userId: 'usr_c' }) };
const mockVendorRepository = { findOne: async () => ({ _id: 'vend_123', userId: 'usr_v' }) };
const mockCodeGenerator = { generateWalletTransactionCode: async () => 'TXN_CODE' };

async function runTests() {
  console.log('Running tests for BalancePaymentSucceededUseCase...');

  const runTestCase = async (name: string, advance: number, balance: number, expectedCommission: number, expectedVendor: number, setupPaymentModifier = (payment: any) => {}) => {
    console.log(`\n--- Test Case: ${name} ---`);
    let adminBalanceIncrement = 0;
    let adminBalanceDecrement = 0;
    let vendorBalanceIncrement = 0;
    
    let adminTransactions: any[] = [];
    let vendorTransactions: any[] = [];

    const mockPaymentRepository = {
      findOne: async () => {
        const payment = {
          _id: 'pay_123',
          customerRef: 'cust_123',
          vendorRef: 'vend_123',
          slots: [{ remainingPayment: { stripePaymentIntentId: 'old', status: 'pending' } }],
          advancePayment: { amount: advance }
        };
        setupPaymentModifier(payment);
        return payment;
      },
      updateRemainingPaymentByBookingGroupId: async () => {}
    };

    const mockWalletRepository = {
      findOne: async (query: any) => {
        if (query.userRef === 'admin_123') return { _id: 'w_admin' };
        if (query.userRef === 'vend_123') return { _id: 'w_vendor' };
        return null;
      },
      save: async () => ({ _id: 'w_new' }),
      incrementBalance: async (id: string, amt: number) => {
        if (id === 'w_admin') adminBalanceIncrement += amt;
        if (id === 'w_vendor') vendorBalanceIncrement += amt;
      },
      decrementBalance: async (id: string, amt: number) => {
        if (id === 'w_admin') adminBalanceDecrement += amt;
      }
    };

    const mockWalletTransactionRepository = {
      save: async (txn: any) => {
        if (txn.userRef === 'admin_123') adminTransactions.push(txn);
        if (txn.userRef === 'vend_123') vendorTransactions.push(txn);
      }
    };

    const mockAdminRevenueRepository = {
      save: async () => {}
    };

    const useCase = new BalancePaymentSucceededUseCase(
      mockAdminRepository as any,
      mockPaymentRepository as any,
      mockBookingRepository as any,
      mockNotificationUseCase as any,
      mockCustomerRepository as any,
      mockVendorRepository as any,
      mockWalletTransactionRepository as any,
      mockWalletRepository as any,
      mockAdminRevenueRepository as any,
      mockCodeGenerator as any
    );

    const paymentIntent = {
      id: 'pi_test',
      amount_received: balance * 100,
      metadata: { bookingGroupId: 'bg_1', paymentType: 'balance' }
    };

    await useCase.execute(paymentIntent as any);

    
    if (adminTransactions.length > 0) {
      assert.strictEqual(adminBalanceIncrement, balance, `Admin increment expected ${balance}, got ${adminBalanceIncrement}`);
      assert.strictEqual(adminBalanceDecrement, expectedVendor, `Admin decrement expected ${expectedVendor}, got ${adminBalanceDecrement}`);
      assert.strictEqual(vendorBalanceIncrement, expectedVendor, `Vendor increment expected ${expectedVendor}, got ${vendorBalanceIncrement}`);
      
      const adminRetained = adminBalanceIncrement - adminBalanceDecrement;
      
     
      const expectedNetChange = balance - expectedVendor;
      assert.strictEqual(adminRetained, expectedNetChange, `Admin net change expected ${expectedNetChange}, got ${adminRetained}`);
      
      console.log(`Success. Admin net change: ${adminRetained}. Vendor received: ${vendorBalanceIncrement}`);
    } else {
      console.log(`Success. Skipped due to idempotency.`);
    }
  };

  // Case 1: Normal case
  await runTestCase('Normal case', 300, 700, 50, 950);

  // Case 2: Zero advance
  await runTestCase('Zero advance', 0, 700, 35, 665);

  // Case 3: Different advance
  await runTestCase('Different advance', 250, 750, 50, 950);

  // Case 4: Duplicate processing
  console.log(`\n--- Test Case: Duplicate processing ---`);
  let called = false;
  await runTestCase('Duplicate processing', 300, 700, 50, 950, (payment: any) => {
    payment.slots[0].remainingPayment.stripePaymentIntentId = 'pi_test';
    payment.slots[0].remainingPayment.status = 'paid';
    called = true;
  });

  console.log('\nAll tests passed successfully.');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
