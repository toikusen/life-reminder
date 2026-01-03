
import React, { useMemo } from 'react';
import { ExpiryItem, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, Clock, CalendarCheck } from 'lucide-react';

interface DashboardProps {
  items: ExpiryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const urgent = items.filter(item => {
      const expiry = new Date(item.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 7 && diffDays >= 0;
    });

    const expired = items.filter(item => new Date(item.expiryDate) < now);

    const categoryData = Object.values(Category).map(cat => ({
      name: cat,
      value: items.filter(item => item.category === cat).length
    })).filter(d => d.value > 0);

    return { urgent, expired, categoryData };
  }, [items]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.urgent.length}</span>
          <span className="text-xs text-slate-500 font-medium">7天內到期</span>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-2">
            <Clock size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800">{stats.expired.length}</span>
          <span className="text-xs text-slate-500 font-medium">已過期</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <CalendarCheck size={18} />
          到期分類分佈
        </h3>
        <div className="h-48 w-full">
          {stats.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name as Category].split(' ')[1].replace('text-', '#').replace('-600', '')} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              尚無數據，請先新增項目
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {stats.categoryData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-[10px] text-slate-500">
              <div className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[entry.name as Category].split(' ')[0]}`} />
              {entry.name}: {entry.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
