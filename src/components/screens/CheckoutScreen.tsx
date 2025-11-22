import { FC } from "react";
import { Calendar, Lock, User as UserIcon } from "lucide-react";
import { Cart } from "../../data/mockData";
import { colors } from "../common/constants";

interface CheckoutScreenProps {
  cart: Cart;
  eligibility: { eligible: boolean; reason: string };
  onSelectPayLater: () => void;
  onOpenDashboard: () => void;
}

/**
 * CheckoutScreen Component
 * Displays cart information and PayLater payment option
 * Shows eligibility status and tooltip for ineligible users
 */
export const CheckoutScreen: FC<CheckoutScreenProps> = ({
  cart,
  eligibility,
  onSelectPayLater,
  onOpenDashboard,
}) => (
  <>
    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="w-6" />
        <span className="font-bold text-xl">Checkout</span>
        <button onClick={onOpenDashboard} className="p-1" aria-label="Open Dashboard">
          <UserIcon size={20} />
        </button>
      </div>
    </div>

    {/* Cart Summary */}
    <div className="p-6 space-y-5 text-gray-900">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-sm border border-emerald-200">
        <div
          className="font-bold text-xl truncate"
          style={{ color: colors.dark }}
          title={cart.itemName}
        >
          {cart.itemName}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-emerald-200 mt-4">
          <span className="text-gray-600 font-medium">Total Amount</span>
          <div className="text-4xl font-bold" style={{ color: colors.dark }}>
            ${cart.total.toFixed(2)}
          </div>
        </div>
      </div>

      {/* PayLater Option Section */}
      <div
        className="font-bold text-lg flex items-center gap-2 pt-2"
        style={{ color: colors.dark }}
      >
        <Calendar size={20} /> PayLater Options
      </div>

      {/* PayLater Selection Button */}
      <div className="relative group">
        <button
          onClick={onSelectPayLater}
          disabled={!eligibility.eligible}
          className={`w-full relative border-2 rounded-2xl p-4 cursor-pointer transition-all ${
            eligibility.eligible
              ? "border-emerald-500 bg-emerald-50 shadow-lg"
              : "border-gray-300 bg-gray-100 text-gray-500"
          }`}
          aria-label="Select PayLater payment option"
        >
          {/* Popular Badge */}
          <div
            className="absolute -top-3 right-3 px-3 py-1 rounded-full text-black text-xs font-bold shadow-lg"
            style={{ backgroundColor: colors.accent }}
          >
            POPULAR
          </div>

          <div className="flex items-center gap-4">
            {/* Radio Button */}
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                eligibility.eligible ? "border-emerald-500" : "border-gray-400"
              }`}
            >
              {eligibility.eligible && (
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full"></div>
              )}
            </div>

            {/* Option Details */}
            <div className="flex-1 text-left">
              <div
                className={`font-bold text-lg ${
                  eligibility.eligible ? "" : "text-gray-500"
                }`}
                style={{ color: eligibility.eligible ? colors.dark : "" }}
              >
                Pay in 3 months
              </div>
              <div className="text-sm text-gray-600">
                ${(cart.total / 3).toFixed(2)} / mo • 0% Interest
              </div>
            </div>
          </div>
        </button>

        {/* Ineligibility Tooltip */}
        {!eligibility.eligible && (
          <div className="absolute bottom-full mb-2 w-full left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {eligibility.reason}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
        <Lock size={14} />
        <span>Secured by SkilioPay</span>
      </div>
    </div>
  </>
);
