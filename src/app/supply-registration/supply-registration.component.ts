import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplyService } from '../supply.service';
import { Supply } from '../supply.service';
@Component({
  selector: 'app-supply-registration',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './supply-registration.component.html',
  styleUrl: './supply-registration.component.css'
})
export class SupplyRegistrationComponent {

supplyForm!: FormGroup;
stockOutForm!: FormGroup;
supplies: Supply[] = [];
supply! : Supply;
activeFilter: 'Registration Supply' | 'StockOut Form'= 'Registration Supply';



  constructor(private fb: FormBuilder, private supplyserv: SupplyService) {}

  ngOnInit(): void {
    this.supplyForm = this.fb.group({
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      reorderLevel: ['', [Validators.required, Validators.min(1)]],
    });
     this.stockOutForm = this.fb.group({
       id: ['', Validators.required],  // ID of supply item
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]], // Stock Out min quantity is 1
      unit: ['', Validators.required],
      reason: ['', Validators.required]  // Example extra field for StockOut
    });
// Load Supplies from API
  this.supplyserv.getAllSupplies().subscribe(data => {
    this.supplies = data;
  });

  // Listen to Supply ID Selection Change
  this.stockOutForm.get('id')?.valueChanges.subscribe(selectedId => {
    const selectedSupply = this.supplies.find(s => s.id === +selectedId);

    if (selectedSupply) {
      this.stockOutForm.patchValue({
        itemName: selectedSupply.itemName,
        category: selectedSupply.category,
        unit: selectedSupply.unit
      });
    } else {
      // Clear fields if invalid selection
      this.stockOutForm.patchValue({
        itemName: '',
        category: '',
        unit: ''
      });
    }
  });



       
    
  }
  
resetForm(){
  this.supplyForm.reset();
}
  submitSupply() {
    if (this.supplyForm.valid) {
     this.supply = this.supplyForm.value;
     this.supplyserv.addSupply(this.supply).subscribe({
      next:(data)=>{
        alert("The Supply is registered succesfully!!!");
        this.resetForm();
      },
      error:(err)=> {
        console.error("err on registration"+ err);
      }
     })
      // Perform supply save logic here
    } else {
      console.log('Form is invalid');
      this.supplyForm.markAllAsTouched();
    }
  }
   submitStockOut() {
  if (this.stockOutForm.valid) {
    const stockOutData = this.stockOutForm.value;
    const selectedSupply = this.supplies.find(s => s.id === +stockOutData.id);

    if (!selectedSupply) {
      alert("Selected supply not found.");
      return;
    }

    if (stockOutData.quantity > selectedSupply.quantity) {
      alert("Stock out quantity exceeds available stock!");
      return;
    }

    const updatedSupply: Supply = {
      ...selectedSupply,
      quantity: selectedSupply.quantity - stockOutData.quantity
    };

    this.supplyserv.updateSupply(updatedSupply).subscribe({
      next: (data) => {
        alert("Stock Out processed successfully!");
        this.stockOutForm.reset();
        this.refreshSupplies(); // Refresh list after stock out
      },
      error: (err) => {
        console.error("Error on Stock out: " + err);
      }
    });

  } else {
    this.stockOutForm.markAllAsTouched();
  }
}

refreshSupplies() {
  this.supplyserv.getAllSupplies().subscribe(data => {
    this.supplies = data;
  });
}

}
