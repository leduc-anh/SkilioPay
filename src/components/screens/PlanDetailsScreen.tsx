import { FC, useMemo } from "react";
import { ChevronLeft, Calendar, CheckCircle, Info } from "lucide-react";
import { Cart } from "../../data/mockData";
import { colors } from "../common/constants";
import { calculateInstallmentSchedule, NUM_INSTALLMENTS } from "../../utils/scheduleUtils";

interface PlanDetailsScreenProps {
  cart: Cart;
  onConfirm: () => void;
  onBack: () => void;
}

/**
 * PlanDetailsScreen Component
 * Displays the 3-installment payment schedule breakdown
 * Shows amounts, due dates, and confirmation button
 * Uses scheduleUtils for installment calculation
 */
export const PlanDetailsScreen: FC<PlanDetailsScreenProps> = ({
  cart,
  onConfirm,
  onBack,
}) => {
  // Calculate installment schedule using utility function
  const installments = useMemo(() => {
    return calculateInstallmentSchedule(cart.total);
  }, [cart.total]);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-1" aria-label="Go back">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-xl">Payment Plan</span>
          <div className="w-6" />
        </div>
      </div>

      {/* Plan Details */}
      <div className="p-6 space-y-6 text-gray-900 overflow-y-auto">
        {/* Total Amount Summary */}
        <div className="text-center py-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
          <div className="text-sm text-gray-500 mb-2 font-medium">
            Total Purchase Amount
          </div>
          <div
            className="text-5xl font-bold mb-4"
            style={{ color: colors.dark }}
          >
            ${cart.total.toFixed(2)}
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md"
            style={{ backgroundColor: colors.primary }}
          >
            <Calendar size={16} /> Split into {NUM_INSTALLMENTS} equal payments
          </button>
        </div>

        {/* Payment Schedule Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-emerald-500" />
            <span className="font-bold text-base" style={{ color: colors.dark }}>
              Payment Schedule
            </span>
          </div>

          {/* Installment Cards */}
          <div className="space-y-3">
            {installments.map((inst, i) => (
              <div
                key={i}
                className={`border-2 rounded-2xl p-4 transition-all ${
                  i === 0
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {/* Installment Number Badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        i === 0
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* Installment Details */}
                    <div>
                      <div
                        className="font-bold text-base mb-1"
                        style={{ color: colors.dark }}
                      >
                        {i === 0 ? "First" : i === 1 ? "Second" : "Third"} Payment
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar size={12} />
                        {inst.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.dark }}
                  >
                    ${inst.amount.toFixed(2)}
                  </div>
                </div>

                {/* Due Today Badge */}
                {i === 0 && (
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-lg text-xs font-semibold text-emerald-700">
                      <CheckCircle size={14} />
                      Due Today
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Auto-payment Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-blue-900 mb-1">
              Auto-payment enabled:
            </div>
            <div className="text-blue-800">
              Future installments will be automatically charged to your linked payment
              method on the due dates.
            </div>
          </div>
        </div>

        {/* Plan Benefits */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <div className="font-bold text-base mb-3" style={{ color: colors.dark }}>
            Plan Benefits:
          </div>
          <div className="space-y-2">
            {[
              "0% interest if paid on time",
              "Reminders sent 3 days before each payment",
              "Cancel within 24 hours for full refund",
              "No impact on credit score",
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          Confirm PayLater Plan
        </button>

        {/* Terms & Conditions Link */}
        <button
          className="w-full py-4 rounded-2xl border-2 border-emerald-500 font-bold text-base transition-all hover:bg-emerald-50"
          style={{ color: colors.primary }}
        >
          View Terms & Conditions
        </button>
      </div>
    </>
  );
};
