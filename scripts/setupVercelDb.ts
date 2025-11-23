import { sql } from "@vercel/postgres";

// This script sets up the Vercel Postgres database schema
// Run this once after creating your Vercel Postgres database

async function setupVercelDb() {
  console.log("🔧 Setting up Vercel Postgres database...");

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        successful_transactions INT DEFAULT 0,
        has_payment_method BOOLEAN DEFAULT FALSE,
        default_payment_last4 VARCHAR(4),
        timezone VARCHAR(50) NOT NULL,
        locale VARCHAR(10) NOT NULL
      )
    `;
    console.log("✅ Users table created");

    // Create carts table
    await sql`
      CREATE TABLE IF NOT EXISTS carts (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        eligible_threshold DECIMAL(10, 2) NOT NULL,
        item_count INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log("✅ Carts table created");

    // Create agreements table
    await sql`
      CREATE TABLE IF NOT EXISTS agreements (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        cart_id VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
      )
    `;
    console.log("✅ Agreements table created");

    // Create installments table
    await sql`
      CREATE TABLE IF NOT EXISTS installments (
        id SERIAL PRIMARY KEY,
        agreement_id VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        due_date TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL,
        installment_number INT NOT NULL,
        paid_date TIMESTAMP,
        FOREIGN KEY (agreement_id) REFERENCES agreements(id) ON DELETE CASCADE
      )
    `;
    console.log("✅ Installments table created");

    // Create activity_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        user_id VARCHAR(50),
        agreement_id VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (agreement_id) REFERENCES agreements(id) ON DELETE SET NULL
      )
    `;
    console.log("✅ Activity logs table created");

    // Seed data
    console.log("\n🌱 Seeding database...");

    // Insert users
    const users = [
      { id: "user_id_vn_001", name: "Nguyễn Văn An", timezone: "Asia/Ho_Chi_Minh", locale: "vi-VN", isVerified: true, successfulTransactions: 5, hasPaymentMethod: true, defaultPaymentLast4: "4242" },
      { id: "user_id_id_001", name: "Budi Santoso", timezone: "Asia/Jakarta", locale: "id-ID", isVerified: true, successfulTransactions: 3, hasPaymentMethod: true, defaultPaymentLast4: "5555" },
      { id: "user_id_my_001", name: "Ahmad Ibrahim", timezone: "Asia/Kuala_Lumpur", locale: "ms-MY", isVerified: false, successfulTransactions: 0, hasPaymentMethod: false, defaultPaymentLast4: null },
      { id: "user_id_sg_001", name: "Tan Wei Ming", timezone: "Asia/Singapore", locale: "en-SG", isVerified: true, successfulTransactions: 10, hasPaymentMethod: true, defaultPaymentLast4: "1234" },
      { id: "user_id_vn_002", name: "Trần Thị Bình", timezone: "Asia/Ho_Chi_Minh", locale: "vi-VN", isVerified: true, successfulTransactions: 2, hasPaymentMethod: true, defaultPaymentLast4: "9876" },
      { id: "user_id_id_002", name: "Siti Nurhaliza", timezone: "Asia/Jakarta", locale: "id-ID", isVerified: false, successfulTransactions: 0, hasPaymentMethod: false, defaultPaymentLast4: null },
      { id: "user_id_my_002", name: "Lee Mei Ling", timezone: "Asia/Kuala_Lumpur", locale: "ms-MY", isVerified: true, successfulTransactions: 7, hasPaymentMethod: true, defaultPaymentLast4: "6543" },
      { id: "user_id_sg_002", name: "Rajesh Kumar", timezone: "Asia/Singapore", locale: "en-SG", isVerified: true, successfulTransactions: 15, hasPaymentMethod: true, defaultPaymentLast4: "3210" },
    ];

    for (const user of users) {
      await sql`
        INSERT INTO users (id, name, is_verified, successful_transactions, has_payment_method, default_payment_last4, timezone, locale)
        VALUES (${user.id}, ${user.name}, ${user.isVerified}, ${user.successfulTransactions}, ${user.hasPaymentMethod}, ${user.defaultPaymentLast4}, ${user.timezone}, ${user.locale})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log("✅ Seeded 8 users");

    // Insert carts
    const carts = [
      { id: "cart_vn_001", userId: "user_id_vn_001", total: 5000000, currency: "VND", eligibleThreshold: 1000000, itemCount: 1, itemName: "Premium Headphones", notes: "High-end audio equipment" },
      { id: "cart_id_001", userId: "user_id_id_001", total: 3500000, currency: "IDR", eligibleThreshold: 500000, itemCount: 1, itemName: "Smartwatch Pro", notes: "Latest model with health tracking" },
      { id: "cart_my_001", userId: "user_id_my_001", total: 1200, currency: "MYR", eligibleThreshold: 300, itemCount: 2, itemName: "Wireless Earbuds", notes: "Bundle pack with charging case" },
      { id: "cart_sg_001", userId: "user_id_sg_001", total: 899, currency: "SGD", eligibleThreshold: 200, itemCount: 1, itemName: "Gaming Mouse", notes: "RGB mechanical gaming mouse" },
      { id: "cart_vn_002", userId: "user_id_vn_002", total: 15000000, currency: "VND", eligibleThreshold: 1000000, itemCount: 1, itemName: "Laptop Pro", notes: "Professional grade laptop" },
      { id: "cart_id_002", userId: "user_id_id_002", total: 800000, currency: "IDR", eligibleThreshold: 500000, itemCount: 3, itemName: "Office Accessories Bundle", notes: "Keyboard, mouse, webcam" },
      { id: "cart_my_002", userId: "user_id_my_002", total: 2500, currency: "MYR", eligibleThreshold: 300, itemCount: 1, itemName: "Tablet", notes: "10-inch tablet for productivity" },
      { id: "cart_sg_002", userId: "user_id_sg_002", total: 450, currency: "SGD", eligibleThreshold: 200, itemCount: 2, itemName: "Phone Case + Screen Protector", notes: "Premium protection bundle" },
      { id: "cart_vn_003", userId: "user_id_vn_001", total: 8000000, currency: "VND", eligibleThreshold: 1000000, itemCount: 1, itemName: "Camera Kit", notes: "DSLR camera with lens" },
    ];

    for (const cart of carts) {
      await sql`
        INSERT INTO carts (id, user_id, total, currency, eligible_threshold, item_count, item_name, notes)
        VALUES (${cart.id}, ${cart.userId}, ${cart.total}, ${cart.currency}, ${cart.eligibleThreshold}, ${cart.itemCount}, ${cart.itemName}, ${cart.notes})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log("✅ Seeded 9 carts");

    console.log("\n✅ Database setup complete!");
    console.log("\n📝 Next steps:");
    console.log("1. Set environment variable in Vercel: VITE_USE_VERCEL_DB=true");
    console.log("2. Deploy your app to Vercel");
    
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    throw error;
  }
}

setupVercelDb();
