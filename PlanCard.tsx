import React from 'react';
import { SubscriptionPlan } from '../types';
import { Check } from 'lucide-react';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  const isBestValue = plan.durationMonths === 6;

  return (
    <div
      onClick={() => onSelect(plan)}
      className={`relative flex flex-col p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
          : 'border-gray-200 bg-white hover:border-indigo-300'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <span
          className={`absolute -top-3 right-4 px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-sm ${
            isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {plan.badge}
        </span>
      )}

      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-sm text-gray-500">/ {plan.durationMonths === 1 ? 'mo' : 'period'}</span>
          </div>
        </div>

        {/* Checkbox circle visual */}
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
          isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
        }`}>
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 leading-snug">
        {plan.description}
      </p>

      {/* Monthly Equivalent breakdown for longer plans */}
      {plan.durationMonths > 1 && (
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            ~${(plan.price / plan.durationMonths).toFixed(2)} / mo
          </span>
          {plan.savingsText && (
            <span className="text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
              {plan.savingsText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
