import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpiryItem, Category, Cycle } from '../types';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-add-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white w-full sm:max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto no-scrollbar">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">
            {{ item ? '編輯內容' : '新增提醒' }}
          </h2>
          <button (click)="onClose.emit()" class="p-3 bg-slate-100 rounded-2xl text-slate-500 active:scale-90 transition-all text-lg">
            ✕
          </button>
        </div>

        <div class="space-y-6">
          <button
            *ngIf="!item"
            (click)="fileInput.click()"
            [disabled]="isAnalyzing"
            class="w-full py-5 px-6 border-2 border-dashed border-indigo-200 rounded-3xl flex items-center justify-center gap-3 text-indigo-600 font-bold bg-indigo-50/30 hover:bg-indigo-50 transition-all active:scale-[0.98]"
          >
            <span class="text-xl">{{ isAnalyzing ? '⟳' : '✨' }}</span>
            {{ isAnalyzing ? '辨識中...' : 'AI 拍照自動輸入' }}
          </button>
          <input
            #fileInput
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden"
            (change)="handleFileChange($event)"
          />

          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">類別項目</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  *ngFor="let cat of categories"
                  (click)="category = cat"
                  [ngClass]="{
                    'bg-slate-900 text-white border-slate-900': category === cat,
                    'bg-white text-slate-500 border-slate-100': category !== cat
                  }"
                  class="p-2 rounded-2xl text-[10px] font-bold border transition-all"
                >
                  {{ cat }}
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">名稱</label>
              <input
                type="text"
                [(ngModel)]="name"
                placeholder="輸入項目名稱..."
                class="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
              />
            </div>

            <!-- Template Specific: Subscription -->
            <div *ngIf="category === categories[0]" class="grid grid-cols-2 gap-4 animate-fadeIn">
              <div class="space-y-1">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">金額</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    [(ngModel)]="amount"
                    placeholder="0"
                    class="w-full pl-10 pr-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold"
                  />
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">週期</label>
                <select
                  [(ngModel)]="cycle"
                  class="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold appearance-none"
                >
                  <option value="MONTH">每月續費</option>
                  <option value="YEAR">每年續費</option>
                  <option value="ONCE">一次性</option>
                </select>
              </div>
            </div>

            <!-- Template Specific: Warranty -->
            <div *ngIf="category === categories[4]" class="space-y-1 animate-fadeIn">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">購買日期</label>
              <input
                type="date"
                [(ngModel)]="purchaseDate"
                class="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                {{ category === categories[0] ? '下次扣款日' : '到期日期' }}
              </label>
              <input
                type="date"
                [(ngModel)]="expiryDate"
                class="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none outline-none font-bold text-indigo-600"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">提前幾天提醒</label>
              <div class="flex gap-2">
                <button
                  *ngFor="let days of [1, 3, 7, 14]"
                  (click)="reminderDays = days"
                  [ngClass]="{
                    'bg-indigo-600 text-white shadow-lg': reminderDays === days,
                    'bg-slate-100 text-slate-500': reminderDays !== days
                  }"
                  class="flex-1 py-3 rounded-2xl text-xs font-bold transition-all"
                >
                  {{ days }}天前
                </button>
              </div>
            </div>
          </div>

          <button
            (click)="handleSave()"
            [disabled]="!name || !expiryDate"
            class="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {{ item ? '儲存變更' : '確定新增' }}
          </button>
        </div>
        <div class="h-8"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AddEditModalComponent implements OnInit {
  @Input() item?: ExpiryItem;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Partial<ExpiryItem>>();
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  categories = Object.values(Category);

  name = '';
  category = Category.OTHERS;
  expiryDate = '';
  reminderDays = 3;
  amount: number | undefined;
  cycle: Cycle = 'MONTH';
  isAutoRenew = true;
  purchaseDate = '';
  isAnalyzing = false;

  constructor(private geminiService: GeminiService) {}

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(): void {
    this.resetForm();
  }

  private resetForm(): void {
    if (this.item) {
      this.name = this.item.name;
      this.category = this.item.category;
      this.expiryDate = this.item.expiryDate.split('T')[0];
      this.reminderDays = this.item.reminderDays;
      this.amount = this.item.amount;
      this.cycle = this.item.cycle || 'MONTH';
      this.isAutoRenew = this.item.isAutoRenew ?? true;
      this.purchaseDate = this.item.purchaseDate?.split('T')[0] || '';
    } else {
      this.name = '';
      this.category = Category.OTHERS;
      this.expiryDate = '';
      this.reminderDays = 3;
      this.amount = undefined;
      this.cycle = 'MONTH';
      this.isAutoRenew = true;
      this.purchaseDate = '';
    }
  }

  async handleFileChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    this.isAnalyzing = true;
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const result = await this.geminiService.analyzeImageForExpiry(reader.result as string);
        this.name = result.name;
        this.category = result.category;
        this.expiryDate = result.expiryDate;
      } catch (error) {
        alert('AI 分析失敗，請手動輸入。');
      } finally {
        this.isAnalyzing = false;
      }
    };

    reader.readAsDataURL(file);
  }

  handleSave(): void {
    if (!this.name || !this.expiryDate) return;

    this.onSave.emit({
      name: this.name,
      category: this.category,
      expiryDate: this.expiryDate,
      reminderDays: this.reminderDays,
      amount: this.amount,
      cycle: this.cycle,
      isAutoRenew: this.isAutoRenew,
      purchaseDate: this.purchaseDate
    });
  }
}
