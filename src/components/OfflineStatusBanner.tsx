import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Clock, AlertTriangle, Info } from 'lucide-react';
import { syncService, SyncState } from '../services/syncService';

interface OfflineStatusBannerProps {
  token?: string;
  onSyncComplete?: () => void;
}

export default function OfflineStatusBanner({ token, onSyncComplete }: OfflineStatusBannerProps) {
  const [syncState, setSyncState] = useState<SyncState>(syncService.getState());
  const [showArchInfo, setShowArchInfo] = useState(false);

  useEffect(() => {
    const unsubscribe = syncService.subscribe((newState) => {
      setSyncState(newState);
      if (newState.status === 'synced' && onSyncComplete) {
        onSyncComplete();
      }
    });
    return unsubscribe;
  }, [onSyncComplete]);

  const handleManualSync = async () => {
    await syncService.syncPendingData(token);
    if (onSyncComplete) onSyncComplete();
  };

  const toggleSimulatedOffline = () => {
    syncService.setSimulatedOffline(!syncState.simulatedOffline, token);
  };

  return (
    <>
      <div
        className={`w-full px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b flex flex-wrap items-center justify-between gap-2 z-40 ${
          !syncState.isOnline
            ? 'bg-amber-50 text-amber-900 border-amber-200'
            : syncState.status === 'syncing'
            ? 'bg-teal-50 text-teal-900 border-teal-200'
            : 'bg-emerald-50/80 text-emerald-900 border-emerald-100'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Online / Offline Indicator Badge */}
          {!syncState.isOnline ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 text-amber-950 border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              🟠 OFFLINE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              🟢 ONLINE
            </span>
          )}

          {/* Sync Status Badge */}
          {syncState.status === 'syncing' ? (
            <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ↻ Syncing
            </span>
          ) : syncState.pendingCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              ○ Pending sync ({syncState.pendingCount})
            </span>
          ) : syncState.isOnline ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ✓ Synced
            </span>
          ) : null}

          {/* Status Message */}
          <span className="text-gray-700 text-xs hidden sm:inline">
            {syncState.message}
          </span>
        </div>

        {/* Actions & Demo Controls */}
        <div className="flex items-center gap-2">
          {/* Architecture info button */}
          <button
            onClick={() => setShowArchInfo(!showArchInfo)}
            className="text-gray-500 hover:text-gray-800 p-1 rounded hover:bg-black/5"
            title="Care Saathi Offline Architecture"
            aria-label="Offline Architecture Info"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Manual Sync Button if online and pending */}
          {syncState.isOnline && syncState.pendingCount > 0 && (
            <button
              onClick={handleManualSync}
              disabled={syncState.status === 'syncing'}
              className="px-2.5 py-1 text-xs font-medium bg-teal-600 text-white rounded hover:bg-teal-700 transition flex items-center gap-1 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${syncState.status === 'syncing' ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          )}

          {/* Smart India Hackathon Demo Simulation Toggle */}
          <button
            onClick={toggleSimulatedOffline}
            className={`px-2.5 py-1 text-xs font-semibold rounded border transition flex items-center gap-1 ${
              syncState.simulatedOffline
                ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 shadow-xs'
            }`}
            title="Toggle simulated offline mode for presentation demo"
          >
            {syncState.simulatedOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                Simulating Offline (Click to Reconnect)
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-teal-600" />
                Simulate Offline Demo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal / Card for Offline Architecture Disclosure */}
      {showArchInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-teal-100">
            <div className="flex items-center gap-2 mb-3 text-teal-900 font-bold text-base">
              <Info className="w-5 h-5 text-teal-600" />
              <h3>Care Saathi Offline-First Architecture</h3>
            </div>
            <blockquote className="p-3 bg-teal-50 border-l-4 border-teal-600 text-teal-950 text-xs md:text-sm rounded mb-4 leading-relaxed">
              &ldquo;Care Saathi uses an offline-first architecture. Essential saved health information and selected local processing remain available during connectivity gaps, while advanced cloud AI capabilities synchronize when connectivity is restored.&rdquo;
            </blockquote>
            <div className="space-y-2 text-xs text-gray-600 mb-5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>IndexedDB & Dexie.js:</strong> Saved reports, structured results, follow-up notes, and public healthcare facilities are preserved permanently on device.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Service Worker & Cache Storage:</strong> Caches application shell, scripts, styles, and static assets for instant load with zero network.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Offline Report Support Engine:</strong> Rule-based reference-range analysis and Tesseract.js client OCR without diagnosing or prescribing medicines.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Sync Queue:</strong> Offline changes are safely queued with timestamps and synchronized automatically once network reconnects.</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowArchInfo(false)}
                className="px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
