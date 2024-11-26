import { MongoClient } from "mongodb";
import * as mongoDB from "mongodb";

export const collections: {
  rooms?: mongoDB.Collection;
} = {}; // here I Should add any other collections I guess

export async function connectToDB() {
  const db_client = new MongoClient(Deno.env.get("DB_CONN_STRING") ?? "");

  await db_client.connect();

  const db = db_client.db(Deno.env.get("DB_NAME") ?? "");

  console.log(`Successfully connected to database: ${db.databaseName}`);

  return db;
}
