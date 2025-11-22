import { FC } from "react";
import { RefreshCw } from "lucide-react";

interface RetryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  installmentNumber: number;
}

/**
 * RetryButton Component
 * Displays retry button for failed installment payments
 * Includes loading state and accessibility features
 */
export const RetryButton: FC<RetryButtonProps> = ({
  onClick,
  disabled = false,
  installmentNumber,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs font-bold py-1 px-2 rounded-md flex items-center gap-1 transition-colors ${
        disabled
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
      aria-label={`Retry payment for installment ${installmentNumber}`}
      title={`Click to retry failed payment for installment ${installmentNumber}`}
    >
      <RefreshCw size={12} className={disabled ? "" : "hover:animate-spin"} />
      Retry
    </button>
  );
};
