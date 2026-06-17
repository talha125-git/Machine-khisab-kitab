import { useState, useCallback } from 'react';
import DayRow from './DayRow';
import SummaryPanel from './SummaryPanel';
import ConfirmDialog from './ConfirmDialog';
import { saveKitab, deleteKitab, getKitabStats } from '../utils/storage';
import { generateKitabPDF } from '../utils/pdfGenerator';

export default function KitabView({ kitab: initialKitab, onDeleted, onUpdated }) {
  const [kitab, setKitab] = useState(initialKitab);
  const [showConfirm, setShowConfirm] = useState(false);
  const [manualVisibleCount, setManualVisibleCount] = useState(0);

  // Sync when prop changes (switching kitabs)
  if (initialKitab.id !== kitab.id) {
    setKitab(initialKitab);
    setManualVisibleCount(0);
  }

  const isReadOnly = kitab.completed;
  // const isReadOnly = false;

  let lastSaved = 0;
  kitab.days.forEach((d, i) => { if (d.saved) lastSaved = i + 1; });
  const visibleCount = Math.min(15, Math.max(lastSaved, manualVisibleCount));

  const handleSaveDay = useCallback(async (dayIndex, data) => {
    // If clearing data (saved: false), keep the empty row visible
    if (data.saved === false) {
      setManualVisibleCount(prev => Math.max(prev, dayIndex + 1));
    }

    // Optimistic update locally first
    let updatedKitab;
    setKitab(prev => {
      const updated = { ...prev };
      updated.days = [...prev.days];
      updated.days[dayIndex] = { ...prev.days[dayIndex], ...data };

      // Check if all 15 days are completed
      const stats = getKitabStats(updated);
      updated.completed = (stats.daysCompleted === 15);

      updatedKitab = updated;
      if (onUpdated) onUpdated(updated);
      return updated;
    });

    // Save to backend
    if (updatedKitab) {
      await saveKitab(updatedKitab);
    }
  }, [onUpdated]);

  const handleReset = async () => {
    setShowConfirm(false);

    let updatedKitab;
    setKitab(prev => {
      const updated = { ...prev };
      updated.days = prev.days.map(d => ({
        ...d,
        income: '',
        notes: '',
        saved: false
      }));
      updated.completed = false;

      updatedKitab = updated;
      if (onUpdated) onUpdated(updated);
      return updated;
    });

    if (updatedKitab) {
      await saveKitab(updatedKitab);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Kitab Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-paper sm:text-2xl">
            📖 Kitab #{kitab.number}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            From <span className="text-paper text-lg font-bold">{new Date(kitab.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span> to <span className="text-paper text-lg font-bold">{new Date(kitab.endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => generateKitabPDF(kitab)}
            className="no-print shrink-0 self-start rounded-lg border border-ledger-500/30 bg-ledger-800/40 px-4 py-2 text-xs font-medium text-ledger-300 transition-all hover:bg-ledger-700/50 hover:text-ledger-200 cursor-pointer flex items-center gap-1.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>

          {!isReadOnly && (
            <button
              id="delete-kitab-btn"
              onClick={() => setShowConfirm(true)}
              className="no-print shrink-0 self-start rounded-lg border border-red-accent/30 bg-red-accent/10 px-4 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-accent/20 hover:text-red-300 cursor-pointer flex items-center gap-1.5"
            >
              🗑️ Clear / Reset
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <SummaryPanel kitab={kitab} />

      {/* Action Buttons */}
      {!isReadOnly && (
        <div className="mb-6 flex flex-wrap items-center gap-3 justify-start">
          {visibleCount < 15 && (
            <button
              onClick={() => {
                const nextCount = visibleCount + 1;
                setManualVisibleCount(nextCount);
                setTimeout(() => {
                  const el = document.getElementById(`day-row-${kitab.days[nextCount - 1].dayNumber}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}
              className="flex items-center gap-2 rounded-xl bg-ledger-800/40 px-6 py-3 text-sm font-medium text-ledger-300 ring-1 ring-ledger-600/30 transition-all hover:bg-ledger-700/40 hover:text-ledger-200 cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Today Enter
            </button>
          )}

          {visibleCount > lastSaved && (
            <button
              onClick={() => setManualVisibleCount(0)}
              className="flex items-center gap-2 rounded-xl border border-red-900/30 bg-transparent px-6 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-900/30 hover:text-red-400 cursor-pointer"
            >
              🗑️ Delete Empty Days
            </button>
          )}
        </div>
      )}

      {/* Day Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {kitab.days.slice(0, visibleCount).map((day, idx) => (
          <DayRow
            key={day.dayNumber}
            day={day}
            index={idx}
            readOnly={isReadOnly}
            onSave={handleSaveDay}
          />
        ))}
      </div>

      {/* Completed message */}
      {kitab.completed && (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="font-display text-xl font-bold text-ledger-300">
            Kitab Completed!
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            All 15 days have been recorded. This kitab is now read-only.
          </p>
          <p className="mt-3 font-display text-2xl font-bold text-gold">
            ₨ {new Intl.NumberFormat('en-PK').format(getKitabStats(kitab).totalIncome)}
          </p>
          <p className="text-xs text-ledger-500">Total Earnings</p>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to clear this kitab? All recorded income data for this period will be reset to zero."
          onConfirm={handleReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
