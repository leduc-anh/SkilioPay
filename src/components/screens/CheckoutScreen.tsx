import { FC, useState } from "react";
import {
  ChevronLeft,
  CreditCard,
  Calendar,
  Lock,
  Headphones,
} from "lucide-react";
import { Cart } from "../../data/mockData";
import { colors } from "../common/constants";

type PaymentOption = "full" | "1month" | "3months" | "6months" | "12months";

interface CheckoutScreenProps {
  cart: Cart;
  eligibility: { eligible: boolean; reason: string };
  onSelectPayLater: () => void;
  onOpenDashboard: () => void;
}

/**
 * CheckoutScreen Component
 * Displays product cart and multiple payment options
 * Shows PayLater installment plans with full payment option
 */
export const CheckoutScreen: FC<CheckoutScreenProps> = ({
  cart,
  eligibility,
  onSelectPayLater,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<PaymentOption>("3months");

  const paymentOptions = [
    { id: "1month" as PaymentOption, label: "Pay in 1 month", months: 1 },
    {
      id: "3months" as PaymentOption,
      label: "Pay in 3 months",
      months: 3,
      popular: true,
    },
    { id: "6months" as PaymentOption, label: "Pay in 6 months", months: 6 },
    { id: "12months" as PaymentOption, label: "Pay in 12 months", months: 12 },
  ];

  const handleContinue = () => {
    if (eligibility.eligible && selectedOption !== "full") {
      onSelectPayLater();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <button className="p-1" aria-label="Go back">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-xl">Checkout</span>
          <div className="w-8" />
        </div>
      </div>

      {/* Product Card & Payment Options */}
      <div className="p-6 space-y-5 overflow-y-auto">
        {/* Product Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 shadow-sm border border-emerald-200">
          <div className="flex gap-4 items-start">
            {/* Product Icon */}
            <div className="bg-emerald-500 rounded-2xl p-4 flex-shrink-0">
              <Headphones size={48} className="text-white" />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div
                className="font-bold text-lg mb-1"
                style={{ color: colors.dark }}
              >
                Premium Headphones
              </div>
              <div className="text-gray-600 text-sm mb-2">
                Wireless • Noise Cancelling
              </div>
              <div className="text-gray-500 text-xs">
                Color: Midnight Black • Qty: 1
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="border-t border-emerald-200 mt-4 pt-4 flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Total Amount</span>
            <div className="text-4xl font-bold" style={{ color: colors.dark }}>
              ${cart.total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Select Payment Method */}
        <div className="pt-2">
          <div
            className="flex items-center gap-2 mb-4"
            style={{ color: colors.dark }}
          >
            <CreditCard size={20} />
            <span className="font-bold text-base">Select Payment Method</span>
          </div>

          {/* Pay in Full Option */}
          <button
            onClick={() => setSelectedOption("full")}
            className={`w-full border-2 rounded-2xl p-4 mb-4 transition-all ${
              selectedOption === "full"
                ? "border-gray-400 bg-gray-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === "full"
                    ? "border-gray-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === "full" && (
                  <div className="w-3.5 h-3.5 bg-gray-500 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div
                  className="font-bold text-base"
                  style={{ color: colors.dark }}
                >
                  Pay in Full
                </div>
                <div className="text-sm text-gray-600">
                  ${cart.total.toFixed(2)} charged today
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* PayLater Options */}
        <div>
          <div
            className="flex items-center gap-2 mb-4"
            style={{ color: colors.dark }}
          >
            <Calendar size={20} />
            <span className="font-bold text-base">PayLater Options</span>
          </div>

          <div className="space-y-3">
            {paymentOptions.map((option) => (
              <div key={option.id} className="relative">
                <button
                  onClick={() => setSelectedOption(option.id)}
                  disabled={!eligibility.eligible}
                  className={`w-full border-2 rounded-2xl p-4 transition-all relative ${
                    selectedOption === option.id
                      ? "border-emerald-500 bg-emerald-50 shadow-md"
                      : eligibility.eligible
                      ? "border-gray-300 bg-white hover:border-emerald-300"
                      : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                >
                  {/* Popular Badge */}
                  {option.popular && (
                    <div
                      className="absolute -top-2 right-3 px-3 py-1 rounded-full text-black text-xs font-bold shadow-md"
                      style={{ backgroundColor: colors.accent }}
                    >
                      POPULAR
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedOption === option.id
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOption === option.id && (
                        <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div
                        className={`font-bold text-base ${
                          !eligibility.eligible ? "text-gray-400" : ""
                        }`}
                        style={
                          eligibility.eligible ? { color: colors.dark } : {}
                        }
                      >
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${(cart.total / option.months).toFixed(2)} / mo • 0%
                        Interest
                      </div>
                    </div>
                  </div>
                </button>

                {/* Ineligibility Message */}
                {!eligibility.eligible && (
                  <div className="text-xs text-red-500 mt-1 px-4">
                    {eligibility.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!eligibility.eligible || selectedOption === "full"}
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all shadow-lg ${
            eligibility.eligible && selectedOption !== "full"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continue to Payment
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pb-4">
          <Lock size={14} />
          <span>Secured by SkilioPay • PCI DSS Compliant</span>
        </div>
      </div>
    </>
  );
};
