import fs from "fs";
import path from "path";
import crypto from "crypto";
import { User, Analysis } from "../src/types.js"; // Note: we can use relative imports

// Database File Path
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Database Schema interface
interface DbSchema {
  users: Array<{
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: string;
    plan?: 'free' | 'premium';
  }>;
  analyses: Analysis[];
}

// Utility to initialize the database if it doesn't exist
function initDb(): DbSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DbSchema = { users: [], analyses: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content) as DbSchema;
  } catch (error) {
    console.error("Failed to parse db.json, resetting...", error);
    const initialData: DbSchema = { users: [], analyses: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

// Helper to write data back to db.json
function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to db.json:", error);
  }
}

// Simple SHA-256 Hashing function (no external dependencies, 100% stable!)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const db = {
  // --- USER AUTHENTICATION ---

  registerUser(email: string, name: string, passwordString: string) {
    const data = initDb();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = data.users.find(u => u.email === normalizedEmail);
    if (existing) {
      throw new Error("User with this email already exists");
    }

    const newUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: hashPassword(passwordString),
      createdAt: new Date().toISOString(),
      plan: 'free' as const
    };

    data.users.push(newUser);
    saveDb(data);

    // Return user profile without passwordHash
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
      plan: newUser.plan
    };
  },

  loginUser(email: string, passwordString: string) {
    const data = initDb();
    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = hashPassword(passwordString);

    const user = data.users.find(u => u.email === normalizedEmail && u.passwordHash === passwordHash);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      plan: user.plan || 'free'
    };
  },

  loginOrRegisterGoogleUser(email: string, name: string) {
    const data = initDb();
    const normalizedEmail = email.toLowerCase().trim();

    let user = data.users.find(u => u.email === normalizedEmail);
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        name: name.trim(),
        passwordHash: hashPassword(crypto.randomBytes(16).toString("hex")),
        createdAt: new Date().toISOString(),
        plan: 'free' as const
      };
      data.users.push(user);
      saveDb(data);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      plan: user.plan || 'free'
    };
  },

  getUser(userId: string) {
    const data = initDb();
    const user = data.users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      plan: user.plan || 'free'
    };
  },

  updateUserPlan(userId: string, plan: 'free' | 'premium') {
    const data = initDb();
    const user = data.users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.plan = plan;
    saveDb(data);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      plan: user.plan
    };
  },

  // --- ANALYSES & REPORTS ---

  saveAnalysis(userId: string, reportName: string, reportType: string, rawText: string, explanation: string, language: 'en' | 'hi' | 'te' | 'ta') {
    const data = initDb();

    const newAnalysis: Analysis = {
      id: crypto.randomUUID(),
      userId,
      reportName,
      reportType,
      rawText,
      explanation,
      language,
      createdAt: new Date().toISOString()
    };

    data.analyses.push(newAnalysis);
    saveDb(data);

    return newAnalysis;
  },

  getUserHistory(userId: string): Analysis[] {
    const data = initDb();
    // Filter by userId and sort by newest first
    return data.analyses
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  deleteAnalysis(analysisId: string, userId: string) {
    const data = initDb();
    const index = data.analyses.findIndex(a => a.id === analysisId && a.userId === userId);
    if (index === -1) {
      throw new Error("Analysis report not found or unauthorized");
    }

    data.analyses.splice(index, 1);
    saveDb(data);
    return true;
  }
};
