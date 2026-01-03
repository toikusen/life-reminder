
import React, { useState, useRef, useEffect } from 'react';
import { ExpiryItem, Category, Cycle } from '../types';
import { X, Camera, Sparkles, Loader2, DollarSign, Calendar, RefreshCcw } from 'lucide-react';
import { analyzeImageForExpiry } from '../services/geminiService';

interface AddEditModalProps {
  item?: ExpiryItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ExpiryItem>) => void;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ item, isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.OTHERS);
  const [expiryDate, setExpiryDate] = useState('');
  const [reminderDays, setReminderDays] = useState(3);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [cycle, setCycle] = useState<Cycle>('MONTH');
  const [isAutoRenew, setIsAutoRenew] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setName(item.name);
        setCategory(item.category);
        setExpiryDate(item.expiryDate.split('T')[0]);
        setReminderDays(item.reminderDays);
        setAmount(item.amount);
        setCycle(item.cycle || 'MONTH');
        setIsAutoRenew(item.isAutoRenew ?? true);
        setPurchaseDate(item.purchaseDate?.split('T')[0] || '');
      } else {
        setName('');
        setCategory(Category.OTHERS);
        setExpiryDate('');
        setReminderDays(3);
        setAmount(undefined);
        setCycle('MONTH');
        setIsAutoRenew(true);
        setPurchaseDate('');
      }
    }
  }, [item, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const result = await analyzeImageForExpiry(reader.result as string);
        setName(result.name);
        setCategory(result.category);
        setExpiryDate(result.expiryDate);
      } catch (error) {
        alert("AI 分析失敗，請手動輸入。");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{item ? '編輯內容' : '新增提醒'}</h2>
          <button onClick={onClose} className="p-3 bg-slate-100 rounded-2xl text-slate-500 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {!item && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full py-5 px-6 border-2 border-dashed border-indigo-200 rounded-3xl flex items-center justify-center gap-3 text-indigo-600 font-bold bg-indigo-50/30 hover:bg-indigo-50 transition-all active:scale-[0.98]"
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" size={24} /> 辨識中...</> : <><Sparkles size={24} /> AI 拍照自動輸入</>}
            </button>
          )}
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">類別項目</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(Category).map(cat => (
                   <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-2xl text-[10px] font-bold border transition-all ${
                        category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'
                    }`}
                   >
                     {cat}
                   </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">名稱</label>
              <input 
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="輸入項目名稱..."
                className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
              />
            </div>

            {/* Template Specific: Subscription */}
            {category === Category.SUBSCRIPTION && (
               <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">金額</label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))}
                            placeholder="0"
                            className="w-full pl-10 pr-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold"
                        />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">週期</label>
                    <select 
                        value={cycle} onChange={e => setCycle(e.target.value as Cycle)}
                        className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold appearance-none"
                    >
                        <option value="MONTH">每月續費</option>
                        <option value="YEAR">每年續費</option>
                        <option value="ONCE">一次性</option>
                    </select>
                  </div>
               </div>
            )}

            {/* Template Specific: Warranty */}
            {category === Category.WARRANTY && (
                <div className="space-y-1 animate-fadeIn">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">購買日期</label>
                    <input 
                        type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)}
                        className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold"
                    />
                </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                {category === Category.SUBSCRIPTION ? '下次扣款日' : '到期日期'}
              </label>
              <input 
                type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold text-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">提前幾天提醒</label>
              <div className="flex gap-2">
                {[1, 3, 7, 14].map(days => (
                  <button
                    key={days}
                    onClick={() => setReminderDays(days)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${
                      reminderDays === days ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {days}天前
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => onSave({ name, category, expiryDate, reminderDays, amount, cycle, isAutoRenew, purchaseDate })}
            disabled={!name || !expiryDate}
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {item ? '儲存變更' : '確定新增'}
          </button>
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
};

export default AddEditModal;
