import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';

@Component({
  selector: 'app-expiry-item-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-3 flex items-center gap-4 active:scale-[0.98] transition-all">
      <div [ngClass]="['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl', CATEGORY_COLORS[item.category]]">
        {{ getCategoryEmoji(item.category) }}
      </div>

      <div class="flex-grow min-w-0">
        <h4 class="font-semibold text-slate-800 truncate text-sm">{{ item.name }}</h4>
        <div class="flex items-center gap-2 mt-1">
          <span [ngClass]="['text-[10px] px-2 py-0.5 rounded-full font-medium', getStatusClass()]">
            {{ getStatusText() }}
          </span>
          <span class="text-[10px] text-slate-400">
            {{ item.expiryDate | date:'shortDate' }}
          </span>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          (click)="onEdit.emit(item)"
          class="p-2 text-slate-400 hover:text-indigo-600 transition-colors text-lg"
        >
          ✏
        </button>
        <button
          (click)="onDelete.emit(item.id)"
          class="p-2 text-slate-400 hover:text-rose-600 transition-colors text-lg"
        >
          🗑
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ExpiryItemCardComponent {
  @Input() item!: ExpiryItem;
  @Output() onEdit = new EventEmitter<ExpiryItem>();
  @Output() onDelete = new EventEmitter<string>();

  CATEGORY_ICONS = CATEGORY_ICONS;
  CATEGORY_COLORS = CATEGORY_COLORS;

  private categoryEmojis: Record<string, string> = {
    '訂閱服務': '💳',
    '食品生鮮': '🍎',
    '證照證件': '📄',
    '保險理財': '🛡',
    '產品保固': '🔧',
    '藥品醫療': '💊',
    '居家生活': '🏠',
    '其他': '📦'
  };

  getStatusText(): string {
    const now = new Date();
    const expiry = new Date(this.item.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return '已過期';
    return `剩餘 ${diffDays} 天`;
  }

  getStatusClass(): string {
    const now = new Date();
    const expiry = new Date(this.item.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return 'text-rose-600 bg-rose-50';
    if (diffDays <= 7) return 'text-amber-600 bg-amber-50';
    return 'text-slate-500 bg-slate-100';
  }

  getCategoryEmoji(category: Category): string {
    return this.categoryEmojis[category] || '📦';
  }
}
