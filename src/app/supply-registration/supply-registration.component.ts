import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplyService } from '../supply.service';
import { Supply } from '../supply.service';
@Component({
  selector: 'app-supply-registration',
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './supply-registration.component.html',
  styleUrl: './supply-registration.component.css'
})
export class SupplyRegistrationComponent {

supplyForm!: FormGroup;
stockOutForm!: FormGroup;
supplies: Supply[] = [];
supply! : Supply;
activeFilter: 'Registration Supply' | 'StockOut Form' | 'Stock Detail'= 'Registration Supply';
page:number=1;
pageSize:number=10;


  constructor(private fb: FormBuilder, private supplyserv: SupplyService) {}

  ngOnInit(): void {
    this.supplyForm = this.fb.group({
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      reorderLevel: ['', [Validators.required, Validators.min(1)]],
      dateEntered:['',Validators.required]
    });
     this.stockOutForm = this.fb.group({
       id: ['', Validators.required],  // ID of supply item
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]], // Stock Out min quantity is 1
      unit: ['', Validators.required],
      reason: ['', Validators.required],
      dateEntered: ['',Validators.required]
    
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
  
  submitSupply() {

      if (this.supplyForm.invalid) {
    this.supplyForm.markAllAsTouched();
    return;
  }
    else { 
     this.supply = this.supplyForm.value;
     console.log("value:"+this.supplyForm.value)
     this.supplyserv.addSupply(this.supply).subscribe({
      next:(data)=>{

        alert("The Supply is registered succesfully!!!");

        this.resetForm();
      },
      error:(err)=> {
 
        alert("Failed to Register The Item.");
      console.error("err on registration"+ err?.error?.errors);
      }
     })
      // Perform supply save logic here
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
        this.stockOutForm.patchValue({id: ""})
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

get getPages(){

   const start=(this.page-1)* this.pageSize;
   return this.supplies.slice(start, start+this.pageSize)
}

get getTotalPages(){
  return  Math.ceil((this.supplies.length)/this.pageSize)
}

resetForm(){
  this.supplyForm.reset();
}

resetFormOut(){
  this.stockOutForm.reset();
  this.stockOutForm.patchValue({id: ""})
}

}
