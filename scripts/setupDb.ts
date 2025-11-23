import { initializeDatabase, seedDatabase } from "../src/database/init";

try {
  console.log("🚀 Setting up database...\n");
  const db = initializeDatabase();
  seedDatabase(db);
  console.log("\n🎉 Database setup complete!");
  console.log(`📍 Location: ${process.cwd()}/paylater.db\n`);
  db.close();
} catch (error) {
  console.error("❌ Database setup failed:", error);
  process.exit(1);
}
