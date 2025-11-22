import {
  users,
  carts,
  agreements,
  activityLog,
  User,
  Cart,
  Agreement,
  Installment,
  ActivityLog,
  InstallmentStatus,
} from "../data/mockData";

export const MIN_ELIGIBLE_AMOUNT = 30.0;
const NUM_INSTALLMENTS = 3;

class PayLaterService {
  private agreements: Agreement[] = agreements;
  private activityLog: ActivityLog[] = activityLog;
  private simulateFailure = false;

  constructor() {
    this.log("PayLater service initialized.");
  }

  private log(message: string) {
    this.activityLog.unshift({ timestamp: new Date(), message });
  }

  public setSimulateFailure(shouldFail: boolean) {
    this.simulateFailure = shouldFail;
    this.log(
      `Payment failure simulation ${shouldFail ? "ENABLED" : "DISABLED"}.`
    );
  }

  public isEligible(
    userId: string,
    cartId: string
  ): { eligible: boolean; reason: string } {
    const user = users.find((u) => u.id === userId);
    const cart = carts.find((c) => c.id === cartId);

    if (!user || !cart)
      return { eligible: false, reason: "User or cart not found." };
    if (cart.userId !== user.id)
      return {
        eligible: false,
        reason: "This cart does not belong to the selected user.",
      };
    if (cart.total < MIN_ELIGIBLE_AMOUNT)
      return {
        eligible: false,
        reason: `Order total must be at least $${MIN_ELIGIBLE_AMOUNT.toFixed(
          2
        )}.`,
      };
    if (!user.isVerified)
      return { eligible: false, reason: "User account is not verified." };
    if (!user.hasPaymentMethod)
      return {
        eligible: false,
        reason: "No payment method linked to account.",
      };
    if (user.successfulTransactions < 1)
      return {
        eligible: false,
        reason: "Requires at least one successful past transaction.",
      };

    return { eligible: true, reason: "User is eligible for PayLater." };
  }

  public createPayLaterAgreement(
    userId: string,
    cartId: string
  ): Agreement | null {
    const eligibility = this.isEligible(userId, cartId);
    if (!eligibility.eligible) {
      this.log(
        `Agreement creation failed for user ${userId}: ${eligibility.reason}`
      );
      return null;
    }

    const user = users.find((u) => u.id === userId)!;
    const cart = carts.find((c) => c.id === cartId)!;

    const totalAmount = cart.total;
    const installmentAmount = totalAmount / NUM_INSTALLMENTS;

    const schedule: Installment[] = [];
    for (let i = 0; i < NUM_INSTALLMENTS; i++) {
      schedule.push({
        amount: installmentAmount,
        dueDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
        status: "UPCOMING",
      });
    }

    const newAgreement: Agreement = {
      id: `PL-${Date.now()}-${userId}`,
      userId,
      cartId,
      totalAmount,
      schedule,
      status: "ACTIVE",
    };

    this.log(`Agreement ${newAgreement.id} created for user ${userId}.`);
    this.agreements.push(newAgreement);

    // Process first payment immediately
    this.processPayment(newAgreement, 0);

    return newAgreement;
  }

  private processPayment(agreement: Agreement, installmentIndex: number) {
    const installment = agreement.schedule[installmentIndex];
    this.log(
      `Attempting charge for installment ${installmentIndex + 1} of agreement ${
        agreement.id
      }.`
    );

    // The first payment should succeed even if failure is simulated, unless it's a retry.
    const isFirstPaymentAttempt = installment.status !== "FAILED";

    if (this.simulateFailure && !isFirstPaymentAttempt) {
      installment.status = "FAILED";
      agreement.status = "FAILED";
      this.log(
        `Charge FAILED for installment ${installmentIndex + 1} (Simulated).`
      );
    } else {
      installment.status = "PAID";
      installment.paymentDate = new Date();
      this.log(`Charge SUCCEEDED for installment ${installmentIndex + 1}.`);
      // Update agreement status if all are paid
      if (agreement.schedule.every((inst) => inst.status === "PAID")) {
        agreement.status = "COMPLETED";
        this.log(`Agreement ${agreement.id} is now fully PAID.`);
      } else if (agreement.status === "FAILED") {
        agreement.status = "ACTIVE"; // Reset status from FAILED if a retry succeeds
      }
    }
  }

  public retryPayment(agreementId: string, installmentIndex: number) {
    const agreement = this.agreements.find((a) => a.id === agreementId);
    if (
      agreement &&
      agreement.schedule[installmentIndex]?.status === "FAILED"
    ) {
      this.processPayment(agreement, installmentIndex);
    } else {
      this.log(`Retry failed: Installment not found or not in FAILED state.`);
    }
  }

  public getAgreementsForUser(userId: string): Agreement[] {
    this.updateStatuses();
    return this.agreements.filter((a) => a.userId === userId);
  }

  public getActivityLog(): ActivityLog[] {
    return [...this.activityLog];
  }

  private updateStatuses() {
    const now = new Date();
    for (const agreement of this.agreements) {
      for (const installment of agreement.schedule) {
        if (installment.status === "UPCOMING" && installment.dueDate <= now) {
          installment.status = "DUE";
        }
      }
    }
  }
}

export const paylaterService = new PayLaterService();
