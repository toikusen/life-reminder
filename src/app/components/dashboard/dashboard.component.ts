import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category } from '../../types';
import { CATEGORY_COLORS } from '../../constants';

interface DonutChartData {
  name: string;
  value: number;
  color: string;
  categoryColor?: string;
}

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
    categoryData: [] as DonutChartData[]
  };

  // 顏色配置
  private readonly colors = [
    '#6366f1', // indigo
    '#22c55e', // green
    '#3b82f6', // blue
    '#a855f7', // purple
    '#f59e0b', // amber
    '#f43f5e', // rose
    '#f97316', // orange
    '#6b7280'  // gray
  ];

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

    const categoryMap = Object.values(Category)
      .map((cat, index) => ({
        name: cat,
        value: this.items.filter(item => item.category === cat).length,
        color: this.colors[index % this.colors.length],
        categoryColor: CATEGORY_COLORS[cat as Category]
      }))
      .filter(d => d.value > 0);

    this.stats.categoryData = categoryMap;
  }

  getCategoryColorClass(categoryName: string): string {
    const colorClass = CATEGORY_COLORS[categoryName as Category];
    return colorClass.split(' ')[0];
  }

  // SVG Donut Chart 相關方法
  generateDonutPath(startAngle: number, endAngle: number, radius: number, innerRadius: number): string {
    const cx = 60;
    const cy = 60;
    
    const start = this.polarToCartesian(cx, cy, radius, endAngle);
    const end = this.polarToCartesian(cx, cy, radius, startAngle);
    const innerStart = this.polarToCartesian(cx, cy, innerRadius, endAngle);
    const innerEnd = this.polarToCartesian(cx, cy, innerRadius, startAngle);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
      'Z'
    ].join(' ');
  }

  private polarToCartesian(cx: number, cy: number, radius: number, degrees: number) {
    const radians = (degrees - 90) * Math.PI / 180;
    return {
      x: cx + (radius * Math.cos(radians)),
      y: cy + (radius * Math.sin(radians))
    };
  }

  getDonutSegments(): Array<{path: string; color: string; name: string; value: number}> {
    const total = this.stats.categoryData.reduce((sum, d) => sum + d.value, 0);
    const segments: Array<{path: string; color: string; name: string; value: number}> = [];
    let currentAngle = 0;
    
    this.stats.categoryData.forEach(item => {
      const sliceAngle = (item.value / total) * 360;
      segments.push({
        path: this.generateDonutPath(currentAngle, currentAngle + sliceAngle, 45, 28),
        color: item.color,
        name: item.name,
        value: item.value
      });
      currentAngle += sliceAngle;
    });
    
    return segments;
  }
}
