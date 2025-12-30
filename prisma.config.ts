// prisma.config.ts
// For Node.js environments, you might need to import dotenv
import "dotenv/config"; 
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Specify the location of your schema files
  schema: "prisma", 
  migrations: {
    // Define where migrations should be stored
    path: "prisma/migrations"
  },
  datasource: {
    // Reference environment variables in a type-safe way
    url: env("DATABASE_URL"),
  },
  // You can also configure seeding commands here
  // seed: "node prisma/seed.js", 
});
