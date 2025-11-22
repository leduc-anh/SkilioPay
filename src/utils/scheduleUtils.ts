/**
 * Payment Schedule Utilities
 * Handles calculation and generation of PayLater installment schedules
 */

export interface InstallmentScheduleItem {
  due: string;
  amount: number;
  date: Date;
}

/**
 * Number of installments in PayLater plan
 */
export const NUM_INSTALLMENTS = 3;

/**
 * Calculate installment schedule for a given total amount
 * @param totalAmount - Total purchase amount
 * @returns Array of installment schedule items with dates and amounts
 */
export function calculateInstallmentSchedule(
  totalAmount: number
): InstallmentScheduleItem[] {
  const installmentAmount = totalAmount / NUM_INSTALLMENTS;

  const schedule: InstallmentScheduleItem[] = [];

  for (let i = 0; i < NUM_INSTALLMENTS; i++) {
    const daysOffset = i * 30;
    const dueDate = new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);

    schedule.push({
      due: i === 0 ? "Today" : `in ${daysOffset} days`,
      amount: installmentAmount,
      date: dueDate,
    });
  }

  return schedule;
}

/**
 * Format installment amount to 2 decimal places
 * @param amount - Amount to format
 * @returns Formatted amount string
 */
export function formatInstallmentAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Get human-readable due date label
 * @param installmentIndex - Zero-based installment index (0, 1, 2)
 * @returns Label like "Today", "in 30 days", "in 60 days"
 */
export function getDueLabel(installmentIndex: number): string {
  if (installmentIndex === 0) return "Today";
  const days = installmentIndex * 30;
  return `in ${days} days`;
}

/**
 * Calculate due date for an installment
 * @param installmentIndex - Zero-based installment index
 * @param startDate - Agreement start date (defaults to now)
 * @returns Due date for the installment
 */
export function calculateDueDate(
  installmentIndex: number,
  startDate: Date = new Date()
): Date {
  const daysOffset = installmentIndex * 30;
  return new Date(startDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
}

/**
 * Validate if an installment is due
 * @param dueDate - Installment due date
 * @param currentDate - Current date to compare (defaults to now)
 * @returns True if installment is due
 */
export function isInstallmentDue(
  dueDate: Date,
  currentDate: Date = new Date()
): boolean {
  return dueDate <= currentDate;
}
