/**
 * Care Saathi Offline Synchronization Service
 * Manages background queue, conflict-safe synchronization, and online/offline transitions.
 */

import {
  getPendingSyncItems,
  removeSyncItem,
  markSyncItemStatus,
  markReportSynced,
  offlineDb,
  cacheReportsToIndexedDB,
  getReportByIdFromIndexedDB
} from '../db/offlineDb';
import { Analysis } from '../types';

export type SyncStateStatus = 'online' | 'offline' | 'syncing' | 'synced' | 'error';

export interface SyncState {
  isOnline: boolean;
  status: SyncStateStatus;
  message: string;
  pendingCount: number;
  lastSyncedAt: Date | null;
  simulatedOffline: boolean;
}

type SyncStateListener = (state: SyncState) => void;

class SyncService {
  private listeners: Set<SyncStateListener> = new Set();
  private simulatedOffline = false;
  private isSyncing = false;
  private state: SyncState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    status: typeof navigator !== 'undefined' && navigator.onLine ? 'synced' : 'offline',
    message: typeof navigator !== 'undefined' && navigator.onLine
      ? "You're online. Your information is synced."
      : "You're offline. Saved health information remains available.",
    pendingCount: 0,
    lastSyncedAt: null,
    simulatedOffline: false
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
      this.updatePendingCount();
    }
  }

  public subscribe(listener: SyncStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[SyncService] Listener error:', err);
      }
    });
  }

  public getState(): SyncState {
    return { ...this.state };
  }

  public isEffectivelyOnline(): boolean {
    if (this.simulatedOffline) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public setSimulatedOffline(simulate: boolean, token?: string) {
    this.simulatedOffline = simulate;
    this.state.simulatedOffline = simulate;

    if (simulate) {
      this.state.isOnline = false;
      this.state.status = 'offline';
      this.state.message = "You're offline. Saved health information remains available.";
      this.notify();
    } else {
      const realOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      this.state.isOnline = realOnline;
      if (realOnline) {
        this.handleNetworkChange(true, token);
      } else {
        this.state.status = 'offline';
        this.state.message = "You're offline. Saved health information remains available.";
        this.notify();
      }
    }
  }

  private async updatePendingCount(): Promise<number> {
    try {
      const items = await getPendingSyncItems();
      this.state.pendingCount = items.length;
      return items.length;
    } catch {
      return 0;
    }
  }

  private async handleNetworkChange(online: boolean, token?: string) {
    if (this.simulatedOffline) return;

    this.state.isOnline = online;

    if (!online) {
      this.state.status = 'offline';
      this.state.message = "You're offline. Saved health information remains available.";
      await this.updatePendingCount();
      this.notify();
    } else {
      // Transition from offline to online
      this.state.status = 'syncing';
      this.state.message = 'Connection restored. Syncing your saved information…';
      this.notify();

      // Trigger automatic sync
      await this.syncPendingData(token);
    }
  }

  /**
   * Sync all pending items from IndexedDB sync queue to server
   */
  public async syncPendingData(authToken?: string): Promise<{ success: boolean; syncedCount: number }> {
    if (this.isSyncing) return { success: false, syncedCount: 0 };
    if (!this.isEffectivelyOnline()) {
      this.state.status = 'offline';
      this.state.message = "You're offline. Saved health information remains available.";
      this.notify();
      return { success: false, syncedCount: 0 };
    }

    const token = authToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('care_saathi_token') || localStorage.getItem('clarimed_token') : null);
    if (!token) {
      await this.updatePendingCount();
      this.state.status = 'synced';
      this.state.message = "You're online. Your information is synced.";
      this.notify();
      return { success: true, syncedCount: 0 };
    }

    this.isSyncing = true;
    this.state.status = 'syncing';
    this.state.message = 'Syncing your saved information…';
    this.notify();

    let syncedCount = 0;

    try {
      const pendingItems = await getPendingSyncItems();

      for (const item of pendingItems) {
        if (!item.id) continue;

        try {
          await markSyncItemStatus(item.id, 'syncing');

          // Action 1: Upload offline-created report
          if (item.action === 'create_report') {
            const report = await getReportByIdFromIndexedDB(item.entityId);
            if (report) {
              const res = await fetch('/api/sync/report', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ report })
              });

              if (res.ok) {
                await markReportSynced(item.entityId);
                await removeSyncItem(item.id);
                syncedCount++;
              } else {
                await markSyncItemStatus(item.id, 'pending', 1);
              }
            } else {
              await removeSyncItem(item.id);
            }
          }
          // Action 2: Update doctor follow-up notes
          else if (item.action === 'update_notes') {
            const res = await fetch(`/api/analysis/${item.entityId}/notes`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(item.payload)
            });

            if (res.ok) {
              await markReportSynced(item.entityId);
              await removeSyncItem(item.id);
              syncedCount++;
            } else {
              await markSyncItemStatus(item.id, 'pending', 1);
            }
          }
          // Action 3: Delete report
          else if (item.action === 'delete_report') {
            const res = await fetch(`/api/analysis/${item.entityId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (res.ok || res.status === 404) {
              await removeSyncItem(item.id);
              syncedCount++;
            } else {
              await markSyncItemStatus(item.id, 'pending', 1);
            }
          }
        } catch (itemErr) {
          console.warn('[SyncService] Item sync error:', itemErr);
          if (item.id) {
            await markSyncItemStatus(item.id, 'pending', 1);
          }
        }
      }

      // Fetch latest cloud state and merge into local IndexedDB conflict-safely
      try {
        const historyRes = await fetch('/api/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          if (historyData.history && Array.isArray(historyData.history)) {
            await cacheReportsToIndexedDB(historyData.history);
          }
        }
      } catch (historyErr) {
        console.warn('[SyncService] History revalidation error:', historyErr);
      }

      await this.updatePendingCount();
      this.state.lastSyncedAt = new Date();
      this.state.status = 'synced';
      this.state.message = 'Sync complete. All health information is up to date.';
      this.notify();

      // After 3 seconds, reset message to clean online status
      setTimeout(() => {
        if (this.state.status === 'synced') {
          this.state.message = "You're online. Your information is synced.";
          this.notify();
        }
      }, 3500);

      return { success: true, syncedCount };
    } catch (err) {
      console.error('[SyncService] Global sync failure:', err);
      this.state.status = 'error';
      this.state.message = 'Sync error. Will retry when connection stabilizes.';
      this.notify();
      return { success: false, syncedCount };
    } finally {
      this.isSyncing = false;
    }
  }
}

export const syncService = new SyncService();
