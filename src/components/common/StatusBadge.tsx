import { FC } from "react";
import { InstallmentStatus } from "../../data/mockData";

interface StatusBadgeProps {
  status: InstallmentStatus;
}

/**
 * StatusBadge Component
 * Displays installment payment status with appropriate color coding
 */
export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    PAID: "bg-green-100 text-green-700",
    DUE: "bg-yellow-100 text-yellow-700 animate-pulse",
    UPCOMING: "bg-blue-100 text-blue-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`text-xs font-medium px-3 py-1 rounded-full text-center ${styles[status]}`}
    >
      {status}
    </div>
  );
};
