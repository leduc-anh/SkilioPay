import { FC } from "react";
import { Check, Bell, CheckCircle } from "lucide-react";
import { Agreement } from "../../data/mockData";
import { colors } from "../common/constants";

interface SuccessScreenProps {
  agreement: Agreement | null;
  onGoToDashboard: () => void;
  onBackToHome: () => void;
}

/**
 * SuccessScreen Component
 * Displays payment confirmation with detailed plan info
 * Shows payment progress, next reminder, and what's next checklist
 */
export const SuccessScreen: FC<SuccessScreenProps> = ({
  agreement,
  onGoToDashboard,
  onBackToHome,
}) => {
  if (!agreement) return null;

  const paidAmount = agreement.schedule[0]?.amount || 0;
  const remainingAmount = agreement.totalAmount - paidAmount;
  const nextPayment = agreement.schedule[1];
  const nextPaymentDate = nextPayment
    ? new Date(nextPayment.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";
  const reminderDate = nextPayment
    ? new Date(new Date(nextPayment.dueDate).getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      )
    : "";

  return (
    <>
      {/* Success Banner */}
      <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-8 text-white text-center relative overflow-hidden flex-shrink-0">
        <div className="relative z-10">
          {/* Animated Success Icon */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce">
            <Check size={48} style={{ color: colors.primary }} strokeWidth={3} />
          </div>
          <div className="text-2xl font-bold mb-2">Payment<br/>Successful!</div>
          <div className="text-sm opacity-90">
            Your PayLater plan is now active
          </div>
        </div>
      </div>

      {/* Agreement Details */}
      <div className="p-6 space-y-4 text-gray-900 overflow-y-auto">
        {/* Plan Info Card */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
          {/* Plan ID */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
            <span className="text-gray-500 text-sm font-medium">Plan ID</span>
            <span
              className="font-mono font-bold text-sm"
              style={{ color: colors.dark }}
            >
              {agreement.id}
            </span>
          </div>

          {/* First Payment */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
            <span className="text-gray-500 text-sm font-medium">First Payment</span>
            <span className="font-bold text-2xl" style={{ color: colors.dark }}>
              ${paidAmount.toFixed(2)}
            </span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-medium">Status</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-lg text-sm font-semibold text-emerald-700">
              <CheckCircle size={14} />
              Confirmed & Active
            </span>
          </div>
        </div>

        {/* Next Payment Reminder */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex gap-3">
          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-amber-900 text-sm mb-1">
              Next Payment Reminder
            </div>
            <div className="text-amber-800 text-xs">
              We'll notify you on {reminderDate} (3 days before) for your ${nextPayment?.amount.toFixed(2)} payment due {nextPaymentDate}
            </div>
          </div>
        </div>

        {/* Payment Progress */}
        <div>
          <div className="font-bold text-base mb-2" style={{ color: colors.dark }}>
            Payment Progress
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(1 / agreement.schedule.length) * 100}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </div>
              <span className="font-bold text-sm" style={{ color: colors.dark }}>
                1/{agreement.schedule.length}
              </span>
            </div>
            {/* Progress Text */}
            <div className="flex justify-between text-xs text-gray-600">
              <span>${paidAmount.toFixed(2)} paid</span>
              <span>${remainingAmount.toFixed(2)} remaining</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="font-bold text-base mb-3" style={{ color: colors.dark }}>
            What's Next?
          </div>
          <div className="space-y-2">
            {[
              "Track your plan in the PayLater dashboard",
              "Receive automatic reminders before due dates",
              "Earn rewards for on-time payments",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={onGoToDashboard}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          View My PayLater Plans
        </button>
        <button
          onClick={onBackToHome}
          className="w-full py-3 rounded-2xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
          style={{ color: colors.dark }}
        >
          Back to Home
        </button>
      </div>
    </>
  );
};
