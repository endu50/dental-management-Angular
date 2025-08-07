import { Component, OnInit } from '@angular/core';
import { AppointService } from '../appoint.service';
import { Appoint } from '../appoint.service';
import { PatientService } from '../patient.service';
import { Patient } from '../patient.service';
import { PaymentService } from '../payment.service';
import { payment } from '../payment.service';
import { CommonModule } from '@angular/common';
import { Supply, SupplyService } from '../supply.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  Appoints: Appoint[] = [];
  Patients: Patient []= [];
  Payments: payment [] = [];
  Supplies: Supply [] = [];
  todayAppointmentsCount: number = 0;
  totalPatient : number = 0;
  pendingPayments : number = 0;
  onlinePayments : number =0;
  cashPayments : number =0;
  LowQuantity : number = 0;
   todayStr! : any; 

  constructor(private appoints: AppointService, private patients :PatientService, 
    private payments : PaymentService, private supply: SupplyService) {}

  ngOnInit(): void {

    this. todayStr = new Date().toLocaleDateString('en-CA')// Format: 'YYYY-MM-DD'
    console.log("todayis:"+this.todayStr)

    this.appointmentNumber();
    this.getPatients();
    this.getPendingBills();
    this.getOnlinePayment();
    this.getCashPayment();
    this.getInventory();

  }
  get todayAppointments(): Appoint[] {
  return this.Appoints
    .filter(appoint => {
      const appointDate = new Date(appoint.appointmentDate);
      const appointDateStr = appointDate.toLocaleDateString('en-CA');
      // console.log("Db:"+ appointDateStr);
      // console.log("Front:"+this.todayStr);
     
      return appointDateStr === this.todayStr;
    })
    .slice(0, 5);
}
   appointmentNumber() :void{
        
       // console.log(this.todayStr);
        var numb: number=0;

    this.appoints.getAllAppointments().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.Appoints = data;

          // Count appointments that match today's date
          this.todayAppointmentsCount = this.Appoints.filter(appoint => {
            const appointDateStr = new Date(appoint.appointmentDate).toLocaleDateString('en-CA');
            return appointDateStr === this. todayStr;
          }).length;

          console.log("Number of appointments today:", this.todayAppointmentsCount);

          numb=this.todayAppointmentsCount;
         
        }
      },
      error: (err) => {
        console.error("Error fetching appointments:", err);
        alert("Error fetching appointments");
     
      }
    });
     
  }

getPatients(): void {
 
   this.patients.getAllPatients().subscribe({
    next:(data)=> {
     if(data.length >0){
       this.Patients =data;
       this.totalPatient= this.Patients.filter(patient => {
       const Patientvalue= patient.id
       return Patientvalue;
      
       }).length
        console.log("Total Patients:", this.totalPatient);
     }
    },
    error: (err)=> {
      console.error("Error fetching patients:", err);
      alert("Error fetching patients");
    }
   });   
  }
  getPendingBills(){

    this.payments.getPayment().subscribe({
      next:(data)=>{
        if(data.length > 0) {
         this.Payments = data;
          this.pendingPayments= this.Payments.filter(payment => {
            const pendingPay= payment.paymentStatus === 'pending'
            return pendingPay;
          }).length
           console.log("Total Payment Pending:", this.pendingPayments);
        }
      },
      error: (err)=> {
        console.log("error fetching Pyment Detail"+ err);
        alert("error fetching Payment Detail");
      }
    })

  }
  getOnlinePayment()
  {
    this.payments.getPayment().subscribe({
      next:(data)=>{
        if(data.length > 0) {
         this.Payments = data;
          this.onlinePayments= this.Payments.filter(payment => {
            const pendingPay= payment.method === 'online'
            return pendingPay;
          }).length
           console.log("Total Online Payments:", this.onlinePayments);
        }
      },
      error: (err)=> {
        console.log("error fetching Pyment Method"+ err);
        alert("error fetching Payment Method");
      }
    })
  }
    getCashPayment()
  {
    this.payments.getPayment().subscribe({
      next:(data)=>{
        if(data.length > 0) {
         this.Payments = data;
          this.cashPayments= this.Payments.filter(payment => {
            const pendingPay= payment.method === 'cash'
            return pendingPay;
          }).length
           console.log("Total cash Payments:", this.cashPayments);
        }
      },
      error: (err)=> {
        console.log("error fetching Pyment Method"+ err);
        alert("error fetching Payment Method");
      }
    })
  }
 
 getInventory()
  {
    this.supply.getAllSupplies().subscribe({
      next:(data)=>{
        if(data.length > 0) {
         this.Supplies = data;
          this.LowQuantity= this.Supplies.filter(supply => {
            var pendingPay= supply.quantity <= 5
            
            return pendingPay;
          }).length
           console.log("Total Low Quantity Item are:", this.LowQuantity);
        }
      },
      error: (err)=> {
        console.log("error fetching inventory detail"+ err);
        alert("error fetching qinventory detail");
      }
    })
  }
   
}
