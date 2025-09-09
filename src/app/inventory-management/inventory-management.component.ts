
import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplyService } from '../supply.service';
import { Supply } from '../supply.service';
import { CommonModule, NumberSymbol } from '@angular/common';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-inventory-management',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.css'
})
export class InventoryManagementComponent implements OnInit, OnDestroy {
supplies: Supply[] = [];
  supplyForm!: FormGroup;
  isEditMode = false;
  currentSupplyId?: number;
    private reorderSub?: Subscription;
    searchInventory:string ='';
    page: number = 1;
    pageSize: number = 7;

  constructor(private fb: FormBuilder, private supplyService: SupplyService) {
    
  }

  ngOnInit(): void {

    this.supplyForm = this.fb.group({
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      dateEntered:[''],
      reorderLevel: ['', [Validators.required, Validators.min(5)]],
    });
          const today = new Date().toLocaleDateString('en-CA'); // "2025-08-15"
    this.supplyForm.patchValue({ dateEntered: today });

    this.loadSupplies();
       const reorder = this.supplyForm.get('reorderLevel') as FormControl | null;
       this.reorderSub= reorder?.valueChanges.pipe(distinctUntilChanged())
    .subscribe((val: unknown) => {
      const num = Number(val);
      // only show message for actual numeric values < 5 AND when user touched/edited the control
      if (!isNaN(num) && num < 5 && (reorder.dirty || reorder.touched)) {
        alert('Reorder level must be at least 5');
      }
    }) ?? undefined;

      

    
  }

   ngOnDestroy(): void {
    this.reorderSub?.unsubscribe();
   }

  
  loadSupplies() {
    this.supplyService.getAllSupplies().subscribe(data => this.supplies = data);
  }

  submitForm() {
    if (this.supplyForm.invalid) {
      alert("P/s fill the Form Correctly");
      return;
    }
   
 
   
else {
   // const supplyData = this.supplyForm.value;
      const today = new Date().toLocaleDateString('en-CA'); // "2025-08-15"
    this.supplyForm.patchValue({ dateEntered: today });
    const supplyData = { ...this.supplyForm.value };
     console.log("suppData"+ supplyData)


    if (this.isEditMode && this.currentSupplyId) {
      this.supplyService.updateSupply({ ...supplyData, id: this.currentSupplyId }).subscribe(() => {
            
      alert('The Supply Item Updated Successfully!!');
        this.loadSupplies();
        this.resetForm();
    const today = new Date().toLocaleDateString('en-CA'); // "2025-08-15"
    this.supplyForm.patchValue({ dateEntered: today });
        
      });
    } else {

      this.supplyService.addSupply(supplyData).subscribe(() => {
        alert('The Supply Item Registered Successfully!!');
        console.log("suppData"+ supplyData)
        this.loadSupplies();
        this.resetForm();
    const today = new Date().toLocaleDateString('en-CA'); // "2025-08-15"
    this.supplyForm.patchValue({ dateEntered: today });
      });
    }
  }
  }

  editSupply(supply: Supply) {
    this.isEditMode = true;
    this.currentSupplyId = supply.id;
    this.supplyForm.patchValue(supply);
  }

  deleteSupply(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.supplyService.deleteSupply(id).subscribe({
        next:()=> {
           alert('The Item Deleted Successfully!!!');
          this.loadSupplies();
    const today = new Date().toLocaleDateString('en-CA'); // "2025-08-15"
    this.supplyForm.patchValue({ dateEntered: today });
        },
        error:()=>{alert('Unable to delete the Item')}
      });
    }
  }

  resetForm() {
    this.supplyForm.reset();
    this.isEditMode = false;
    this.currentSupplyId = undefined;

  }

   get getFiltered(){
    return this.supplies.filter(fil=>
      fil.category.toLowerCase().includes(this.searchInventory.toLowerCase()) ||
      fil.itemName.toLowerCase().includes(this.searchInventory.toLowerCase())
      
    );
       }

    get paginatedPage()
    {
      const start = (this.page - 1) * this.pageSize;
      return this.getFiltered.slice(start, start + this.pageSize)
    }

    get totalPages(){
      return Math.ceil(this.getFiltered.length / this.pageSize)
    }

}
