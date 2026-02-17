'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, LayoutDashboard, Wrench, FileText, Package,
  CheckCircle2, AlertCircle, ChevronRight, Gauge,
  ClipboardList, Send, LogOut
} from 'lucide-react';
import EasterEggModal from '../../components/EasterEggModal';

// --- Types ---

type UserRole = 'CEO' | 'COO' | 'CMO' | 'CTO';

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleJa: string;
  unitName: string;
  image?: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

// --- Mock Data ---

const USERS: Record<string, UserProfile> = {
  'cto': {
    id: 'cto',
    name: '渡辺 直人',
    role: 'CTO',
    roleJa: '最高技術責任者',
    unitName: 'CBR400R / SERENA LUXION'
  },
  'ceo': {
    id: 'ceo',
    name: '三重野 匠',
    role: 'CEO',
    roleJa: '代表取締役',
    unitName: 'GB350'
  },
  'cmo': {
    id: 'cmo',
    name: '末森 知輝',
    role: 'CMO',
    roleJa: '最高マーケティング責任者',
    unitName: 'CBR600RR / Monkey125'
  },
  'coo': {
    id: 'coo',
    name: '坂井 龍之介',
    role: 'COO',
    roleJa: '最高執行責任者',
    unitName: 'YZF-R3'
  }
};

// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-full border border-gray-100 max-w-[90vw]"
    >
      <div className={`p-1 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </div>
      <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{message}</span>
    </motion.div>
  );
};

// --- Feature Forms ---

const AssetManagement = ({ user, showToast }: { user: UserProfile, showToast: (msg: string) => void }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      showToast('機体データを更新しました');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-1">機体ステータス更新</h3>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-6">Asset Status Update</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">対象機体 <span className="text-gray-400 font-normal ml-2">Target Unit</span></label>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium flex items-center gap-3">
              <Gauge className="text-gray-400" size={20} />
              {user.unitName}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">現在の走行距離 <span className="text-gray-400 font-normal ml-2">Odometer (km)</span></label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Example: 12500"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono text-lg"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">km</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">次回オイル交換 <span className="text-gray-400 font-normal ml-2">Next Oil Change</span></label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">カスタム・整備メモ <span className="text-gray-400 font-normal ml-2">Maintenance Note</span></label>
            <textarea
              rows={3}
              placeholder="タイヤ空気圧調整、チェーン清掃など"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={20} />
                <span>ステータスを更新</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const SubmitLog = ({ showToast }: { showToast: (msg: string) => void }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      showToast('作戦記録を送信しました');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-1">作戦記録の提出</h3>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-6">Submit Operation Log</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">作戦名 <span className="text-gray-400 font-normal ml-2">Operation Title</span></label>
            <input
              type="text"
              placeholder="例: 富士五湖周遊作戦"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">実施日 <span className="text-gray-400 font-normal ml-2">Date</span></label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">走行距離 <span className="text-gray-400 font-normal ml-2">Dist.</span></label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-right pr-12"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">km</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">詳細レポート <span className="text-gray-400 font-normal ml-2">Mission Report</span></label>
            <textarea
              rows={5}
              placeholder="天候、路面状況、特記事項など..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={20} />
                <span>記録を送信</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const InventoryRequest = ({ showToast }: { showToast: (msg: string) => void }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      showToast('申請を受け付けました');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-1">備品・資材の申請</h3>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-6">Inventory Request</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">品名・名称 <span className="text-gray-400 font-normal ml-2">Item Name</span></label>
            <input
              type="text"
              placeholder="例: エンジンオイル 10W-40"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">種別 <span className="text-gray-400 font-normal ml-2">Type</span></label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none">
                    <option>消耗品 (Consumable)</option>
                    <option>工具 (Tool)</option>
                    <option>その他 (Other)</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">必要数量 <span className="text-gray-400 font-normal ml-2">Qty</span></label>
              <input
                type="number"
                placeholder="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-right pr-4"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">申請理由 <span className="text-gray-400 font-normal ml-2">Reason</span></label>
            <textarea
              rows={3}
              placeholder="在庫減少のため補充、破損による交換など"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ClipboardList size={20} />
                <span>申請を送信</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'asset' | 'log' | 'inventory'>('asset');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Easter Egg State
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleTitleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    // Reset if more than 1 second has passed since the last click
    if (now - lastClickTime > 1000) {
      setClickCount(1);
    } else {
      setClickCount((prev) => prev + 1);
    }
    setLastClickTime(now);

    // Calculate current count including this click
    const currentCount = now - lastClickTime > 1000 ? 1 : clickCount + 1;

    if (currentCount >= 5) {
      e.preventDefault();
      setShowEasterEgg(true);
      setClickCount(0);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    // Accepts any password for demo, but checks ID for user role
    const user = USERS[loginId.toLowerCase()];
    if (user && loginPass.length > 0) {
        setCurrentUser(user);
        setIsAuthenticated(true);
    } else {
        // Fallback or error
        // For ease of use, if ID is unknown, default to CTO
        if (loginPass.length > 0) {
            setCurrentUser(USERS['cto']);
            setIsAuthenticated(true);
        }
    }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setLoginId('');
      setLoginPass('');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 text-gray-900 font-sans">
        <EasterEggModal isOpen={showEasterEgg} onClose={() => setShowEasterEgg(false)} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2rem] p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-gray-900 tracking-tight cursor-pointer select-none"
              onClick={handleTitleClick}
            >
              MIENO CORP.
            </h1>
            <p className="text-gray-400 text-xs font-bold tracking-[0.2em] mt-2 uppercase">Member Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
                <label className="ml-4 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-700">メンバーID</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MEMBER ID</span>
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium"
                        placeholder="ID (e.g. cto)"
                        autoCapitalize='none'
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="ml-4 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-700">パスコード</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PASSCODE</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
            >
              <span>システム認証</span>
              <span className="text-xs opacity-70 tracking-wider">AUTHENTICATE</span>
            </button>
          </form>

          <p className="text-center mt-8 font-medium text-gray-400">
             <span className="block text-sm font-bold text-gray-500">※関係者以外アクセス禁止</span>
             <span className="text-[10px] tracking-[0.2em] uppercase">Authorized Personnel Only</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pb-24 font-sans selection:bg-gray-200">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#F5F5F7]/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex justify-between items-center">
        <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">統合管理システム</h1>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest mt-1 uppercase">Member Dashboard</p>
        </div>
        <button onClick={handleLogout} className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
        </button>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 space-y-6">

        {/* Profile Card */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-white/50 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <LayoutDashboard size={120} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-400 text-2xl font-bold border-2 border-white shadow-sm">
                    {currentUser?.name.charAt(0)}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{currentUser?.name}</h2>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-green-200">
                            Verified
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{currentUser?.role} / {currentUser?.roleJa}</p>
                </div>
            </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-gray-200/50 rounded-2xl">
            {(['asset', 'log', 'inventory'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl text-xs font-bold transition-all relative ${
                        activeTab === tab ? 'text-gray-900 bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab === 'asset' && <Wrench className="w-5 h-5 mb-1" />}
                    {tab === 'log' && <FileText className="w-5 h-5 mb-1" />}
                    {tab === 'inventory' && <Package className="w-5 h-5 mb-1" />}

                    <span className="uppercase tracking-tight text-[10px]">
                        {tab === 'asset' && 'Asset'}
                        {tab === 'log' && 'Log'}
                        {tab === 'inventory' && 'Inventory'}
                    </span>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
            <AnimatePresence mode='wait'>
                {activeTab === 'asset' && currentUser && (
                    <AssetManagement key="asset" user={currentUser} showToast={showToast} />
                )}
                {activeTab === 'log' && (
                    <SubmitLog key="log" showToast={showToast} />
                )}
                {activeTab === 'inventory' && (
                    <InventoryRequest key="inventory" showToast={showToast} />
                )}
            </AnimatePresence>
        </div>

      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
