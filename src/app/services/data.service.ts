import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpiryItem, AppSettings, Category } from '../types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private itemsSubject = new BehaviorSubject<ExpiryItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private settingsSubject = new BehaviorSubject<AppSettings>({
    defaultReminderTime: '09:00',
    defaultReminderDays: 3,
    currency: 'TWD'
  });
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const savedItems = localStorage.getItem('expiry_butler_items');
    const savedSettings = localStorage.getItem('expiry_butler_settings');

    if (savedItems) {
      this.itemsSubject.next(JSON.parse(savedItems));
    }
    if (savedSettings) {
      this.settingsSubject.next(JSON.parse(savedSettings));
    }
  }

  private saveItems(): void {
    localStorage.setItem('expiry_butler_items', JSON.stringify(this.itemsSubject.value));
  }

  private saveSettings(): void {
    localStorage.setItem('expiry_butler_settings', JSON.stringify(this.settingsSubject.value));
  }

  getItems(): ExpiryItem[] {
    return this.itemsSubject.value;
  }

  getSettings(): AppSettings {
    return this.settingsSubject.value;
  }

  addItem(item: Partial<ExpiryItem>): void {
    const newItem: ExpiryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name!,
      category: item.category!,
      expiryDate: item.expiryDate!,
      reminderDays: item.reminderDays!,
      amount: item.amount,
      cycle: item.cycle,
      purchaseDate: item.purchaseDate,
      isAutoRenew: item.isAutoRenew,
      createdAt: new Date().toISOString()
    };
    const items = [...this.itemsSubject.value, newItem];
    this.itemsSubject.next(items);
    this.saveItems();
  }

  updateItem(id: string, updates: Partial<ExpiryItem>): void {
    const items = this.itemsSubject.value.map(i =>
      i.id === id ? { ...i, ...updates } as ExpiryItem : i
    );
    this.itemsSubject.next(items);
    this.saveItems();
  }

  deleteItem(id: string): void {
    const items = this.itemsSubject.value.filter(i => i.id !== id);
    this.itemsSubject.next(items);
    this.saveItems();
  }

  updateSettings(settings: AppSettings): void {
    this.settingsSubject.next(settings);
    this.saveSettings();
  }

  exportData(): { items: ExpiryItem[]; settings: AppSettings } {
    return {
      items: this.itemsSubject.value,
      settings: this.settingsSubject.value
    };
  }

  importData(data: { items: ExpiryItem[]; settings: AppSettings }): void {
    if (data.items) {
      this.itemsSubject.next(data.items);
      this.saveItems();
    }
    if (data.settings) {
      this.settingsSubject.next(data.settings);
      this.saveSettings();
    }
  }
}
