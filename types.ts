
export enum Category {
  SUBSCRIPTION = '訂閱服務',
  FOOD = '食品生鮮',
  DOCUMENT = '證照證件',
  INSURANCE = '保險理財',
  WARRANTY = '產品保固',
  MEDICINE = '藥品醫療',
  HOME = '居家生活',
  OTHERS = '其他'
}

export type Cycle = 'MONTH' | 'YEAR' | 'ONCE';

export interface ExpiryItem {
  id: string;
  name: string;
  category: Category;
  expiryDate: string; // ISO string
  reminderDays: number;
  notes?: string;
  createdAt: string;
  // Template specific fields
  amount?: number;
  cycle?: Cycle;
  isAutoRenew?: boolean;
  purchaseDate?: string;
  handledAt?: string; // If processed for current cycle
}

export interface AIAnalysisResult {
  name: string;
  expiryDate: string;
  category: Category;
  confidence: number;
}

export interface AppSettings {
  defaultReminderTime: string; // HH:mm
  defaultReminderDays: number;
  currency: string;
}
