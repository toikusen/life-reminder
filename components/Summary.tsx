
import React from 'react';
import { ExpiryItem, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../constants';
import { Wallet, Calendar, TrendingUp } from 'lucide-react';

interface SummaryProps {
  items: ExpiryItem[];
}

const Summary: React.FC<SummaryProps> = ({ items }) => {
  const now = new Date();
  
  const monthlyCost = items
    .filter(i => i.category === Category.SUBSCRIPTION && i.amount)
    .reduce((acc, i) => {
      if (i.cycle === 'YEAR') return acc + (i.amount! / 12);
      if (i.cycle === 'MONTH') return acc + i.amount!;
      return acc;
    }, 0);

  const upcomingCounts = {
    today: items.filter(i => {
        const d = new Date(i.expiryDate);
        return d.toDateString() === now.toDateString();
    }).length,
    week: items.filter(i => {
        const diff = (new Date(i.expiryDate).getTime() - now.getTime()) / (86400000);
        return diff > 0 && diff <= 7;
    }).length,
    month: items.filter(i => {
        const diff = (new Date(i.expiryDate).getTime() - now.getTime()) / (86400000);
        return diff > 0 && diff <= 30;
    }).length
  };

  const categorySpending = Object.values(Category).map(cat => ({
    name: cat,
    value: items.filter(i => i.category === cat).length
  })).filter(v => v.value > 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[32px] text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">預估每月支出</p>
            <h2 className="text-3xl font-black mt-1">$ {monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Wallet size={24} />
          </div>
        </div>
        <div className="flex gap-4 pt-4 border-t border-white/10">
          <div className="flex-1">
            <p className="text-[10px] text-indigo-200 uppercase">訂閱項目</p>
            <p className="font-bold">{items.filter(i => i.category === Category.SUBSCRIPTION).length} 筆</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-indigo-200 uppercase">總提醒</p>
            <p className="font-bold">{items.length} 筆</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" /> 近期提醒概覽
            </h3>
            <div className="space-y-3">
                {[
                    { label: '今天到期', value: upcomingCounts.today, color: 'bg-rose-500' },
                    { label: '本週到期', value: upcomingCounts.week, color: 'bg-amber-500' },
                    { label: '30天內到期', value: upcomingCounts.month, color: 'bg-indigo-500' }
                ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{row.label}</span>
                        <div className="flex items-center gap-3 flex-grow mx-4">
                            <div className="h-1.5 bg-slate-100 rounded-full flex-grow overflow-hidden">
                                <div 
                                    className={`h-full ${row.color}`} 
                                    style={{ width: `${Math.min(100, (row.value / (items.length || 1)) * 100)}%` }} 
                                />
                            </div>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{row.value}</span>
                    </div>
                ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-64">
            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500" /> 分類佔比
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySpending.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name as Category].split(' ')[1].replace('text-', '#').replace('-600', '')} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default Summary;
