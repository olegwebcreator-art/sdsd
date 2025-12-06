import { SubscriptionPlan, PlanDuration, User, PaymentMethod, PaymentMethodType } from '../types';

// Mock Data
const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_1m',
    name: '1 Month',
    price: 9.99,
    currency: 'USD',
    durationMonths: PlanDuration.ONE_MONTH,
    description: 'Perfect for trying out premium features.',
    badge: 'Flexible',
  },
  {
    id: 'plan_3m',
    name: '3 Months',
    price: 24.99,
    currency: 'USD',
    durationMonths: PlanDuration.THREE_MONTHS,
    description: 'Save ~15% compared to monthly.',
    badge: 'Most Popular',
    savingsText: 'Save $5',
  },
  {
    id: 'plan_6m',
    name: '6 Months',
    price: 39.99,
    currency: 'USD',
    durationMonths: PlanDuration.SIX_MONTHS,
    description: 'Maximum savings for committed users.',
    badge: 'Best Value',
    savingsText: 'Save $20',
  },
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_card',
    type: PaymentMethodType.CREDIT_CARD,
    name: 'Credit / Debit Card',
    icon: 'credit-card',
  },
  {
    id: 'pm_apple',
    type: PaymentMethodType.APPLE_PAY,
    name: 'Apple Pay',
    icon: 'smartphone',
  },
  {
    id: 'pm_google',
    type: PaymentMethodType.GOOGLE_PAY,
    name: 'Google Pay',
    icon: 'globe',
  },
];

const MOCK_USER: User = {
  id: 123456789,
  firstName: 'Alex',
  username: 'alex_demo',
};

// Simulation Utilities
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getUser: async (): Promise<User> => {
    await delay(500);
    // In a real app, we would validate the Telegram WebApp initData here
    return MOCK_USER;
  },

  getPlans: async (): Promise<SubscriptionPlan[]> => {
    await delay(600);
    return MOCK_PLANS;
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await delay(300);
    return MOCK_PAYMENT_METHODS;
  },

  processPayment: async (userId: number, planId: string, methodId: string): Promise<{ success: boolean; transactionId?: string }> => {
    console.log(`Processing payment for User ${userId}, Plan ${planId} via ${methodId}`);
    await delay(2500); // Simulate processing time

    // Simulate random failure for demonstration (10% chance)
    if (Math.random() < 0.0) {
      return { success: false };
    }

    return { success: true, transactionId: `tx_${Date.now()}` };
  },
};
