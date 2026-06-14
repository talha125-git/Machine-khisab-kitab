import { createPortal } from 'react-dom';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm animate-fade-in-up">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-2xl shadow-slate-300/50">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-4 ring-red-100/50">
              <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <h3 className="mb-2 text-center text-lg font-bold text-slate-800">
            Confirm Action
          </h3>
          <p className="mb-6 text-center text-sm text-slate-600">{message}</p>
          <div className="flex gap-3">
            <button
              id="confirm-dialog-cancel"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-dialog-confirm"
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-700 hover:shadow-red-500/30 cursor-pointer"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
