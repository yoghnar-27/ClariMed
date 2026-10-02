import Dexie, { Table } from 'dexie';
import { Analysis, HealthcareFacility, SyncQueueItem, User } from '../types';
import { PUBLIC_HEALTHCARE_FACILITIES } from '../data/healthcareFacilities';

export interface UserPreference {
  key: string;
  value: any;
  updatedAt: number;
}

export class CareSaathiOfflineDB extends Dexie {
  reports!: Table<Analysis, string>;
  facilities!: Table<HealthcareFacility, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  userPreferences!: Table<UserPreference, string>;

  constructor() {
    super('CareSaathiOfflineDB');
    this.version(1).stores({
      reports: 'id, userId, reportName, reportType, language, syncStatus, createdAt, updatedAt',
      facilities: 'id, name, type, isEmergency24x7, isAyushmanEmpaneled, distanceKm',
      syncQueue: '++id, action, entityId, timestamp, status',
      userPreferences: 'key, updatedAt'
    });
  }
}

export const offlineDb = new CareSaathiOfflineDB();

/**
 * Initialize and seed the local IndexedDB database.
 * Ensures the comprehensive public healthcare facilities dataset is cached offline immediately.
 */
export async function initOfflineStorage(): Promise<void> {
  try {
    const facilityCount = await offlineDb.facilities.count();
    if (facilityCount === 0) {
      await offlineDb.facilities.bulkAdd(PUBLIC_HEALTHCARE_FACILITIES);
      console.log(`[Care Saathi IndexedDB] Seeded ${PUBLIC_HEALTHCARE_FACILITIES.length} healthcare facilities locally`);
    }
  } catch (error) {
    console.warn('[Care Saathi IndexedDB] Facility pre-seeding info:', error);
  }
}

/**
 * Save or update report in IndexedDB
 */
export async function saveReportToIndexedDB(report: Analysis): Promise<void> {
  const updatedReport: Analysis = {
    ...report,
    updatedAt: report.updatedAt || new Date().toISOString(),
    syncStatus: report.syncStatus || 'synced'
  };
  await offlineDb.reports.put(updatedReport);
}

/**
 * Bulk cache reports into IndexedDB (e.g. when fetched from server while online)
 */
export async function cacheReportsToIndexedDB(reports: Analysis[]): Promise<void> {
  if (!reports || reports.length === 0) return;
  
  // Merge conflict-safely: do not overwrite local pending unsynced changes
  const existingPending = await offlineDb.reports
    .where('syncStatus')
    .equals('pending')
    .toArray();
  const pendingIds = new Set(existingPending.map(r => r.id));

  const reportsToSave = reports.map(r => {
    if (pendingIds.has(r.id)) {
      // Keep local pending version to prevent overwriting
      return null;
    }
    return {
      ...r,
      syncStatus: (r.syncStatus || 'synced') as any
    };
  }).filter(Boolean) as Analysis[];

  if (reportsToSave.length > 0) {
    await offlineDb.reports.bulkPut(reportsToSave);
  }
}

/**
 * Get all reports for a user from IndexedDB
 */
export async function getReportsFromIndexedDB(userId?: string): Promise<Analysis[]> {
  try {
    if (userId) {
      const reports = await offlineDb.reports.where('userId').equals(userId).toArray();
      // Sort newest first
      return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const all = await offlineDb.reports.toArray();
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('[Care Saathi IndexedDB] Failed to read reports:', error);
    return [];
  }
}

/**
 * Get single report by ID from IndexedDB
 */
export async function getReportByIdFromIndexedDB(id: string): Promise<Analysis | undefined> {
  return await offlineDb.reports.get(id);
}

/**
 * Save follow-up note locally to IndexedDB and queue for server sync
 */
export async function saveLocalFollowUpNote(
  reportId: string,
  doctorNotes: string,
  followUpDate?: string
): Promise<Analysis | null> {
  const existing = await offlineDb.reports.get(reportId);
  if (!existing) return null;

  const updated: Analysis = {
    ...existing,
    doctorNotes,
    followUpDate: followUpDate || existing.followUpDate,
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending'
  };

  await offlineDb.reports.put(updated);

  // Enqueue sync item
  await offlineDb.syncQueue.add({
    action: 'update_notes',
    entityId: reportId,
    payload: { doctorNotes, followUpDate },
    timestamp: Date.now(),
    retryCount: 0,
    status: 'pending'
  });

  return updated;
}

/**
 * Delete report locally and queue deletion sync
 */
export async function deleteReportFromIndexedDB(reportId: string): Promise<void> {
  await offlineDb.reports.delete(reportId);
  await offlineDb.syncQueue.add({
    action: 'delete_report',
    entityId: reportId,
    payload: { id: reportId },
    timestamp: Date.now(),
    retryCount: 0,
    status: 'pending'
  });
}

/**
 * Get healthcare facilities from IndexedDB
 */
export async function getHealthcareFacilitiesFromIndexedDB(): Promise<HealthcareFacility[]> {
  try {
    const list = await offlineDb.facilities.toArray();
    if (list.length > 0) return list;
    // Fallback to static data if table not populated yet
    return PUBLIC_HEALTHCARE_FACILITIES;
  } catch {
    return PUBLIC_HEALTHCARE_FACILITIES;
  }
}

/**
 * Sync Queue Helpers
 */
export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  return await offlineDb.syncQueue
    .where('status')
    .equals('pending')
    .sortBy('timestamp');
}

export async function removeSyncItem(id: number): Promise<void> {
  await offlineDb.syncQueue.delete(id);
}

export async function markSyncItemStatus(
  id: number,
  status: 'pending' | 'syncing' | 'failed',
  retryIncrement = 0
): Promise<void> {
  const item = await offlineDb.syncQueue.get(id);
  if (item) {
    await offlineDb.syncQueue.update(id, {
      status,
      retryCount: (item.retryCount || 0) + retryIncrement
    });
  }
}

export async function markReportSynced(reportId: string): Promise<void> {
  const report = await offlineDb.reports.get(reportId);
  if (report) {
    await offlineDb.reports.update(reportId, { syncStatus: 'synced' });
  }
}

/**
 * User Preferences & Offline Session in IndexedDB
 */
export async function saveUserPreference(key: string, value: any): Promise<void> {
  await offlineDb.userPreferences.put({
    key,
    value,
    updatedAt: Date.now()
  });
}

export async function getUserPreference<T = any>(key: string, defaultValue?: T): Promise<T | undefined> {
  const record = await offlineDb.userPreferences.get(key);
  if (record) return record.value;
  return defaultValue;
}
