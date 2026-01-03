import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category } from '../../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../constants';

@Component({
  selector: 'app-expiry-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expiry-item-card.component.html',
  styleUrls: ['./expiry-item-card.component.css']
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
