export enum PlanDuration {
  ONE_MONTH = 1,
  THREE_MONTHS = 3,
  SIX_MONTHS = 6,
  TWELVE_MONTHS = 12,
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationMonths: PlanDuration;
  description: string;
  badge?: string;
  savingsText?: string;
}

export interface User {
  id: number;
  firstName: string;
  username?: string;
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  icon: string;
}

export enum AppStep {
  LOADING = 'loading',
  PLAN_SELECTION = 'plan_selection',
  CONFIRMATION = 'confirmation',
  PAYMENT_METHOD = 'payment_method',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}
