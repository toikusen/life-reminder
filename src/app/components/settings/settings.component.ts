import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppSettings, ExpiryItem } from '../../types';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnChanges {
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
