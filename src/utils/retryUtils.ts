/**
 * Payment Retry Utilities
 * Handles retry logic and failure simulation for PayLater payments
 */

import { Agreement, Installment } from "../data/mockData";

/**
 * Check if an installment can be retried
 * @param installment - The installment to check
 * @returns True if installment status is FAILED
 */
export function canRetryInstallment(installment: Installment): boolean {
  return installment.status === "FAILED";
}

/**
 * Get installment that needs retry from an agreement
 * @param agreement - Agreement to search
 * @returns Index of first failed installment, or -1 if none
 */
export function getFailedInstallmentIndex(agreement: Agreement): number {
  return agreement.schedule.findIndex((inst) => inst.status === "FAILED");
}

/**
 * Check if agreement has any failed installments
 * @param agreement - Agreement to check
 * @returns True if any installment has FAILED status
 */
export function hasFailedInstallments(agreement: Agreement): boolean {
  return agreement.schedule.some((inst) => inst.status === "FAILED");
}

/**
 * Count number of failed installments in agreement
 * @param agreement - Agreement to analyze
 * @returns Count of failed installments
 */
export function countFailedInstallments(agreement: Agreement): number {
  return agreement.schedule.filter((inst) => inst.status === "FAILED").length;
}

/**
 * Get retry attempts metadata for logging
 * @param agreementId - ID of the agreement
 * @param installmentIndex - Index of installment being retried
 * @returns Metadata object for logging
 */
export interface RetryMetadata {
  agreementId: string;
  installmentIndex: number;
  timestamp: Date;
  attemptNumber: number;
}

/**
 * Create retry metadata for tracking
 * @param agreementId - Agreement ID
 * @param installmentIndex - Installment index
 * @param attemptNumber - Retry attempt number
 * @returns Retry metadata object
 */
export function createRetryMetadata(
  agreementId: string,
  installmentIndex: number,
  attemptNumber: number = 1
): RetryMetadata {
  return {
    agreementId,
    installmentIndex,
    timestamp: new Date(),
    attemptNumber,
  };
}

/**
 * Validate retry request
 * @param agreement - Agreement containing the installment
 * @param installmentIndex - Index of installment to retry
 * @returns Validation result with message
 */
export function validateRetryRequest(
  agreement: Agreement | undefined,
  installmentIndex: number
): { valid: boolean; message: string } {
  if (!agreement) {
    return { valid: false, message: "Agreement not found" };
  }

  if (installmentIndex < 0 || installmentIndex >= agreement.schedule.length) {
    return { valid: false, message: "Invalid installment index" };
  }

  const installment = agreement.schedule[installmentIndex];

  if (!canRetryInstallment(installment)) {
    return {
      valid: false,
      message: `Installment is not in FAILED status (current: ${installment.status})`,
    };
  }

  return { valid: true, message: "Retry request valid" };
}

/**
 * Retry strategies
 */
export enum RetryStrategy {
  IMMEDIATE = "immediate", // Retry immediately
  DELAYED = "delayed", // Retry after delay
  SCHEDULED = "scheduled", // Retry at specific time
}

/**
 * Get recommended retry strategy based on failure count
 * @param failureCount - Number of previous failures
 * @returns Recommended retry strategy
 */
export function getRetryStrategy(failureCount: number): RetryStrategy {
  if (failureCount === 0) return RetryStrategy.IMMEDIATE;
  if (failureCount < 3) return RetryStrategy.DELAYED;
  return RetryStrategy.SCHEDULED;
}
