
import React from 'react';
import { 
  CreditCard, 
  Apple, 
  FileText, 
  ShieldCheck, 
  Pill, 
  Home, 
  Layers,
  Wrench
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.SUBSCRIPTION]: <CreditCard size={20} />,
  [Category.FOOD]: <Apple size={20} />,
  [Category.DOCUMENT]: <FileText size={20} />,
  [Category.INSURANCE]: <ShieldCheck size={20} />,
  [Category.WARRANTY]: <Wrench size={20} />,
  [Category.MEDICINE]: <Pill size={20} />,
  [Category.HOME]: <Home size={20} />,
  [Category.OTHERS]: <Layers size={20} />,
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.SUBSCRIPTION]: 'bg-indigo-100 text-indigo-600',
  [Category.FOOD]: 'bg-green-100 text-green-600',
  [Category.DOCUMENT]: 'bg-blue-100 text-blue-600',
  [Category.INSURANCE]: 'bg-purple-100 text-purple-600',
  [Category.WARRANTY]: 'bg-amber-100 text-amber-600',
  [Category.MEDICINE]: 'bg-rose-100 text-rose-600',
  [Category.HOME]: 'bg-orange-100 text-orange-600',
  [Category.OTHERS]: 'bg-gray-100 text-gray-600',
};
