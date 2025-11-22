import { FC } from "react";
import { ChevronLeft, RefreshCw as RefreshCwIcon } from "lucide-react";
import { User, Agreement } from "../../data/mockData";
import { StatusBadge } from "../common/StatusBadge";
import { colors } from "../common/constants";

interface DashboardScreenProps {
  user: User;
  agreements: Agreement[];
  logs: Array<{ timestamp: Date; message: string }>;
  onBackToCheckout: () => void;
  onRetry: (agreementId: string, installmentIndex: number) => void;
}

/**
 * DashboardScreen Component
 * Displays user's active PayLater agreements, installment tracking, and activity log
 * Includes retry functionality for failed payments
 */
export const DashboardScreen: FC<DashboardScreenProps> = ({
  user,
  agreements,
  logs,
  onBackToCheckout,
  onRetry,
}) => (
  <>
    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
      <div className="flex items-center justify-between">
        <button onClick={onBackToCheckout} className="p-1" aria-label="Back to checkout">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-xl">My PayLater</span>
        <div className="w-6" />
      </div>
    </div>

    {/* Dashboard Content */}
    <div className="p-6 space-y-5 bg-slate-50 text-gray-900">
      {/* Active Plans Section */}
      <h2 className="font-bold text-lg" style={{ color: colors.dark }}>
        Active Plans ({agreements.length})
      </h2>

      {agreements.length > 0 ? (
        agreements.map((agr) => (
          <div
            key={agr.id}
            className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
          >
            {/* Agreement Header */}
            <div className="font-semibold" style={{ color: colors.dark }}>
              Plan #{agr.id.slice(0, 8)}... (${agr.totalAmount.toFixed(2)})
            </div>

            {/* Installment List */}
            {agr.schedule.map((inst, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm border-t pt-2"
              >
                {/* Installment Info */}
                <div>
                  <p className="font-medium">Installment {i + 1}</p>
                  <p className="text-xs text-gray-500">
                    {inst.dueDate.toLocaleDateString()}
                  </p>
                </div>

                {/* Amount */}
                <div className="font-bold">${inst.amount.toFixed(2)}</div>

                {/* Status or Retry Button */}
                <div className="w-20">
                  {inst.status === "FAILED" ? (
                    <button
                      onClick={() => onRetry(agr.id, i)}
                      className="text-xs bg-orange-500 text-white font-bold py-1 px-2 rounded-md flex items-center gap-1 hover:bg-orange-600 transition-colors"
                      aria-label={`Retry payment for installment ${i + 1}`}
                    >
                      <RefreshCwIcon size={12} /> Retry
                    </button>
                  ) : (
                    <StatusBadge status={inst.status} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">No active plans.</p>
      )}

      {/* Activity Log Section (Developer View) */}
      <div>
        <h2 className="font-bold text-lg mb-2" style={{ color: colors.dark }}>
          Activity Log (Dev View)
        </h2>
        <div className="bg-gray-800 text-white font-mono text-xs rounded-lg p-3 h-32 overflow-y-auto space-y-1">
          {logs.map((log, i) => (
            <p key={i}>
              <span className="text-emerald-400">
                {log.timestamp.toLocaleTimeString()}:
              </span>{" "}
              {log.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  </>
);
