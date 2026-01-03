import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div class="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[32px] text-white shadow-xl">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-indigo-100 text-xs font-bold uppercase tracking-widest">預估每月支出</p>
            <h2 class="text-3xl font-black mt-1">$ {{ monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}</h2>
          </div>
          <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md text-2xl">
            💰
          </div>
        </div>
        <div class="flex gap-4 pt-4 border-t border-white/10">
          <div class="flex-1">
            <p class="text-[10px] text-indigo-200 uppercase">訂閱項目</p>
            <p class="font-bold">{{ subscriptionCount }} 筆</p>
          </div>
          <div class="flex-1">
            <p class="text-[10px] text-indigo-200 uppercase">總提醒</p>
            <p class="font-bold">{{ items.length }} 筆</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span class="text-lg">📅</span> 近期提醒概覽
          </h3>
          <div class="space-y-3">
            <div *ngFor="let row of upcomingRows" class="flex items-center justify-between">
              <span class="text-sm text-slate-600">{{ row.label }}</span>
              <div class="flex items-center gap-3 flex-grow mx-4">
                <div class="h-1.5 bg-slate-100 rounded-full flex-grow overflow-hidden">
                  <div
                    [ngClass]="row.color"
                    class="h-full"
                    [style.width.%]="Math.min(100, (row.value / (items.length || 1)) * 100)"
                  ></div>
                </div>
              </div>
              <span class="text-sm font-bold text-slate-800">{{ row.value }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-64">
          <h3 class="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span class="text-lg">📈</span> 分類佔比
          </h3>
          <div class="h-full flex items-center justify-center text-slate-500">
            <div class="text-center">
              <p class="text-sm">分類佔比圖表</p>
              <div class="grid grid-cols-2 gap-2 mt-4">
                <div *ngFor="let entry of categorySpending" class="flex items-center gap-2 text-[10px] text-slate-500">
                  <div [ngClass]="['w-2 h-2 rounded-full', getCategoryColorClass(entry.name)]"></div>
                  {{ entry.name }}: {{ entry.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SummaryComponent implements OnChanges {
  @Input() items: ExpiryItem[] = [];

  monthlyCost = 0;
  subscriptionCount = 0;
  upcomingRows: { label: string; value: number; color: string }[] = [];
  categorySpending: { name: string; value: number }[] = [];
  Math = Math;

  ngOnChanges(): void {
    this.calculateStats();
  }

  private calculateStats(): void {
    const now = new Date();

    // Monthly cost
    this.monthlyCost = this.items
      .filter(i => i.category === Category.SUBSCRIPTION && i.amount)
      .reduce((acc, i) => {
        if (i.cycle === 'YEAR') return acc + (i.amount! / 12);
        if (i.cycle === 'MONTH') return acc + i.amount!;
        return acc;
      }, 0);

    this.subscriptionCount = this.items.filter(i => i.category === Category.SUBSCRIPTION).length;

    // Upcoming counts
    const today = this.items.filter(i => {
      const d = new Date(i.expiryDate);
      return d.toDateString() === now.toDateString();
    }).length;

    const week = this.items.filter(i => {
      const diff = (new Date(i.expiryDate).getTime() - now.getTime()) / 86400000;
      return diff > 0 && diff <= 7;
    }).length;

    const month = this.items.filter(i => {
      const diff = (new Date(i.expiryDate).getTime() - now.getTime()) / 86400000;
      return diff > 0 && diff <= 30;
    }).length;

    this.upcomingRows = [
      { label: '今天到期', value: today, color: 'bg-rose-500' },
      { label: '本週到期', value: week, color: 'bg-amber-500' },
      { label: '30天內到期', value: month, color: 'bg-indigo-500' }
    ];

    // Category spending
    this.categorySpending = Object.values(Category)
      .map(cat => ({
        name: cat,
        value: this.items.filter(i => i.category === cat).length
      }))
      .filter(v => v.value > 0);
  }

  getCategoryColorClass(categoryName: string): string {
    const colorClass = CATEGORY_COLORS[categoryName as Category];
    return colorClass.split(' ')[0];
  }
}
