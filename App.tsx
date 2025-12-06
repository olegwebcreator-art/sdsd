import React, { useState, useEffect, useCallback } from 'react';
import {
  AppStep,
  SubscriptionPlan,
  PaymentMethod,
  User
} from './types';
import { api } from './services/api';
import { PlanCard } from './components/PlanCard';
import { Button } from './components/Button';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  XCircle,
  RefreshCcw,
  Lock
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LOADING);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Selections
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Confirmation Checkbox
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      try {
        const [userData, plansData, methodsData] = await Promise.all([
          api.getUser(),
          api.getPlans(),
          api.getPaymentMethods()
        ]);
        setUser(userData);
        setPlans(plansData);
        setPaymentMethods(methodsData);
        setStep(AppStep.PLAN_SELECTION);
      } catch (e) {
        console.error("Failed to load init data", e);
        setStep(AppStep.ERROR);
      }
    };
    init();
  }, []);

  const handlePayment = async () => {
    if (!user || !selectedPlan || !selectedMethod) return;

    setStep(AppStep.PROCESSING);
    try {
      const result = await api.processPayment(user.id, selectedPlan.id, selectedMethod.id);
      if (result.success) {
        setStep(AppStep.SUCCESS);
      } else {
        setStep(AppStep.ERROR);
      }
    } catch (e) {
      setStep(AppStep.ERROR);
    }
  };

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card': return <CreditCard className="w-6 h-6 text-gray-600" />;
      case 'smartphone': return <Smartphone className="w-6 h-6 text-gray-600" />;
      case 'globe': return <Globe className="w-6 h-6 text-gray-600" />;
      default: return <CreditCard className="w-6 h-6 text-gray-600" />;
    }
  };

  // --- RENDER HELPERS ---

  if (step === AppStep.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading subscription options...</p>
      </div>
    );
  }

  // --- SCREEN 1: PLAN SELECTION ---
  if (step === AppStep.PLAN_SELECTION) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
        <header className="px-6 py-6 bg-white shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Choose your plan</h1>
          <p className="text-gray-500 text-sm mt-1">Unlock full access to premium features</p>
        </header>

        <main className="flex-1 p-6 space-y-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan?.id === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom">
          <Button
            fullWidth
            disabled={!selectedPlan}
            onClick={() => setStep(AppStep.CONFIRMATION)}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: CONFIRMATION (RECURRING WARNING) ---
  if (step === AppStep.CONFIRMATION && selectedPlan) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
         <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setStep(AppStep.PLAN_SELECTION)}
            className="p-1 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Confirm Subscription</h1>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Selected Plan</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xl font-bold text-gray-900">{selectedPlan.name}</span>
              <span className="text-xl font-bold text-indigo-600">${selectedPlan.price}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{selectedPlan.description}</p>
            <div className="h-px bg-gray-100 w-full mb-4"></div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Starting today</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Recurring Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">Recurring Billing</h4>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                Your card will be charged <strong>${selectedPlan.price}</strong> automatically every {selectedPlan.durationMonths === 1 ? 'month' : `${selectedPlan.durationMonths} months`} until you cancel. You can cancel any time in your account settings.
              </p>
            </div>
          </div>

          {/* Legal Consent */}
          <div className="flex items-start gap-3 p-2">
            <div className="relative flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-gray-600 leading-snug cursor-pointer select-none">
              I understand this is a <span className="font-medium text-gray-900">recurring payment</span> and I agree to the <a href="#" className="text-indigo-600 underline">Terms of Use</a> and <a href="#" className="text-indigo-600 underline">Privacy Policy</a>.
            </label>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom">
          <Button
            fullWidth
            disabled={!termsAccepted}
            onClick={() => setStep(AppStep.PAYMENT_METHOD)}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    );
  }

  // --- SCREEN 3: PAYMENT METHOD ---
  if (step === AppStep.PAYMENT_METHOD && selectedPlan) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
         <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setStep(AppStep.CONFIRMATION)}
            className="p-1 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Payment Method</h1>
        </header>

        <main className="flex-1 p-6 space-y-2">
          <div className="text-center py-4 mb-2">
            <span className="text-gray-500 text-sm">Total due today</span>
            <div className="text-3xl font-bold text-gray-900 mt-1">${selectedPlan.price}</div>
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Select Method</p>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMethod?.id === method.id
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="p-2 bg-white rounded-full border border-gray-100 shadow-sm">
                  {getMethodIcon(method.icon)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                  <p className="text-xs text-gray-500">Secure payment</p>
                </div>
                {selectedMethod?.id === method.id && (
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            Payments are processed securely
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom">
          <Button
            fullWidth
            disabled={!selectedMethod}
            onClick={handlePayment}
          >
            Pay ${selectedPlan.price}
          </Button>
        </div>
      </div>
    );
  }

  // --- LOADING / PROCESSING ---
  if (step === AppStep.PROCESSING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <h2 className="mt-6 text-xl font-bold text-gray-900">Processing Payment</h2>
        <p className="mt-2 text-gray-500">Please do not close this window...</p>
      </div>
    );
  }

  // --- SCREEN 4: SUCCESS ---
  if (step === AppStep.SUCCESS) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">You're all set!</h2>
        <p className="mt-3 text-gray-600">
          Your subscription to the <strong>{selectedPlan?.name}</strong> plan is now active. We've sent a confirmation to the chat.
        </p>
        <div className="mt-8 w-full max-w-xs">
          <Button fullWidth onClick={() => console.log("Close WebApp")}>
            Return to Bot
          </Button>
        </div>
      </div>
    );
  }

  // --- SCREEN 5: ERROR ---
  if (step === AppStep.ERROR) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
        <p className="mt-3 text-gray-600">
          Something went wrong while processing your payment. No charges were made.
        </p>
        <div className="mt-8 w-full max-w-xs space-y-3">
          <Button fullWidth onClick={() => setStep(AppStep.PAYMENT_METHOD)}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setStep(AppStep.PLAN_SELECTION)}>
            Change Plan
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
