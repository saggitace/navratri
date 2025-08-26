import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = "dandiya-event"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { db: cachedDb, client: cachedClient } // <-- return both
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()

  const db = client.db(MONGODB_DB)

  cachedClient = client
  cachedDb = db

  return { db, client }
}