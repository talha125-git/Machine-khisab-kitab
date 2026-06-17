import { useState } from 'react';
import { formatDate, getDayName } from '../utils/storage';

export default function DayRow({ day, index, readOnly, onSave }) {
  const [income, setIncome] = useState(day.income);
  const [notes, setNotes] = useState(day.notes);
  const [isEditing, setIsEditing] = useState(!day.saved);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    onSave(index, { income, notes, saved: true });
    setIsEditing(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDeleteData = () => {
    setIncome('');
    setNotes('');
    setIsEditing(true);
    onSave(index, { income: '', notes: '', saved: false });
  };

  const dayName = getDayName(day.date);
  const dateDisplay = formatDate(day.date);
  const isFriday = dayName === 'Friday';

  return (
    <div
      id={`day-row-${day.dayNumber}`}
      className="stagger-row ledger-row group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`
          rounded-xl border p-3 transition-all duration-300 sm:p-4
          ${day.saved
            ? 'border-ledger-700/20 bg-ledger-950/30 hover:bg-ledger-950/50'
            : 'border-ledger-700/30 bg-ledger-900/20 hover:bg-ledger-900/30'
          }
          ${justSaved ? 'ring-2 ring-ledger-400/40' : ''}
          ${isFriday ? 'border-l-2 border-l-gold/50' : ''}
        `}
      >
        {/* Top row: Day info */}
        <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Day number badge */}
          <div className={`
            flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold
            ${day.saved
              ? 'bg-ledger-600/20 text-ledger-400 ring-1 ring-ledger-500/30'
              : 'bg-ledger-800/30 text-ledger-600 ring-1 ring-ledger-700/30'
            }
          `}>
            {day.dayNumber}
          </div>

          {/* Date and day name */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-paper truncate">
              {dateDisplay}
            </p>
            <p className={`text-xs ${isFriday ? 'font-semibold text-gold' : 'text-ink-muted'}`}>
              {dayName}
              {isFriday && ' 🌙'}
            </p>
          </div>

          {/* Income display (when saved and not editing) */}
          {day.saved && !isEditing && (
            <div className="text-right">
              <p className="font-display text-lg font-bold text-ledger-300">
                ₨ {new Intl.NumberFormat('en-PK').format(day.income || 0)}
              </p>
            </div>
          )}
        </div>

        {/* Input fields or read-only display */}
        {isEditing && !readOnly ? (
          <div className="flex flex-col gap-3">
            {/* Income input */}
            <div className="flex-1">
              <label className="mb-1 block text-xs text-ledger-500">
                Income (PKR ₨)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ledger-500">₨</span>
                <input
                  id={`income-input-${day.dayNumber}`}
                  type="number"
                  min="0"
                  step="1"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-ledger-700/40 bg-ledger-950/50 py-2.5 pl-8 pr-3 text-paper placeholder-ledger-700 transition-all"
                />
              </div>
            </div>

            {/* Notes input */}
            <div className="flex-1">
              <label className="mb-1 block text-xs text-ledger-500">
                Notes (optional)
              </label>
              <input
                id={`notes-input-${day.dayNumber}`}
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Machine  earnings"
                maxLength={100}
                className="w-full rounded-lg border border-ledger-700/40 bg-ledger-950/50 px-3 py-2.5 text-paper placeholder-ledger-700 transition-all"
              />
            </div>

            {/* Save button */}
            <button
              id={`save-btn-${day.dayNumber}`}
              onClick={handleSave}
              className="mt-1 w-full shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.98] cursor-pointer"
            >
              {day.saved ? '✓ Update' : '✓ Save'}
            </button>
          </div>
        ) : readOnly ? (
          // Read-only view
          day.notes && (
            <p className="mt-1 text-xs text-ink-muted italic pl-14">
              📝 {day.notes}
            </p>
          )
        ) : (
          // Saved view with edit button
          <div className="flex items-center justify-between pl-14">
            <div className="flex-1">
              {day.notes && (
                <p className="text-xs text-ink-muted italic">
                  📝 {day.notes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 opacity-70 transition-all duration-200">
              <button
                onClick={handleDeleteData}
                className="rounded-lg border border-red-900/30 bg-transparent px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-900/30 hover:text-red-400 cursor-pointer"
                title="Clear Data"
              >
                🗑️Empty
              </button>
              <button
                id={`edit-btn-${day.dayNumber}`}
                onClick={handleEdit}
                className="rounded-lg border border-ledger-700/30 bg-transparent px-3 py-1.5 text-xs font-medium text-ledger-500 hover:bg-green-300 hover:text-ledger-400 cursor-pointer"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
