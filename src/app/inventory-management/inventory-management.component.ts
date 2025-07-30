
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplyService } from '../supply.service';
import { Supply } from '../supply.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-management',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.css'
})
export class InventoryManagementComponent {
supplies: Supply[] = [];
  supplyForm: FormGroup;
  isEditMode = false;
  currentSupplyId?: number;

  constructor(private fb: FormBuilder, private supplyService: SupplyService) {
    this.supplyForm = this.fb.group({
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      reorderLevel: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadSupplies();
  }

  loadSupplies() {
    this.supplyService.getAllSupplies().subscribe(data => this.supplies = data);
  }

  submitForm() {
    if (this.supplyForm.invalid) return;

    const supplyData = this.supplyForm.value;

    if (this.isEditMode && this.currentSupplyId) {
      this.supplyService.updateSupply({ ...supplyData, id: this.currentSupplyId }).subscribe(() => {
        this.loadSupplies();
        this.resetForm();
      });
    } else {
      this.supplyService.addSupply(supplyData).subscribe(() => {
        this.loadSupplies();
        this.resetForm();
      });
    }
  }

  editSupply(supply: Supply) {
    this.isEditMode = true;
    this.currentSupplyId = supply.id;
    this.supplyForm.patchValue(supply);
  }

  deleteSupply(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.supplyService.deleteSupply(id).subscribe(() => this.loadSupplies());
    }
  }

  resetForm() {
    this.supplyForm.reset();
    this.isEditMode = false;
    this.currentSupplyId = undefined;
  }
}
