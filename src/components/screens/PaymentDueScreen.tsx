import { FC } from "react";
import { ChevronLeft, Bell, Headphones, CreditCard, CheckCircle } from "lucide-react";
import { Agreement } from "../../data/mockData";
import { colors } from "../common/constants";

interface PaymentDueScreenProps {
  agreement: Agreement | null;
  onPayNow: () => void;
  onUpdatePaymentMethod: () => void;
  onDismiss: () => void;
  onBack: () => void;
}

/**
 * PaymentDueScreen Component
 * Displays payment due reminder notification with upcoming installment details
 * Shows payment timeline and action buttons
 */
export const PaymentDueScreen: FC<PaymentDueScreenProps> = ({
  agreement,
  onPayNow,
  onUpdatePaymentMethod,
  onDismiss,
  onBack,
}) => {
  if (!agreement) return null;

  // Find the next due payment (first DUE or UPCOMING)
  const nextPaymentIndex = agreement.schedule.findIndex(
    (inst) => inst.status === "DUE" || inst.status === "UPCOMING"
  );
  const nextPayment = agreement.schedule[nextPaymentIndex];
  
  if (!nextPayment) return null;

  const daysUntilDue = Math.ceil(
    (new Date(nextPayment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      {/* Header - Orange/Amber theme for urgency */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-1" aria-label="Go back">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-xl">Payment Due</span>
          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 bg-slate-50 overflow-y-auto">
        {/* Alert Icon */}
        <div className="flex flex-col items-center pt-4">
          <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Bell size={56} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.dark }}>
            Payment Due Soon!
          </h2>
          <p className="text-gray-600 text-center">
            Your next installment is due in {daysUntilDue} days
          </p>
        </div>

        {/* Plan Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
            {/* Product Icon */}
            <div className="bg-emerald-500 rounded-xl p-3 flex-shrink-0">
              <Headphones size={32} className="text-white" />
            </div>
            {/* Product Info */}
            <div className="flex-1">
              <div className="font-bold text-lg" style={{ color: colors.dark }}>
                Premium Headphones
              </div>
              <div className="text-sm text-gray-500">
                PayLater Plan #{agreement.id.slice(-4)}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            {/* Payment Amount */}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Payment Amount</span>
              <span className="text-3xl font-bold" style={{ color: colors.dark }}>
                ${nextPayment.amount.toFixed(2)}
              </span>
            </div>

            {/* Due Date */}
            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-gray-600 font-medium">Due Date</span>
              <span className="font-bold text-lg" style={{ color: colors.dark }}>
                {new Date(nextPayment.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-gray-600 font-medium">Payment Method</span>
              <div className="flex items-center gap-2 text-gray-700">
                <CreditCard size={18} />
                <span className="font-mono text-sm">•••• 4242</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-charge Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell size={16} className="text-white" />
          </div>
          <div className="flex-1 text-sm">
            <p className="text-blue-900">
              <span className="font-bold">Payment will be automatically charged</span> on{" "}
              {new Date(nextPayment.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              . Please ensure you have sufficient funds in your account.
            </p>
          </div>
        </div>

        {/* Payment Timeline */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="font-bold text-base mb-4" style={{ color: colors.dark }}>
            Payment Timeline
          </div>

          <div className="space-y-3">
            {agreement.schedule.map((payment, idx) => {
              const isPaid = payment.status === "PAID";
              const isCurrent = idx === nextPaymentIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 ${
                    idx < agreement.schedule.length - 1 ? "pb-3 border-b border-gray-100" : ""
                  }`}
                >
                  {/* Status Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                      isPaid
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-yellow-400 text-gray-800"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isPaid ? <CheckCircle size={20} /> : idx + 1}
                  </div>

                  {/* Payment Info */}
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: colors.dark }}>
                      Payment {idx + 1}/{agreement.schedule.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isPaid
                        ? `$${payment.amount.toFixed(2)} paid on ${new Date(
                            payment.dueDate
                          ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : isCurrent
                        ? `Due in ${daysUntilDue} days`
                        : `Due ${new Date(payment.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}`}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isCurrent && (
                    <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          {/* Pay Now Button */}
          <button
            onClick={onPayNow}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: colors.primary }}
          >
            Pay Now
          </button>

          {/* Update Payment Method */}
          <button
            onClick={onUpdatePaymentMethod}
            className="w-full py-4 rounded-2xl border-2 font-bold text-base transition-all hover:bg-emerald-50"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            Update Payment Method
          </button>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition-all"
          >
            Dismiss Reminder
          </button>
        </div>
      </div>
    </>
  );
};
