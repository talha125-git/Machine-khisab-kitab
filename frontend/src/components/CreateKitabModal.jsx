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
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-2xl shadow-slate-300/50">
          {/* Header ornament */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 ring-4 ring-blue-50">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              نئی کتاب
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create New Kitab #{kitabCount + 1}
            </p>
          </div>

          {/* Date picker */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Date
            </label>
            <input
              id="start-date-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
            {startDate && (
              <p className="mt-2 text-xs text-slate-500">
                This kitab will cover{' '}
                <span className="font-medium text-blue-600">
                  {new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
                {' '}to{' '}
                <span className="font-medium text-blue-600">
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
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-create-btn"
              onClick={handleCreate}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/30 cursor-pointer"
            >
              ✦ Create Kitab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
