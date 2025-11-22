// TypeScript types for SkilioPay PayLater MVP
export type InstallmentStatus = "PAID" | "DUE" | "UPCOMING" | "FAILED";
export type AgreementStatus = "ACTIVE" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  isVerified: boolean;
  successfulTransactions: number;
  hasPaymentMethod: boolean;
  defaultPaymentLast4: string | null;
  timezone: string;
  locale: string;
}

export interface Cart {
  id: string;
  userId: string;
  total: number;
  currency: string;
  eligibleThreshold: number;
  itemCount: number;
  itemName: string;
  notes: string;
}

export interface Installment {
  amount: number;
  dueDate: Date;
  status: InstallmentStatus;
  paymentDate?: Date;
}

export interface Agreement {
  id: string;
  userId: string;
  cartId: string;
  totalAmount: number;
  schedule: Installment[];
  status: AgreementStatus;
}

export interface ActivityLog {
  timestamp: Date;
  message: string;
}

// Mock Users - converted from paylater_users.csv
export const users: User[] = [
  {
    id: "U001",
    name: "Alya Pratama",
    isVerified: true,
    successfulTransactions: 3,
    hasPaymentMethod: true,
    defaultPaymentLast4: "4242",
    timezone: "Asia/Jakarta",
    locale: "id-ID",
  },
  {
    id: "U002",
    name: "Bao Nguyen",
    isVerified: true,
    successfulTransactions: 2,
    hasPaymentMethod: false,
    defaultPaymentLast4: null,
    timezone: "Asia/Ho_Chi_Minh",
    locale: "vi-VN",
  },
  {
    id: "U003",
    name: "Nur Izzah",
    isVerified: false,
    successfulTransactions: 1,
    hasPaymentMethod: true,
    defaultPaymentLast4: "1881",
    timezone: "Asia/Kuala_Lumpur",
    locale: "ms-MY",
  },
  {
    id: "U004",
    name: "Kai Chen",
    isVerified: true,
    successfulTransactions: 1,
    hasPaymentMethod: true,
    defaultPaymentLast4: "0005",
    timezone: "Asia/Singapore",
    locale: "en-SG",
  },
  {
    id: "U005",
    name: "Thao Le",
    isVerified: true,
    successfulTransactions: 0,
    hasPaymentMethod: true,
    defaultPaymentLast4: "4111",
    timezone: "Asia/Ho_Chi_Minh",
    locale: "vi-VN",
  },
  {
    id: "U006",
    name: "Rizky Saputra",
    isVerified: true,
    successfulTransactions: 5,
    hasPaymentMethod: true,
    defaultPaymentLast4: "2222",
    timezone: "Asia/Jakarta",
    locale: "id-ID",
  },
  {
    id: "U007",
    name: "Maricar Dizon",
    isVerified: true,
    successfulTransactions: 4,
    hasPaymentMethod: true,
    defaultPaymentLast4: "7357",
    timezone: "Asia/Manila",
    locale: "en-PH",
  },
  {
    id: "U008",
    name: "Minh Tran",
    isVerified: true,
    successfulTransactions: 2,
    hasPaymentMethod: true,
    defaultPaymentLast4: "1212",
    timezone: "Asia/Ho_Chi_Minh",
    locale: "vi-VN",
  },
];

// Mock Carts - converted from paylater_carts.csv
export const carts: Cart[] = [
  {
    id: "C001",
    userId: "U001",
    total: 120.0,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 3,
    itemName: "Premium Headphones Bundle",
    notes: "Eligible – standard",
  },
  {
    id: "C002",
    userId: "U001",
    total: 45.5,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 2,
    itemName: "Wireless Mouse & Pad",
    notes: "Eligible – small cart",
  },
  {
    id: "C003",
    userId: "U002",
    total: 85.0,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 1,
    itemName: "Mechanical Keyboard",
    notes: "Eligible but no payment method",
  },
  {
    id: "C004",
    userId: "U003",
    total: 150.0,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 4,
    itemName: "Gaming Accessories Pack",
    notes: "Unverified user",
  },
  {
    id: "C005",
    userId: "U004",
    total: 29.99,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 1,
    itemName: "USB Cable Set",
    notes: "Below threshold – hidden/disabled",
  },
  {
    id: "C006",
    userId: "U005",
    total: 60.0,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 2,
    itemName: "Phone Case & Screen Protector",
    notes: "No prior success – ineligible",
  },
  {
    id: "C007",
    userId: "U006",
    total: 999.99,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 6,
    itemName: "Premium Laptop Pro",
    notes: "High value cart",
  },
  {
    id: "C008",
    userId: "U007",
    total: 30.0,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 1,
    itemName: "Bluetooth Speaker",
    notes: "Exactly threshold – edge",
  },
  {
    id: "C009",
    userId: "U008",
    total: 220.0,
    currency: "USD",
    eligibleThreshold: 30.0,
    itemCount: 5,
    itemName: "Smart Watch Bundle",
    notes: "Eligible – complex",
  },
];

// Initial mock agreements and activity log
export const agreements: Agreement[] = [];
export const activityLog: ActivityLog[] = [];
