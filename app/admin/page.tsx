'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, LayoutDashboard, Newspaper, BarChart3, LogOut, Edit2, Trash2, Plus } from 'lucide-react';

// Mock Data
const mockNews = [
  { id: 1, date: '2026.02.15', category: 'Fieldwork', title: '第1四半期 山梨・長野エリア先行偵察（ゆるキャン巡礼）の作戦要領を公開', href: '/logistics' },
  { id: 2, date: '2026.01.10', category: 'Asset', title: '新規機材（SERENA LUXION 2025）導入によるロジスティクス効率化の検証', href: '/units' },
  { id: 3, date: '2025.12.20', category: 'Corporate', title: '冬季休暇中の兵站（ロードサービス）維持体制について', href: '/services' },
];

const mockIR = [
  { id: 'mileage', title: '総インフラ踏破距離', value: 45000, unit: 'km+', description: '地球1周分に迫る、圧倒的な広域モビリティ実績。' },
  { id: 'softcream', title: '地域経済への直接投資', value: 120, unit: 'Units', description: '各拠点の道の駅におけるソフトクリーム消費を通じた、持続可能な地域貢献。' },
  { id: 'engagement', title: 'ステークホルダー・エンゲージメント', value: 92.5, unit: '%', description: 'すれ違うライダーからのヤエー（挨拶）返答率。強固なコミュニティ形成の証。' },
  { id: 'investment', title: '戦略的アセット投資', value: 8, unit: 'Sets', description: '路面との対話を止めないための、惜しみない機材更新。' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'ir'>('news');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-white/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider">MIENO CORP.</h1>
            <p className="text-gray-400 text-sm tracking-widest mt-2">SECURE LOGIN SYSTEM</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Identifier</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="admin@mieno-corp.jp"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-md hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold tracking-wider flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            DASHBOARD
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'news' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Newspaper className="w-5 h-5" />
            News Management
          </button>
          <button
            onClick={() => setActiveTab('ir')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'ir' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <BarChart3 className="w-5 h-5" />
            IR Management
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{activeTab === 'news' ? 'News Management' : 'IR Management'}</h2>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </header>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {activeTab === 'news' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {mockNews.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-gray-300">{item.date}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-white/20">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {mockIR.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-gray-500">{item.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="text-xl font-bold">{item.value.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{item.description}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
