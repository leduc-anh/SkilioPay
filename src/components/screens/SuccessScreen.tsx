import { FC } from "react";
import { Check } from "lucide-react";
import { Agreement } from "../../data/mockData";
import { colors } from "../common/constants";

interface SuccessScreenProps {
  agreement: Agreement | null;
  onGoToDashboard: () => void;
  onBackToHome: () => void;
}

/**
 * SuccessScreen Component
 * Displays payment confirmation after successful PayLater agreement creation
 * Shows agreement ID and first payment amount
 */
export const SuccessScreen: FC<SuccessScreenProps> = ({
  agreement,
  onGoToDashboard,
  onBackToHome,
}) => (
  <>
    {/* Success Banner */}
    <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-10 text-white text-center relative overflow-hidden flex-shrink-0">
      <div className="relative z-10">
        {/* Animated Success Icon */}
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl animate-bounce">
          <Check size={60} style={{ color: colors.primary }} strokeWidth={3} />
        </div>
        <div className="text-3xl font-bold mb-2">Payment Successful!</div>
        <div className="text-sm opacity-90">
          Your PayLater plan is now active
        </div>
      </div>
    </div>

    {/* Agreement Details */}
    <div className="p-6 space-y-5 text-gray-900">
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        {/* Plan ID */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <span className="text-gray-600 text-sm">Plan ID</span>
          <span
            className="font-mono font-bold text-sm"
            style={{ color: colors.dark }}
          >
            {agreement?.id}
          </span>
        </div>

        {/* First Payment Amount */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">First Payment</span>
          <span className="font-bold text-3xl" style={{ color: colors.dark }}>
            ${agreement?.schedule[0]?.amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <button
        onClick={onGoToDashboard}
        className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        style={{ backgroundColor: colors.primary }}
      >
        View My PayLater Plans
      </button>
      <button
        onClick={onBackToHome}
        className="w-full py-3 rounded-2xl font-medium text-gray-700 hover:bg-gray-100 transition-all"
      >
        Back to Home
      </button>
    </div>
  </>
);
