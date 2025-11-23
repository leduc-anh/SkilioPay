// Environment-based database service
// Uses SQLite for development, Vercel Postgres for production

import type {
  User,
  Cart,
  Agreement,
  InstallmentStatus,
} from "../data/mockData";

// Check if we're in production (Vercel)
const isProduction = import.meta.env.PROD && import.meta.env.VITE_USE_VERCEL_DB === 'true';

// Dynamic imports to avoid bundling unused code
let dbService: {
  getAllUsers: () => Promise<User[]> | User[];
  getUserById: (id: string) => Promise<User | undefined> | User | undefined;
  getAllCarts: () => Promise<Cart[]> | Cart[];
  getCartById: (id: string) => Promise<Cart | undefined> | Cart | undefined;
  getCartsByUserId: (userId: string) => Promise<Cart[]> | Cart[];
  createAgreement: (agreement: Agreement) => Promise<void> | void;
  getAgreementsByUserId: (userId: string) => Promise<Agreement[]> | Agreement[];
  updateInstallmentStatus: (
    agreementId: string,
    installmentNumber: number,
    status: InstallmentStatus
  ) => Promise<void> | void;
  addActivityLog: (
    message: string,
    userId?: string,
    agreementId?: string
  ) => Promise<void> | void;
  getActivityLogs: (
    limit?: number
  ) => Promise<Array<{ timestamp: Date; message: string }>> | Array<{ timestamp: Date; message: string }>;
  close: () => void;
};

if (isProduction) {
  // Load Vercel Postgres in production
  const { dbServiceVercel } = await import("./dbService.vercel");
  dbService = dbServiceVercel;
} else {
  // Load SQLite in development
  const { dbService: sqliteDbService } = await import("./dbService");
  dbService = sqliteDbService;
}

export { dbService };
