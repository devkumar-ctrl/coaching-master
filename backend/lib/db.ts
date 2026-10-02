import { MongoClient, ServerApiVersion, Db } from "mongodb"

const uri = process.env.MONGODB_URI

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Serverless functions scale out horizontally and each warm container keeps
  // its own pool. Without a cap, a burst of traffic opens far more connections
  // than MongoDB Atlas allows (100 on the free M0 tier) and the API starts
  // failing with "Too many connections".
  maxPoolSize: 5,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10_000,
}

// Resolved lazily and cached on globalThis, so `next build` does not need
// MONGODB_URI (it would otherwise fail at module load) and a warm function
// instance reuses one connection instead of reconnecting per cold start.
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

export function getClientPromise(): Promise<MongoClient> {
  if (!globalWithMongo._mongoClientPromise) {
    if (!uri) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect()
  }
  return globalWithMongo._mongoClientPromise
}

// Helper function to get database instance
// The database name should be included in your MONGODB_URI
// Example: mongodb://localhost:27017/coaching or mongodb+srv://user:pass@cluster.mongodb.net/coaching
export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db() // Uses database from URI, or you can specify: client.db("coaching")
}