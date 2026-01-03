import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpiryItem, Category, Cycle } from '../../types';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-add-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.css']
})
export class AddEditModalComponent implements OnInit, OnChanges {
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
