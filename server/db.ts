import fs from "fs";
import path from "path";
import crypto from "crypto";
import { User, Analysis, StructuredReportData } from "../src/types.js";

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
    abhaId?: string;
    role?: 'patient' | 'asha_worker' | 'caregiver';
    plan?: 'free' | 'premium';
  }>;
  analyses: Analysis[];
}

function generatePatientId(): string {
  const p1 = Math.floor(100000 + Math.random() * 900000);
  return `CS-P${p1}`;
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

// Simple SHA-256 Hashing function
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
      patientId: generatePatientId(),
      role: 'patient' as const,
      plan: 'free' as const
    };

    data.users.push(newUser);
    saveDb(data);

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
      patientId: newUser.patientId,
      role: newUser.role,
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
      patientId: (user as any).patientId || user.id.slice(0, 8).toUpperCase(),
      role: user.role || 'patient',
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
        patientId: generatePatientId(),
        role: 'patient' as const,
        plan: 'free' as const
      } as any;
      data.users.push(user);
      saveDb(data);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      patientId: (user as any).patientId || user.id.slice(0, 8).toUpperCase(),
      role: user.role || 'patient',
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
      patientId: (user as any).patientId || user.id.slice(0, 8).toUpperCase(),
      role: user.role || 'patient',
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
      abhaId: user.abhaId,
      role: user.role || 'patient',
      plan: user.plan
    };
  },

  // --- ANALYSES & REPORTS ---

  saveAnalysis(
    userId: string,
    reportName: string,
    reportType: string,
    rawText: string,
    explanation: string,
    language: 'en' | 'hi' | 'te',
    structuredData?: StructuredReportData
  ) {
    const data = initDb();

    const newAnalysis: Analysis = {
      id: crypto.randomUUID(),
      userId,
      reportName,
      reportType,
      rawText,
      explanation,
      language,
      createdAt: new Date().toISOString(),
      structuredData,
      translations: {
        [language]: { rawText, explanation, structuredData }
      }
    };

    data.analyses.push(newAnalysis);
    saveDb(data);

    return newAnalysis;
  },

  getUserHistory(userId: string): Analysis[] {
    const data = initDb();
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
  },

  updateAnalysis(
    analysisId: string,
    userId: string,
    explanation: string,
    language: 'en' | 'hi' | 'te',
    rawText?: string,
    structuredData?: StructuredReportData,
    doctorNotes?: string,
    followUpDate?: string
  ) {
    const data = initDb();
    const analysis = data.analyses.find(a => a.id === analysisId && a.userId === userId);
    if (!analysis) {
      throw new Error("Analysis report not found or unauthorized");
    }
    analysis.explanation = explanation;
    analysis.language = language;
    if (rawText !== undefined) {
      analysis.rawText = rawText;
    }
    if (structuredData !== undefined) {
      analysis.structuredData = structuredData;
    }
    if (doctorNotes !== undefined) {
      analysis.doctorNotes = doctorNotes;
    }
    if (followUpDate !== undefined) {
      analysis.followUpDate = followUpDate;
    }
    if (!analysis.translations) {
      analysis.translations = {};
    }
    analysis.translations[language] = {
      explanation,
      rawText: rawText !== undefined ? rawText : analysis.rawText,
      structuredData: structuredData !== undefined ? structuredData : analysis.structuredData
    };
    saveDb(data);
    return analysis;
  },

  upsertAnalysis(analysis: Analysis, userId: string): Analysis {
    const data = initDb();
    const existingIndex = data.analyses.findIndex(a => a.id === analysis.id && a.userId === userId);
    const updated: Analysis = {
      ...analysis,
      userId,
      updatedAt: analysis.updatedAt || new Date().toISOString()
    };
    if (existingIndex >= 0) {
      const existing = data.analyses[existingIndex];
      const existingTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : new Date(existing.createdAt).getTime();
      const newTime = updated.updatedAt ? new Date(updated.updatedAt).getTime() : new Date(updated.createdAt).getTime();
      if (newTime >= existingTime) {
        data.analyses[existingIndex] = {
          ...existing,
          ...updated
        };
      }
    } else {
      data.analyses.push(updated);
    }
    saveDb(data);
    return updated;
  }
};
