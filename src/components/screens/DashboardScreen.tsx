import { FC } from "react";
import {
  ChevronLeft,
  Bell,
  TrendingUp,
  CheckCircle,
  Headphones,
  Watch,
  Gamepad2,
} from "lucide-react";
import { User, Agreement } from "../../data/mockData";
import { colors } from "../common/constants";

interface DashboardScreenProps {
  user?: User;
  agreements?: Agreement[];
  logs?: Array<{ timestamp: Date; message: string }>;
  onBackToCheckout: () => void;
  onRetry?: (agreementId: string, installmentIndex: number) => void;
}

/**
 * DashboardScreen Component
 * Displays summary card, active/completed plans with progress tracking
 * Includes payment history view
 */
export const DashboardScreen: FC<DashboardScreenProps> = ({
  onBackToCheckout,
}) => {
  // Mock data for demo - simulating multiple plans
  const mockPlans = [
    {
      id: "PL-001",
      name: "Premium Headphones",
      icon: Headphones,
      color: "bg-emerald-500",
      progress: 1,
      total: 3,
      nextAmount: 99.67,
      nextDate: "Nov 23, 2025",
      status: "Active" as const,
    },
    {
      id: "PL-002",
      name: "Smartwatch Pro",
      icon: Watch,
      color: "bg-blue-500",
      progress: 2,
      total: 3,
      nextAmount: 86.67,
      nextDate: "Nov 28, 2025",
      status: "Active" as const,
    },
  ];

  const completedPlan = {
    id: "PL-000",
    name: "Gaming Console",
    icon: Gamepad2,
    completedDate: "Oct 15, 2025",
  };

  // Calculate summary
  const activePlans = mockPlans.length;
  const totalRemaining = mockPlans.reduce((sum, plan) => {
    const remaining = (plan.total - plan.progress) * plan.nextAmount;
    return sum + remaining;
  }, 0);
  const nextDueDate = "Nov 23";

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToCheckout}
            className="p-1"
            aria-label="Back to checkout"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-xl">My PayLater</span>
          <button className="p-1" aria-label="Notifications">
            <Bell size={24} />
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 space-y-5 bg-slate-50 overflow-y-auto">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-sm opacity-90 mb-1">Active Plans</div>
              <div className="text-6xl font-bold">{activePlans}</div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-white" />
            </div>
          </div>

          <div className="h-px bg-white/30 mb-4" />

          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-80 mb-1">Total Remaining</div>
              <div className="text-2xl font-bold">
                ${totalRemaining.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">Next Due</div>
              <div className="text-xl font-bold">{nextDueDate}</div>
            </div>
          </div>
        </div>

        {/* Active Payment Plans */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} style={{ color: colors.dark }} />
            <span
              className="font-bold text-base"
              style={{ color: colors.dark }}
            >
              Active Payment Plans
            </span>
          </div>

          <div className="space-y-3">
            {mockPlans.map((plan) => {
              const PlanIcon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4 mb-3">
                    {/* Icon */}
                    <div
                      className={`${plan.color} rounded-xl p-3 flex-shrink-0`}
                    >
                      <PlanIcon size={28} className="text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div
                          className="font-bold text-base"
                          style={{ color: colors.dark }}
                        >
                          {plan.name}
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                          {plan.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Plan #{plan.id}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(plan.progress / plan.total) * 100}%`,
                            backgroundColor: colors.primary,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {plan.progress}/{plan.total}
                      </span>
                    </div>
                  </div>

                  {/* Next Payment Info */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Next: ${plan.nextAmount.toFixed(2)}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: colors.dark }}
                    >
                      {plan.nextDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Plans */}
        <div>
          <div
            className="font-bold text-base mb-3"
            style={{ color: colors.dark }}
          >
            Completed Plans
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="bg-purple-500 rounded-xl p-3 flex-shrink-0">
                <Gamepad2 size={28} className="text-white" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div
                  className="font-bold text-base mb-1"
                  style={{ color: colors.dark }}
                >
                  {completedPlan.name}
                </div>
                <div className="text-xs text-gray-500">
                  Completed {completedPlan.completedDate}
                </div>
              </div>

              {/* Checkmark */}
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* View Payment History Button */}
        <button
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          View Payment History
        </button>
      </div>
    </>
  );
};
