import { FC, useMemo } from "react";
import { ChevronLeft, Calendar } from "lucide-react";
import { Cart } from "../../data/mockData";
import { colors } from "../common/constants";
import {
  calculateInstallmentSchedule,
  NUM_INSTALLMENTS,
} from "../../utils/scheduleUtils";

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
      <div className="p-6 space-y-6 text-gray-900">
        {/* Total Amount Summary */}
        <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
          <div className="text-sm text-gray-600 mb-2">
            Total Purchase Amount
          </div>
          <div
            className="text-6xl font-bold mb-3"
            style={{ color: colors.dark }}
          >
            ${cart.total.toFixed(2)}
          </div>
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Calendar size={16} /> Split into {NUM_INSTALLMENTS} equal payments
          </div>
        </div>

        {/* Installment Schedule */}
        <div className="space-y-3">
          {installments.map((inst, i) => (
            <div
              key={i}
              className={`border-2 rounded-2xl p-4 transition-all ${
                i === 0
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* Installment Number Badge */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      i === 0
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>

                  {/* Installment Details */}
                  <div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: colors.dark }}
                    >
                      Payment {i + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {inst.date.toLocaleDateString()}
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
            </div>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          Confirm PayLater Plan
        </button>
      </div>
    </>
  );
};
