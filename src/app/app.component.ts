import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category, AppSettings } from './types';
import { DataService } from './services/data.service';
import { DashboardComponent } from './components/dashboard.component';
import { AddEditModalComponent } from './components/add-edit-modal.component';
import { ExpiryItemCardComponent } from './components/expiry-item-card.component';
import { SummaryComponent } from './components/summary.component';
import { SettingsComponent } from './components/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    AddEditModalComponent,
    ExpiryItemCardComponent,
    SummaryComponent,
    SettingsComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Header -->
      <div class="sticky top-0 z-40 bg-white border-b border-slate-100 backdrop-blur-md bg-white/80">
        <div class="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Expiry Butler</h1>
          <button
            (click)="isModalOpen = true"
            class="p-3 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 active:scale-90 transition-all text-xl"
          >
            +
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-2xl mx-auto p-6 pb-24">
        <!-- Dashboard Tab -->
        <div *ngIf="activeTab === 'dashboard'">
          <app-dashboard [items]="items"></app-dashboard>
        </div>

        <!-- List Tab -->
        <div *ngIf="activeTab === 'list'" class="space-y-4 animate-fadeIn">
          <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
            <button
              (click)="selectedCategory = 'all'"
              [ngClass]="{
                'bg-slate-900 text-white shadow-lg': selectedCategory === 'all',
                'bg-white text-slate-500 border border-slate-100': selectedCategory !== 'all'
              }"
              class="px-5 py-2 rounded-2xl text-xs font-black transition-all"
            >
              全部
            </button>
            <button
              *ngFor="let cat of categories"
              (click)="selectedCategory = cat"
              [ngClass]="{
                'bg-slate-900 text-white shadow-lg': selectedCategory === cat,
                'bg-white text-slate-500 border border-slate-100': selectedCategory !== cat
              }"
              class="px-5 py-2 rounded-2xl text-xs font-black flex-shrink-0 transition-all"
            >
              {{ cat }}
            </button>
          </div>

          <div class="space-y-1">
            <app-expiry-item-card
              *ngFor="let item of filteredItems"
              [item]="item"
              (onEdit)="handleEditItem($event)"
              (onDelete)="handleDeleteItem($event)"
            ></app-expiry-item-card>
            <div *ngIf="filteredItems.length === 0" class="text-center py-20 text-slate-300 font-bold">
              空空如也
            </div>
          </div>
        </div>

        <!-- Summary Tab -->
        <div *ngIf="activeTab === 'summary'">
          <app-summary [items]="items"></app-summary>
        </div>

        <!-- Settings Tab -->
        <div *ngIf="activeTab === 'settings'">
          <app-settings
            [settings]="settings"
            [items]="items"
            (settingsChange)="handleSettingsChange($event)"
            (itemsChange)="handleItemsChange($event)"
          ></app-settings>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 backdrop-blur-md bg-white/80">
        <div class="max-w-2xl mx-auto px-6 py-3 flex justify-around">
          <button
            (click)="activeTab = 'dashboard'"
            [ngClass]="{ 'text-indigo-600': activeTab === 'dashboard', 'text-slate-400': activeTab !== 'dashboard' }"
            class="flex flex-col items-center gap-1 p-3 rounded-2xl transition-all text-lg"
          >
            <span>📊</span>
            <span class="text-[10px] font-bold">儀表板</span>
          </button>
          <button
            (click)="activeTab = 'list'"
            [ngClass]="{ 'text-indigo-600': activeTab === 'list', 'text-slate-400': activeTab !== 'list' }"
            class="flex flex-col items-center gap-1 p-3 rounded-2xl transition-all text-lg"
          >
            <span>📋</span>
            <span class="text-[10px] font-bold">列表</span>
          </button>
          <button
            (click)="activeTab = 'summary'"
            [ngClass]="{ 'text-indigo-600': activeTab === 'summary', 'text-slate-400': activeTab !== 'summary' }"
            class="flex flex-col items-center gap-1 p-3 rounded-2xl transition-all text-lg"
          >
            <span>📈</span>
            <span class="text-[10px] font-bold">統計</span>
          </button>
          <button
            (click)="activeTab = 'settings'"
            [ngClass]="{ 'text-indigo-600': activeTab === 'settings', 'text-slate-400': activeTab !== 'settings' }"
            class="flex flex-col items-center gap-1 p-3 rounded-2xl transition-all text-lg"
          >
            <span>⚙</span>
            <span class="text-[10px] font-bold">設定</span>
          </button>
        </div>
      </div>

      <!-- Modal -->
      <app-add-edit-modal
        [item]="editingItem"
        [isOpen]="isModalOpen"
        (onClose)="handleModalClose()"
        (onSave)="handleSaveItem($event)"
      ></app-add-edit-modal>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent implements OnInit {
  activeTab: 'dashboard' | 'list' | 'summary' | 'settings' = 'dashboard';
  isModalOpen = false;
  editingItem: ExpiryItem | undefined;
  selectedCategory: Category | 'all' = 'all';

  items: ExpiryItem[] = [];
  settings: AppSettings = {
    defaultReminderTime: '09:00',
    defaultReminderDays: 3,
    currency: 'TWD'
  };

  categories = Object.values(Category);

  get filteredItems(): ExpiryItem[] {
    let filtered = this.items;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    return filtered.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.items$.subscribe(items => {
      this.items = items;
    });

    this.dataService.settings$.subscribe(settings => {
      this.settings = settings;
    });
  }

  handleSaveItem(data: Partial<ExpiryItem>): void {
    if (this.editingItem) {
      this.dataService.updateItem(this.editingItem.id, data);
    } else {
      this.dataService.addItem(data);
    }
    this.isModalOpen = false;
    this.editingItem = undefined;
  }

  handleDeleteItem(id: string): void {
    if (confirm('確定刪除？')) {
      this.dataService.deleteItem(id);
    }
  }

  handleEditItem(item: ExpiryItem): void {
    this.editingItem = item;
    this.isModalOpen = true;
  }

  handleModalClose(): void {
    this.isModalOpen = false;
    this.editingItem = undefined;
  }

  handleSettingsChange(settings: AppSettings): void {
    this.dataService.updateSettings(settings);
  }

  handleItemsChange(items: ExpiryItem[]): void {
    this.dataService.importData({
      items,
      settings: this.settings
    });
  }
}
