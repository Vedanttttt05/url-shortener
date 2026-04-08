import dotenv from "dotenv";
dotenv.config();

import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;

console.log(process.env.DATABASE_URL);

const adapter = new PrismaPg(
  new pg.Pool({
    connectionString,
  })
);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;