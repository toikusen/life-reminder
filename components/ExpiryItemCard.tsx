
import React from 'react';
import { ExpiryItem } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import { Trash2, Edit3, ChevronRight } from 'lucide-react';

interface ExpiryItemCardProps {
  item: ExpiryItem;
  onDelete: (id: string) => void;
  onEdit: (item: ExpiryItem) => void;
}

const ExpiryItemCard: React.FC<ExpiryItemCardProps> = ({ item, onDelete, onEdit }) => {
  const expiry = new Date(item.expiryDate);
  const now = new Date();
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  let statusColor = 'text-slate-500';
  let statusBg = 'bg-slate-100';
  let statusText = `剩餘 ${diffDays} 天`;

  if (diffDays < 0) {
    statusColor = 'text-rose-600';
    statusBg = 'bg-rose-50';
    statusText = '已過期';
  } else if (diffDays <= 7) {
    statusColor = 'text-amber-600';
    statusBg = 'bg-amber-50';
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-3 flex items-center gap-4 active:scale-[0.98] transition-all">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[item.category]}`}>
        {CATEGORY_ICONS[item.category]}
      </div>
      
      <div className="flex-grow min-w-0">
        <h4 className="font-semibold text-slate-800 truncate text-sm">{item.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBg} ${statusColor}`}>
            {statusText}
          </span>
          <span className="text-[10px] text-slate-400">
            {expiry.toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(item)}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <Edit3 size={18} />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ExpiryItemCard;
