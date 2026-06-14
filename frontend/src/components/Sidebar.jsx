import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { getKitabStats, formatPKR } from '../utils/storage';

export default function Sidebar({
  kitabList,
  kitabs,
  activeKitabId,
  onSelectKitab,
  onCreateNew,
  isMobileOpen,
  onCloseMobile,
  onLogout,
  user,
  onDeleteKitab,
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200
          bg-slate-300 transition-transform duration-300 lg:static lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Brand */}
        <div className="border-b border-ledger-800/30 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ledger-600/20 ring-1 ring-ledger-500/30">
              <span className="text-lg">📒</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-paper leading-tight truncate max-w-[160px]" title={user?.username || 'Khisab Kitab'}>
                {user?.username || 'Khisab Kitab'}
              </h1>
              <p className="text-[10px] tracking-widest text-ledger-600 uppercase">
                Machine Number Data
              </p>
            </div>
          </div>
          <p className="mt-2 font-urdu text-sm text-ledger-500" dir="rtl">
            حساب کتاب
          </p>
        </div>

        {/* New Kitab button */}
        <div className="p-4">
          <button
            id="new-kitab-btn"
            onClick={onCreateNew}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Kitab
          </button>
        </div>

        {/* Kitab list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest">
            Your Kitabs ({kitabList.length})
          </p>

          {kitabList.length === 0 ? (
            <div className="mt-8 text-center">
              <div className="text-3xl mb-2 opacity-30">📖</div>
              <p className="text-xs text-ledger-700">
                No kitabs yet. Create one to start tracking!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {kitabList.map(id => {
                const k = kitabs[id];
                if (!k) return null;
                const stats = getKitabStats(k);
                const isActive = activeKitabId === id;

                return (
                  <div
                    key={id}
                    id={`kitab-item-${id}`}
                    onClick={() => {
                      onSelectKitab(id);
                      onCloseMobile();
                    }}
                    className={`
                      w-full rounded-xl p-3 text-left transition-all duration-200 cursor-pointer
                      ${isActive
                        ? 'bg-ledger-800/40 ring-1 ring-ledger-600/30 shadow-lg shadow-ledger-900/30'
                        : 'hover:bg-ledger-900/30'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-ledger-300' : 'text-ledger-400'}`}>
                          Kitab #{k.number}
                        </p>
                        <p className="mt-0.5 text-[11px] text-ink-muted truncate">
                          {k.startDate} → {k.endDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {k.completed && (
                          <span className="shrink-0 text-xs text-ledger-500">✓</span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(id);
                          }}
                          className="ml-1 rounded p-1 text-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Kitab"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Mini progress */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-ledger-900/50">
                        <div
                          className="h-full rounded-full bg-ledger-600 transition-all"
                          style={{ width: `${stats.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-[10px] text-ledger-600">
                        ₨{formatPKR(stats.totalIncome)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User & Logout */}
        <div className="border-t border-ledger-800/30 p-4">
          {user && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ledger-700/40 ring-1 ring-ledger-600/30">
                <svg className="h-3.5 w-3.5 text-ledger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                </svg>
              </div>
              <p className="text-[11px] text-ledger-500 truncate flex-1" title={user.email}>
                {user.email}
              </p>
            </div>
          )}
          <button
            id="logout-btn"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-accent/30 px-3 py-2 text-xs font-medium text-red-accent/80 transition-all duration-200 hover:bg-red-accent/10 hover:text-red-accent cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Confirm Dialog for Sidebar Deletion */}
      {deleteConfirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this kitab? All income data for this period will be permanently lost."
          onConfirm={() => {
            onDeleteKitab(deleteConfirmId);
            setDeleteConfirmId(null);
          }}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </>
  );
}
