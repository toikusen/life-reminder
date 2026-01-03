import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiryItem, Category, AppSettings } from './types';
import { DataService } from './services/data.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEditModalComponent } from './components/add-edit-modal/add-edit-modal.component';
import { ExpiryItemCardComponent } from './components/expiry-item-card/expiry-item-card.component';
import { SummaryComponent } from './components/summary/summary.component';
import { SettingsComponent } from './components/settings/settings.component';

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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
