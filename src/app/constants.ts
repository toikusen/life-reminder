import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, string> = {
  [Category.SUBSCRIPTION]: 'credit-card',
  [Category.FOOD]: 'apple',
  [Category.DOCUMENT]: 'file-text',
  [Category.INSURANCE]: 'shield-check',
  [Category.WARRANTY]: 'wrench',
  [Category.MEDICINE]: 'pill',
  [Category.HOME]: 'home',
  [Category.OTHERS]: 'layers',
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
