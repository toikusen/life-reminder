
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, ListTodo, PieChart, Settings as SettingsIcon } from 'lucide-react';
import { ExpiryItem, Category, AppSettings } from './types';
import Dashboard from './components/Dashboard';
import ExpiryItemCard from './components/ExpiryItemCard';
import AddEditModal from './components/AddEditModal';
import Summary from './components/Summary';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [items, setItems] = useState<ExpiryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    defaultReminderTime: '09:00',
    defaultReminderDays: 3,
    currency: 'TWD'
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'summary' | 'settings'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpiryItem | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // Persistence
  useEffect(() => {
    const savedItems = localStorage.getItem('expiry_butler_items');
    const savedSettings = localStorage.getItem('expiry_butler_settings');
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('expiry_butler_items', JSON.stringify(items));
    localStorage.setItem('expiry_butler_settings', JSON.stringify(settings));
  }, [items, settings]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      return selectedCategory === 'all' || item.category === selectedCategory;
    }).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [items, selectedCategory]);

  const handleSaveItem = (data: Partial<ExpiryItem>) => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...data } as ExpiryItem : i));
    } else {
      const newItem: ExpiryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name!,
        category: data.category!,
        expiryDate: data.expiryDate!,
        reminderDays: data.reminderDays!,
        amount: data.amount,
        cycle: data.cycle,
        purchaseDate: data.purchaseDate,
        createdAt: new Date().toISOString()
      };
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('確定刪除？')) setItems(items.filter(i => i.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard items={items} />;
      case 'summary': return <Summary items={items} />;
      case 'settings': return <Settings items={items} setItems={setItems} settings={settings} setSettings={setSettings} />;
      case 'list': return (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`px-5 py-2 rounded-2xl text-xs font-black transition-all ${
                    selectedCategory === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'
                  }`}
                >
                  全部
                </button>
                {Object.values(Category).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-2xl text-xs font-black flex-shrink-0 transition-all ${
                      selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>
            <div className="space-y-1">
                {filteredItems.map(item => (
                    <ExpiryItemCard key={item.id} item={item} onDelete={handleDeleteItem} onEdit={(i) => { setEditingItem(i); setIsModalOpen(true); }} />
                ))}
                {filteredItems.length === 0 && <div className="text-center py-20 text-slate-300 font-bold">空空如也</div>}
            </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen flex flex-col bg-[#F9FAFB]">
      <header className="px-8 py-6 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Expiry Butler</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            {activeTab === 'dashboard' ? '智慧管家' : activeTab === 'list' ? '提醒清單' : activeTab === 'summary' ? '財務彙總' : '系統設定'}
          </h1>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
            <LayoutDashboard size={20} />
        </div>
      </header>

      <main className="flex-grow px-6 pb-28">
        {renderContent()}
      </main>

      <button 
        onClick={() => { setEditingItem(undefined); setIsModalOpen(true); }}
        className="fixed bottom-24 right-8 w-16 h-16 bg-slate-900 text-white rounded-[24px] shadow-2xl flex items-center justify-center active:scale-90 transition-all z-40"
      >
        <Plus size={32} />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center py-4 px-8 safe-bottom z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        {[
            { id: 'dashboard', icon: LayoutDashboard, label: '概覽' },
            { id: 'list', icon: ListTodo, label: '清單' },
            { id: 'summary', icon: PieChart, label: '財務' },
            { id: 'settings', icon: SettingsIcon, label: '設定' }
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-slate-400 opacity-60'}`}
            >
                <tab.icon size={22} strokeWidth={activeTab === tab.id ? 3 : 2} />
                <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
        ))}
      </nav>

      <AddEditModal isOpen={isModalOpen} item={editingItem} onClose={() => { setIsModalOpen(false); setEditingItem(undefined); }} onSave={handleSaveItem} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        body { color: #1e293b; }
      `}</style>
    </div>
  );
};

export default App;
