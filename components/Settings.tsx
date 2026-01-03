
import React from 'react';
import { AppSettings, ExpiryItem } from '../types';
import { Bell, Download, Upload, Shield, Info, ChevronRight, Globe } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  items: ExpiryItem[];
  setItems: (items: ExpiryItem[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, items, setItems }) => {
  const exportData = () => {
    const dataStr = JSON.stringify({ items, settings }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'expiry-butler-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.items) {
          setItems(data.items);
          if (data.settings) setSettings(data.settings);
          alert('匯入成功！');
        }
      } catch (error) {
        alert('匯入失敗，請檢查檔案格式。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">通知設定</h3>
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Bell size={18} /></div>
              <span className="text-sm font-medium">每日提醒時間</span>
            </div>
            <input 
                type="time" 
                value={settings.defaultReminderTime} 
                onChange={e => setSettings({...settings, defaultReminderTime: e.target.value})}
                className="text-sm font-bold bg-slate-50 px-2 py-1 rounded-lg outline-none"
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Globe size={18} /></div>
              <span className="text-sm font-medium">幣別符號</span>
            </div>
            <select 
                value={settings.currency}
                onChange={e => setSettings({...settings, currency: e.target.value})}
                className="text-sm font-bold bg-slate-50 px-2 py-1 rounded-lg outline-none"
            >
                <option value="TWD">TWD ($)</option>
                <option value="USD">USD ($)</option>
                <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">資料管理</h3>
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <button onClick={exportData} className="w-full p-4 flex items-center justify-between border-b border-slate-50 active:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-xl"><Download size={18} /></div>
              <span className="text-sm font-medium">備份匯出 JSON</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
          <label className="w-full p-4 flex items-center justify-between active:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Upload size={18} /></div>
              <span className="text-sm font-medium">還原匯入 JSON</span>
              <input type="file" className="hidden" accept=".json" onChange={importData} />
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">關於</h3>
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl"><Shield size={18} /></div>
              <span className="text-sm font-medium">隱私政策</span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl"><Info size={18} /></div>
              <span className="text-sm font-medium">版本</span>
            </div>
            <span className="text-xs text-slate-400 font-bold tracking-widest">v1.0.0-MVP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
