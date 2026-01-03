import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category } from '../../types';
import { CATEGORY_COLORS } from '../../constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnChanges {
  @Input() items: ExpiryItem[] = [];

  stats = {
    urgent: [] as ExpiryItem[],
    expired: [] as ExpiryItem[],
    categoryData: [] as { name: string; value: number }[]
  };

  ngOnInit(): void {
    this.calculateStats();
  }

  ngOnChanges(): void {
    this.calculateStats();
  }

  private calculateStats(): void {
    const now = new Date();

    this.stats.urgent = this.items.filter(item => {
      const expiry = new Date(item.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 7 && diffDays >= 0;
    });

    this.stats.expired = this.items.filter(item => new Date(item.expiryDate) < now);

    this.stats.categoryData = Object.values(Category)
      .map(cat => ({
        name: cat,
        value: this.items.filter(item => item.category === cat).length
      }))
      .filter(d => d.value > 0);
  }

  getCategoryColorClass(categoryName: string): string {
    const colorClass = CATEGORY_COLORS[categoryName as Category];
    return colorClass.split(' ')[0];
  }
}
