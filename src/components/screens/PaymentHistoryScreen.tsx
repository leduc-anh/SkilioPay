import { FC } from "react";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Download,
  Bell,
} from "lucide-react";
import { Agreement } from "../../data/mockData";
import { colors } from "../common/constants";

interface PaymentHistoryScreenProps {
  agreements: Agreement[];
  onBack: () => void;
  onShowPaymentDue?: () => void;
}

/**
 * PaymentHistoryScreen Component
 * Displays complete payment history across all agreements
 * Shows past payments, upcoming payments, and failed payments
 */
export const PaymentHistoryScreen: FC<PaymentHistoryScreenProps> = ({
  agreements,
  onBack,
  onShowPaymentDue,
}) => {
  // Collect all payments from all agreements
  const allPayments = agreements.flatMap((agreement) =>
    agreement.schedule.map((payment, idx) => ({
      agreementId: agreement.id,
      cartId: agreement.cartId,
      installmentNumber: idx + 1,
      totalInstallments: agreement.schedule.length,
      amount: payment.amount,
      dueDate: new Date(payment.dueDate),
      status: payment.status,
      planName: "Premium Headphones", // Could be fetched from cart data
    }))
  );

  // Sort by date (most recent first)
  const sortedPayments = [...allPayments].sort(
    (a, b) => b.dueDate.getTime() - a.dueDate.getTime()
  );

  // Group by status
  const paidPayments = sortedPayments.filter((p) => p.status === "PAID");
  const upcomingPayments = sortedPayments.filter(
    (p) => p.status === "DUE" || p.status === "UPCOMING"
  );
  const failedPayments = sortedPayments.filter((p) => p.status === "FAILED");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-emerald-600 bg-emerald-50";
      case "DUE":
        return "text-amber-600 bg-amber-50";
      case "UPCOMING":
        return "text-blue-600 bg-blue-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle size={20} className="text-emerald-600" />;
      case "FAILED":
        return <XCircle size={20} className="text-red-600" />;
      case "DUE":
        return <Clock size={20} className="text-amber-600" />;
      case "UPCOMING":
        return <Calendar size={20} className="text-blue-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const renderPaymentCard = (payment: (typeof allPayments)[0]) => (
    <div
      key={`${payment.agreementId}-${payment.installmentNumber}`}
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        {/* Payment Info */}
        <div className="flex-1">
          <div
            className="font-bold text-base mb-1"
            style={{ color: colors.dark }}
          >
            {payment.planName}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Payment {payment.installmentNumber}/{payment.totalInstallments} •
            Plan #{payment.agreementId.slice(-4)}
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
            payment.status
          )}`}
        >
          {getStatusIcon(payment.status)}
          <span className="capitalize">{payment.status.toLowerCase()}</span>
        </div>
      </div>

      {/* Amount and Date */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-1">Amount</div>
          <div className="font-bold text-xl" style={{ color: colors.dark }}>
            ${payment.amount.toFixed(2)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">
            {payment.status === "PAID" ? "Paid on" : "Due on"}
          </div>
          <div className="font-semibold text-sm text-gray-700">
            {payment.dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-1" aria-label="Go back">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-xl">Payment History</span>
          <button
            onClick={onShowPaymentDue}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="View payment reminders"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 bg-slate-50 overflow-y-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Paid */}
          <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-700">
              {paidPayments.length}
            </div>
            <div className="text-xs text-emerald-600 font-medium">Paid</div>
          </div>

          {/* Upcoming */}
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {upcomingPayments.length}
            </div>
            <div className="text-xs text-blue-600 font-medium">Upcoming</div>
          </div>

          {/* Failed */}
          <div className="bg-red-50 rounded-xl p-3 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {failedPayments.length}
            </div>
            <div className="text-xs text-red-600 font-medium">Failed</div>
          </div>
        </div>

        {/* Failed Payments (if any) */}
        {failedPayments.length > 0 && (
          <div>
            <h3 className="font-bold text-base mb-3 text-red-700">
              Failed Payments
            </h3>
            <div className="space-y-3">
              {failedPayments.map((payment) => renderPaymentCard(payment))}
            </div>
          </div>
        )}

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <div>
            <h3
              className="font-bold text-base mb-3"
              style={{ color: colors.dark }}
            >
              Upcoming Payments
            </h3>
            <div className="space-y-3">
              {upcomingPayments.map((payment) => renderPaymentCard(payment))}
            </div>
          </div>
        )}

        {/* Paid Payments */}
        {paidPayments.length > 0 && (
          <div>
            <h3
              className="font-bold text-base mb-3"
              style={{ color: colors.dark }}
            >
              Payment History
            </h3>
            <div className="space-y-3">
              {paidPayments.map((payment) => renderPaymentCard(payment))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedPayments.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No payment history yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Your payment history will appear here
            </p>
          </div>
        )}

        {/* Export Button */}
        {sortedPayments.length > 0 && (
          <button
            className="w-full py-4 rounded-2xl border-2 font-bold text-base transition-all hover:bg-emerald-50 flex items-center justify-center gap-2"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            <Download size={20} />
            Export Payment History
          </button>
        )}
      </div>
    </>
  );
};
