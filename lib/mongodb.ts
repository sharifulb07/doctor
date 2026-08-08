import dns from "node:dns";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

declare global {
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

let cached = global.mongoose;
let dnsFallbackApplied = false;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function isSrvDnsError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code || "";
  return (
    MONGODB_URI.startsWith("mongodb+srv://") &&
    ["ECONNREFUSED", "ETIMEOUT", "ESERVFAIL"].includes(code) &&
    /querySrv|_mongodb\._tcp/i.test(error.message)
  );
}

export function isDatabaseConnectivityError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code || "";
  return (
    isSrvDnsError(error) ||
    ["ECONNREFUSED", "ETIMEDOUT", "ENETUNREACH", "ENOTFOUND"].includes(code) ||
    /server selection|could not connect|connection (?:timed out|refused)/i.test(
      error.message,
    )
  );
}

async function connectWithDnsFallback(opts: mongoose.ConnectOptions) {
  try {
    const instance = await mongoose.connect(MONGODB_URI, opts);
    console.log("MongoDB connected successfully");
    return instance;
  } catch (error) {
    if (!isSrvDnsError(error) || dnsFallbackApplied) throw error;

    // Some local or ISP resolvers refuse MongoDB Atlas SRV requests.
    // Retry only that DNS failure once through public DNS resolvers.
    dnsFallbackApplied = true;
    const directUri = buildDirectFallbackUri();
    if (directUri) {
      const instance = await mongoose.connect(directUri, opts);
      console.log("MongoDB connected successfully through direct hosts");
      return instance;
    }

    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    const instance = await mongoose.connect(MONGODB_URI, opts);
    console.log("MongoDB connected successfully after DNS fallback");
    return instance;
  }
}

function buildDirectFallbackUri(): string | null {
  const hosts = process.env.MONGODB_FALLBACK_HOSTS?.trim();
  const replicaSet = process.env.MONGODB_REPLICA_SET?.trim();
  if (!hosts || !replicaSet || !MONGODB_URI.startsWith("mongodb+srv://")) {
    return null;
  }

  const parsed = new URL(MONGODB_URI);
  const credentials = parsed.password
    ? `${parsed.username}:${parsed.password}@`
    : parsed.username
      ? `${parsed.username}@`
      : "";
  const database = parsed.pathname === "/" ? "/" : parsed.pathname;
  const params = new URLSearchParams(parsed.searchParams);
  params.set("tls", "true");
  params.set("authSource", params.get("authSource") || "admin");
  params.set("replicaSet", replicaSet);
  params.set("retryWrites", params.get("retryWrites") || "true");
  params.set("w", params.get("w") || "majority");

  return `mongodb://${credentials}${hosts}${database}?${params.toString()}`;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    cached.promise = connectWithDnsFallback(opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
