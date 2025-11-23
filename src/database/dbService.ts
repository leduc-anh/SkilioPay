import Database from "better-sqlite3";
import path from "path";
import type {
  User,
  Cart,
  Agreement,
  InstallmentStatus,
  AgreementStatus,
} from "../data/mockData";

interface DbRow {
  [key: string]: unknown;
}

let db: Database.Database | null = null;

const getDb = () => {
  if (!db) {
    const dbPath = path.join(process.cwd(), "paylater.db");
    db = new Database(dbPath);
    db.pragma("foreign_keys = ON");
  }
  return db;
};

export const dbService = {
  // Users
  getAllUsers: (): User[] => {
    const rows = getDb().prepare("SELECT * FROM users").all() as DbRow[];
    return rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      isVerified: Boolean(row.is_verified),
      successfulTransactions: row.successful_transactions as number,
      hasPaymentMethod: Boolean(row.has_payment_method),
      defaultPaymentLast4: row.default_payment_last4 as string | null,
      timezone: row.timezone as string,
      locale: row.locale as string,
    }));
  },

  getUserById: (id: string): User | undefined => {
    const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
      | DbRow
      | undefined;
    if (!row) return undefined;
    return {
      id: row.id as string,
      name: row.name as string,
      isVerified: Boolean(row.is_verified),
      successfulTransactions: row.successful_transactions as number,
      hasPaymentMethod: Boolean(row.has_payment_method),
      defaultPaymentLast4: row.default_payment_last4 as string | null,
      timezone: row.timezone as string,
      locale: row.locale as string,
    };
  },

  // Carts
  getAllCarts: (): Cart[] => {
    const rows = getDb().prepare("SELECT * FROM carts").all() as DbRow[];
    return rows.map((row) => ({
      id: row.id as string,
      userId: row.user_id as string,
      total: row.total as number,
      currency: row.currency as string,
      eligibleThreshold: row.eligible_threshold as number,
      itemCount: row.item_count as number,
      itemName: row.item_name as string,
      notes: row.notes as string,
    }));
  },

  getCartById: (id: string): Cart | undefined => {
    const row = getDb().prepare("SELECT * FROM carts WHERE id = ?").get(id) as
      | DbRow
      | undefined;
    if (!row) return undefined;
    return {
      id: row.id as string,
      userId: row.user_id as string,
      total: row.total as number,
      currency: row.currency as string,
      eligibleThreshold: row.eligible_threshold as number,
      itemCount: row.item_count as number,
      itemName: row.item_name as string,
      notes: row.notes as string,
    };
  },

  getCartsByUserId: (userId: string): Cart[] => {
    const rows = getDb()
      .prepare("SELECT * FROM carts WHERE user_id = ?")
      .all(userId) as DbRow[];
    return rows.map((row) => ({
      id: row.id as string,
      userId: row.user_id as string,
      total: row.total as number,
      currency: row.currency as string,
      eligibleThreshold: row.eligible_threshold as number,
      itemCount: row.item_count as number,
      itemName: row.item_name as string,
      notes: row.notes as string,
    }));
  },

  // Agreements
  createAgreement: (agreement: Agreement): void => {
    const db = getDb();
    const insertAgreement = db.prepare(`
      INSERT INTO agreements (id, user_id, cart_id, total_amount, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertAgreement.run(
      agreement.id,
      agreement.userId,
      agreement.cartId,
      agreement.totalAmount,
      agreement.status
    );

    // Insert installments
    const insertInstallment = db.prepare(`
      INSERT INTO installments (agreement_id, amount, due_date, status, installment_number)
      VALUES (?, ?, ?, ?, ?)
    `);

    agreement.schedule.forEach((inst, idx) => {
      insertInstallment.run(
        agreement.id,
        inst.amount,
        inst.dueDate.toISOString(),
        inst.status,
        idx + 1
      );
    });
  },

  getAgreementsByUserId: (userId: string): Agreement[] => {
    const db = getDb();
    const agreementRows = db
      .prepare(
        "SELECT * FROM agreements WHERE user_id = ? ORDER BY created_at DESC"
      )
      .all(userId) as DbRow[];

    return agreementRows.map((agr) => {
      const installments = db
        .prepare(
          "SELECT * FROM installments WHERE agreement_id = ? ORDER BY installment_number"
        )
        .all(agr.id) as DbRow[];

      return {
        id: agr.id as string,
        userId: agr.user_id as string,
        cartId: agr.cart_id as string,
        totalAmount: agr.total_amount as number,
        status: agr.status as AgreementStatus,
        schedule: installments.map((inst) => ({
          amount: inst.amount as number,
          dueDate: new Date(inst.due_date as string),
          status: inst.status as InstallmentStatus,
        })),
      };
    });
  },

  updateInstallmentStatus: (
    agreementId: string,
    installmentNumber: number,
    status: InstallmentStatus
  ): void => {
    const db = getDb();
    db.prepare(
      `
      UPDATE installments 
      SET status = ?, paid_date = CASE WHEN ? = 'PAID' THEN CURRENT_TIMESTAMP ELSE paid_date END
      WHERE agreement_id = ? AND installment_number = ?
    `
    ).run(status, status, agreementId, installmentNumber);
  },

  // Activity Logs
  addActivityLog: (
    message: string,
    userId?: string,
    agreementId?: string
  ): void => {
    getDb()
      .prepare(
        `
      INSERT INTO activity_logs (message, user_id, agreement_id)
      VALUES (?, ?, ?)
    `
      )
      .run(message, userId || null, agreementId || null);
  },

  getActivityLogs: (
    limit: number = 100
  ): Array<{ timestamp: Date; message: string }> => {
    const rows = getDb()
      .prepare("SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT ?")
      .all(limit) as DbRow[];

    return rows.map((row) => ({
      timestamp: new Date(row.timestamp as string),
      message: row.message as string,
    }));
  },

  // Close database connection
  close: () => {
    if (db) {
      db.close();
      db = null;
    }
  },
};
