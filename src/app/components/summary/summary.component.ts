import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category } from '../../types';
import { CATEGORY_COLORS } from '../../constants';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
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
