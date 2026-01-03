import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppSettings, ExpiryItem } from '../types';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn pb-10">
      <div class="space-y-1">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">通知設定</h3>
        <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div class="p-4 flex items-center justify-between border-b border-slate-50">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-50 text-indigo-600 rounded-xl text-lg">🔔</div>
              <span class="text-sm font-medium">每日提醒時間</span>
            </div>
            <input
              type="time"
              [(ngModel)]="tempSettings.defaultReminderTime"
              (change)="updateSettings()"
              class="text-sm font-bold bg-slate-50 px-2 py-1 rounded-lg outline-none"
            />
          </div>
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-50 text-blue-600 rounded-xl text-lg">🌐</div>
              <span class="text-sm font-medium">幣別符號</span>
            </div>
            <select
              [(ngModel)]="tempSettings.currency"
              (change)="updateSettings()"
              class="text-sm font-bold bg-slate-50 px-2 py-1 rounded-lg outline-none"
            >
              <option value="TWD">TWD ($)</option>
              <option value="USD">USD ($)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="space-y-1">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">資料管理</h3>
        <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <button
            (click)="exportData()"
            class="w-full p-4 flex items-center justify-between border-b border-slate-50 active:bg-slate-50"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-50 text-green-600 rounded-xl text-lg">⬇</div>
              <span class="text-sm font-medium">備份匯出 JSON</span>
            </div>
            <span class="text-lg">›</span>
          </button>
          <label class="w-full p-4 flex items-center justify-between active:bg-slate-50 cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-50 text-amber-600 rounded-xl text-lg">⬆</div>
              <span class="text-sm font-medium">還原匯入 JSON</span>
              <input type="file" class="hidden" accept=".json" (change)="importData($event)" />
            </div>
            <span class="text-lg">›</span>
          </label>
        </div>
      </div>

      <div class="space-y-1">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">關於</h3>
        <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div class="p-4 flex items-center justify-between border-b border-slate-50">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-slate-50 text-slate-600 rounded-xl text-lg">🛡</div>
              <span class="text-sm font-medium">隱私政策</span>
            </div>
          </div>
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-slate-50 text-slate-600 rounded-xl text-lg">ℹ</div>
              <span class="text-sm font-medium">版本</span>
            </div>
            <span class="text-xs text-slate-400 font-bold tracking-widest">v1.0.0-MVP</span>
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
export class SettingsComponent {
  @Input() settings!: AppSettings;
  @Input() items: ExpiryItem[] = [];
  @Output() settingsChange = new EventEmitter<AppSettings>();
  @Output() itemsChange = new EventEmitter<ExpiryItem[]>();

  tempSettings: AppSettings = {
    defaultReminderTime: '09:00',
    defaultReminderDays: 3,
    currency: 'TWD'
  };

  ngOnInit(): void {
    this.tempSettings = { ...this.settings };
  }

  ngOnChanges(): void {
    this.tempSettings = { ...this.settings };
  }

  updateSettings(): void {
    this.settingsChange.emit(this.tempSettings);
  }

  exportData(): void {
    const dataStr = JSON.stringify({ items: this.items, settings: this.settings }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'expiry-butler-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  importData(e: Event): void {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.items) {
          this.itemsChange.emit(data.items);
          if (data.settings) {
            this.settingsChange.emit(data.settings);
          }
          alert('匯入成功！');
        }
      } catch (error) {
        alert('匯入失敗，請檢查檔案格式。');
      }
    };
    reader.readAsText(file);
  }
}
