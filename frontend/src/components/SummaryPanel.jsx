import { useState } from 'react';
import { getKitabStats, formatPKR } from '../utils/storage';

export default function SummaryPanel({ kitab }) {
  const stats = getKitabStats(kitab);
  const [showAmounts, setShowAmounts] = useState(false);

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-200 p-5 shadow-xl glow-card">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ledger-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          Summary
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAmounts(!showAmounts)}
            className="text-ledger-500 hover:text-ledger-300 transition-colors cursor-pointer"
            title={showAmounts ? "Hide Amounts" : "Show Amounts"}
          >
            {showAmounts ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </button>
          {kitab.completed && (
            <span className="rounded-full bg-ledger-600/20 px-3 py-1 text-xs font-semibold text-ledger-400 ring-1 ring-ledger-500/30">
              Completed ✓
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Income */}
        <div className="rounded-xl border border-ledger-700/20 bg-yellow-200 p-3 text-center">
          <p className="text-xs text-ledger-500">Total Income</p>
          <p className="mt-1 font-display text-xl font-bold text-ledger-300">
            {showAmounts ? `₨ ${formatPKR(stats.totalIncome)}` : '••••••'}
          </p>
        </div>

        {/* Average Daily */}
        <div className="rounded-xl border border-ledger-700/20 bg-green-400 p-3 text-center">
          <p className="text-xs text-ledger-500">Avg / Day</p>
          <p className="mt-1 font-display text-xl font-bold text-black">
            {showAmounts ? `₨ ${formatPKR(Math.round(stats.avgIncome))}` : '••••••'}
          </p>
        </div>

        {/* Days Filled */}
        <div className="rounded-xl border border-ledger-700/20 bg-red-300 p-3 text-center">
          <p className="text-xs text-ledger-500">Days Filled</p>
          <p className="mt-1 font-display text-xl font-bold text-red-700">
            {stats.daysCompleted} <span className="text-sm text-black">/ 15</span>
          </p>
        </div>

        {/* Days Remaining */}
        <div className="rounded-xl border border-ledger-700/20 bg-blue-300 p-3 text-center">
          <p className="text-xs text-ledger-500">Remaining</p>
          <p className="mt-1 font-display text-xl font-bold text-black">
            {stats.daysRemaining}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-ledger-500">Progress</span>
          <span className="font-semibold text-ledger-400">{Math.round(stats.progress)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-ledger-900/50 ring-1 ring-ledger-700/20">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              stats.progress >= 100
                ? "bg-green-500"
                : "bg-blue-600"
            }`}
            style={{ width: `${stats.progress}%` }}
          >
            <div className="h-full w-full animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
