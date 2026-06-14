import { useState } from 'react';

export default function CreateKitabModal({ onClose, onCreated, kitabCount }) {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);

  const handleCreate = () => {
    if (!startDate) return;
    onCreated(startDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="rounded-2xl border border-ledger-700/30 bg-gradient-to-br from-[#1a2e1f] to-[#0f1a12] p-6 shadow-2xl shadow-ledger-900/50">
          {/* Header ornament */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-ledger-600/20 ring-2 ring-ledger-500/30">
              <svg className="h-8 w-8 text-ledger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-paper">
              نئی کتاب
            </h2>
            <p className="mt-1 text-sm text-ledger-400">
              Create New Kitab #{kitabCount + 1}
            </p>
          </div>

          {/* Date picker */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-ledger-300">
              Start Date
            </label>
            <input
              id="start-date-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-ledger-700/50 bg-ledger-950/50 px-4 py-3 text-paper transition-all duration-200 hover:border-ledger-500/50 focus:border-ledger-400"
            />
            {startDate && (
              <p className="mt-2 text-xs text-ink-muted">
                This kitab will cover{' '}
                <span className="text-ledger-400">
                  {new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
                {' '}to{' '}
                <span className="text-ledger-400">
                  {(() => {
                    const end = new Date(startDate + 'T00:00:00');
                    end.setDate(end.getDate() + 14);
                    return end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                  })()}
                </span>
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              id="cancel-create-btn"
              onClick={onClose}
              className="flex-1 rounded-lg border border-ledger-700/50 bg-transparent px-4 py-3 text-sm font-medium text-ledger-400 transition-all duration-200 hover:bg-ledger-800/30 hover:text-ledger-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-create-btn"
              onClick={handleCreate}
              className="flex-1 rounded-lg bg-gradient-to-r from-ledger-600 to-ledger-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ledger-900/50 transition-all duration-200 hover:from-ledger-500 hover:to-ledger-600 hover:shadow-ledger-800/50 cursor-pointer"
            >
              ✦ Create Kitab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
