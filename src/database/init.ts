import Database from "better-sqlite3";
import path from "path";

export const initializeDatabase = () => {
  const dbPath = path.join(process.cwd(), "paylater.db");
  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma("foreign_keys = ON");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      successful_transactions INTEGER DEFAULT 0,
      has_payment_method INTEGER DEFAULT 0,
      default_payment_last4 TEXT,
      timezone TEXT DEFAULT 'Asia/Jakarta',
      locale TEXT DEFAULT 'id-ID',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      total REAL NOT NULL,
      currency TEXT DEFAULT 'IDR',
      eligible_threshold REAL,
      item_count INTEGER DEFAULT 1,
      item_name TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS agreements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      cart_id TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'COMPLETED', 'FAILED')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS installments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agreement_id TEXT NOT NULL,
      amount REAL NOT NULL,
      due_date DATETIME NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('PAID', 'DUE', 'UPCOMING', 'FAILED')),
      paid_date DATETIME,
      installment_number INTEGER NOT NULL,
      FOREIGN KEY (agreement_id) REFERENCES agreements(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      message TEXT NOT NULL,
      user_id TEXT,
      agreement_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (agreement_id) REFERENCES agreements(id) ON DELETE SET NULL
    );
  `);

  console.log("✅ Database tables created successfully!");
  return db;
};

export const seedDatabase = (db: Database.Database) => {
  // Clear existing data
  db.exec(`
    DELETE FROM activity_logs;
    DELETE FROM installments;
    DELETE FROM agreements;
    DELETE FROM carts;
    DELETE FROM users;
  `);

  // Insert users from mockData
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, is_verified, successful_transactions, has_payment_method, default_payment_last4, timezone, locale)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    ["U001", "Alya Pratama", 1, 3, 1, "4242", "Asia/Jakarta", "id-ID"],
    ["U002", "Bao Nguyen", 1, 2, 0, null, "Asia/Ho_Chi_Minh", "vi-VN"],
    ["U003", "Nur Izzah", 0, 1, 1, "1881", "Asia/Kuala_Lumpur", "ms-MY"],
    ["U004", "Kai Chen", 1, 1, 1, "0005", "Asia/Singapore", "en-SG"],
    ["U005", "Thao Le", 1, 0, 1, "4111", "Asia/Ho_Chi_Minh", "vi-VN"],
    ["U006", "Siti Rahman", 0, 0, 0, null, "Asia/Kuala_Lumpur", "ms-MY"],
    ["U007", "Ming Tan", 1, 0, 1, "7890", "Asia/Singapore", "en-SG"],
    ["U008", "Linh Pham", 1, 2, 1, "5555", "Asia/Ho_Chi_Minh", "vi-VN"],
  ];

  users.forEach((user) => insertUser.run(...user));
  console.log(`✅ Inserted ${users.length} users`);

  // Insert carts from mockData
  const insertCart = db.prepare(`
    INSERT INTO carts (id, user_id, total, currency, eligible_threshold, item_count, item_name, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const carts = [
    [
      "C001",
      "U001",
      2999000,
      "IDR",
      1000000,
      1,
      "Premium Headphones",
      "Electronics",
    ],
    [
      "C002",
      "U002",
      4500000,
      "VND",
      2000000,
      1,
      "Smartwatch Pro",
      "Wearable Tech",
    ],
    ["C003", "U003", 6000000, "MYR", 3000000, 1, "Gaming Console", "Gaming"],
    ["C004", "U004", 1200000, "SGD", 500000, 1, "Laptop Stand", "Accessories"],
    [
      "C005",
      "U005",
      1500000,
      "VND",
      500000,
      1,
      "Wireless Keyboard",
      "Computer Peripherals",
    ],
    ["C006", "U006", 5500000, "MYR", 2500000, 1, "4K Monitor", "Display"],
    [
      "C007",
      "U007",
      2500000,
      "SGD",
      1000000,
      1,
      "Mechanical Keyboard",
      "Gaming Accessories",
    ],
    [
      "C008",
      "U008",
      3500000,
      "VND",
      1500000,
      1,
      "Ergonomic Chair",
      "Furniture",
    ],
    ["C009", "U001", 800000, "IDR", 300000, 2, "USB-C Hub", "Accessories"],
  ];

  carts.forEach((cart) => insertCart.run(...cart));
  console.log(`✅ Inserted ${carts.length} carts`);

  console.log("✅ Database seeded successfully!");
};

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const db = initializeDatabase();
    seedDatabase(db);
    console.log("\n🎉 Database setup complete!");
    console.log(`📍 Location: ${path.join(process.cwd(), "paylater.db")}\n`);
    db.close();
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}
