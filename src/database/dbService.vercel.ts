import { sql } from "@vercel/postgres";
import type {
  User,
  Cart,
  Agreement,
  InstallmentStatus,
  AgreementStatus,
} from "../data/mockData";

export const dbServiceVercel = {
  // Users
  getAllUsers: async (): Promise<User[]> => {
    const { rows } = await sql`SELECT * FROM users`;
    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      isVerified: Boolean(row.is_verified),
      successfulTransactions: row.successful_transactions,
      hasPaymentMethod: Boolean(row.has_payment_method),
      defaultPaymentLast4: row.default_payment_last4,
      timezone: row.timezone,
      locale: row.locale,
    }));
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      isVerified: Boolean(row.is_verified),
      successfulTransactions: row.successful_transactions,
      hasPaymentMethod: Boolean(row.has_payment_method),
      defaultPaymentLast4: row.default_payment_last4,
      timezone: row.timezone,
      locale: row.locale,
    };
  },

  // Carts
  getAllCarts: async (): Promise<Cart[]> => {
    const { rows } = await sql`SELECT * FROM carts`;
    return rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      total: row.total,
      currency: row.currency,
      eligibleThreshold: row.eligible_threshold,
      itemCount: row.item_count,
      itemName: row.item_name,
      notes: row.notes,
    }));
  },

  getCartById: async (id: string): Promise<Cart | undefined> => {
    const { rows } = await sql`SELECT * FROM carts WHERE id = ${id}`;
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      total: row.total,
      currency: row.currency,
      eligibleThreshold: row.eligible_threshold,
      itemCount: row.item_count,
      itemName: row.item_name,
      notes: row.notes,
    };
  },

  getCartsByUserId: async (userId: string): Promise<Cart[]> => {
    const { rows } = await sql`SELECT * FROM carts WHERE user_id = ${userId}`;
    return rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      total: row.total,
      currency: row.currency,
      eligibleThreshold: row.eligible_threshold,
      itemCount: row.item_count,
      itemName: row.item_name,
      notes: row.notes,
    }));
  },

  // Agreements
  createAgreement: async (agreement: Agreement): Promise<void> => {
    // Insert agreement
    await sql`
      INSERT INTO agreements (id, user_id, cart_id, total_amount, status, created_at)
      VALUES (${agreement.id}, ${agreement.userId}, ${agreement.cartId}, ${agreement.totalAmount}, ${agreement.status}, NOW())
    `;

    // Insert installments
    for (let idx = 0; idx < agreement.schedule.length; idx++) {
      const inst = agreement.schedule[idx];
      await sql`
        INSERT INTO installments (agreement_id, amount, due_date, status, installment_number)
        VALUES (${agreement.id}, ${
        inst.amount
      }, ${inst.dueDate.toISOString()}, ${inst.status}, ${idx + 1})
      `;
    }
  },

  getAgreementsByUserId: async (userId: string): Promise<Agreement[]> => {
    const { rows: agreementRows } = await sql`
      SELECT * FROM agreements WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    const agreements: Agreement[] = [];
    for (const agr of agreementRows) {
      const { rows: installments } = await sql`
        SELECT * FROM installments WHERE agreement_id = ${agr.id} ORDER BY installment_number
      `;

      agreements.push({
        id: agr.id,
        userId: agr.user_id,
        cartId: agr.cart_id,
        totalAmount: agr.total_amount,
        status: agr.status as AgreementStatus,
        schedule: installments.map((inst: any) => ({
          amount: inst.amount,
          dueDate: new Date(inst.due_date),
          status: inst.status as InstallmentStatus,
        })),
      });
    }

    return agreements;
  },

  updateInstallmentStatus: async (
    agreementId: string,
    installmentNumber: number,
    status: InstallmentStatus
  ): Promise<void> => {
    if (status === "PAID") {
      await sql`
        UPDATE installments 
        SET status = ${status}, paid_date = NOW()
        WHERE agreement_id = ${agreementId} AND installment_number = ${installmentNumber}
      `;
    } else {
      await sql`
        UPDATE installments 
        SET status = ${status}
        WHERE agreement_id = ${agreementId} AND installment_number = ${installmentNumber}
      `;
    }
  },

  // Activity Logs
  addActivityLog: async (
    message: string,
    userId?: string,
    agreementId?: string
  ): Promise<void> => {
    await sql`
      INSERT INTO activity_logs (message, user_id, agreement_id, timestamp)
      VALUES (${message}, ${userId || null}, ${agreementId || null}, NOW())
    `;
  },

  getActivityLogs: async (
    limit: number = 100
  ): Promise<Array<{ timestamp: Date; message: string }>> => {
    const { rows } = await sql`
      SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT ${limit}
    `;

    return rows.map((row: any) => ({
      timestamp: new Date(row.timestamp),
      message: row.message,
    }));
  },

  // Close is a no-op for Vercel Postgres (connection pooling handled automatically)
  close: () => {
    // No-op for Vercel Postgres
  },
};
