import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import KitabView from './components/KitabView';
import CreateKitabModal from './components/CreateKitabModal';
import AuthPage from './components/AuthPage';
import { getKitabList, getKitab, createKitab, deleteKitab } from './utils/storage';

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [kitabList, setKitabList] = useState([]);
  const [kitabs, setKitabs] = useState({});
  const [activeKitabId, setActiveKitabId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('khisab_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {}
    setAuthChecked(true);
  }, []);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('khisab_user', JSON.stringify(userData));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('khisab_user');
  }, []);

  // Load data from backend on mount
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    
    const loadKitabs = async () => {
      const kitabsArray = await getKitabList();
      if (!isMounted) return;
      
      const loadedKitabs = {};
      const loadedIds = [];
      
      kitabsArray.forEach(k => {
        loadedKitabs[k.id] = k;
        loadedIds.push(k.id);
      });
      
      setKitabs(loadedKitabs);
      setKitabList(loadedIds);
      
      if (loadedIds.length > 0 && !activeKitabId) {
        setActiveKitabId(loadedIds[0]);
      }
    };
    
    loadKitabs();
    
    return () => { isMounted = false; };
  }, [user, activeKitabId]);

  const handleCreateKitab = useCallback(async (startDate) => {
    const newKitab = await createKitab(startDate, kitabList.length);
    if (!newKitab) return; // Error creating
    
    setKitabs(prev => ({ [newKitab.id]: newKitab, ...prev }));
    setKitabList(prev => [newKitab.id, ...prev]);
    setActiveKitabId(newKitab.id);
    setShowCreateModal(false);
  }, [kitabList.length]);

  const handleDeleteKitab = useCallback(async (id) => {
    const success = await deleteKitab(id);
    if (!success) return;
    
    setKitabs(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setKitabList(prev => {
      const next = prev.filter(kid => kid !== id);
      // Switch to another kitab if available
      if (next.length > 0) {
        setActiveKitabId(next[0]);
      } else {
        setActiveKitabId(null);
      }
      return next;
    });
  }, []);

  const handleKitabUpdated = useCallback((updatedKitab) => {
    setKitabs(prev => ({ ...prev, [updatedKitab.id]: updatedKitab }));
  }, []);

  // Show auth page if not logged in (after all hooks)
  if (!authChecked) return null;
  if (!user) return <AuthPage onLogin={handleLogin} />;

  const activeKitab = activeKitabId ? kitabs[activeKitabId] : null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        kitabList={kitabList}
        kitabs={kitabs}
        activeKitabId={activeKitabId}
        onSelectKitab={setActiveKitabId}
        onCreateNew={() => setShowCreateModal(true)}
        isMobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
        onDeleteKitab={handleDeleteKitab}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-ledger-800/30 bg-ledger-950/95 px-4 py-3 backdrop-blur-md lg:hidden no-print">
          <button
            id="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-ledger-700/30 p-2 text-ledger-400 transition-colors hover:bg-ledger-800/30 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div>
            <h1 className="font-display text-sm font-bold text-paper truncate max-w-[150px]">
              {user?.username || 'Khisab Kitab'}
            </h1>
            <p className="text-[10px] text-ledger-600">Machine Number Data</p>
          </div>
        </div>

        {/* Content area */}
        <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
          {activeKitab ? (
            <KitabView
              key={activeKitab.id}
              kitab={activeKitab}
              onDeleted={handleDeleteKitab}
              onUpdated={handleKitabUpdated}
            />
          ) : (
            /* Empty state */
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="paper-texture mb-6 flex h-28 w-28 items-center justify-center rounded-3xl border border-ledger-700/20 bg-ledger-900/20 shadow-2xl shadow-ledger-950/50">
                <span className="text-5xl">📒</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-paper">
                Khisab Kitab
              </h2>
              <p className="font-urdu mt-1 text-lg text-ledger-500" dir="rtl">
                حساب کتاب – مشین نمبر ڈیٹا
              </p>
              <p className="mt-4 max-w-md text-sm text-ink-muted">
                Track your 15-day income cycles with a traditional ledger-style interface. 
                Create your first kitab to get started.
              </p>
              <button
                id="empty-state-create-btn"
                onClick={() => setShowCreateModal(true)}
                className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-ledger-600 to-ledger-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ledger-900/50 transition-all duration-200 hover:from-ledger-500 hover:to-ledger-600 hover:shadow-ledger-800/50 active:scale-95 cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create First Kitab
              </button>

              {/* Decorative elements */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center opacity-40">
                <div>
                  <div className="text-2xl mb-1">📅</div>
                  <p className="text-[10px] text-ledger-600">15-Day Cycles</p>
                </div>
                <div>
                  <div className="text-2xl mb-1">💰</div>
                  <p className="text-[10px] text-ledger-600">Track Income</p>
                </div>
                <div>
                  <div className="text-2xl mb-1">📊</div>
                  <p className="text-[10px] text-ledger-600">View Reports</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateKitabModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreateKitab}
          kitabCount={kitabList.length}
        />
      )}
    </div>
  );
}
