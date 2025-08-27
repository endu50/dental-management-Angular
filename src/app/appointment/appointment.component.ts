import { Component, OnInit } from '@angular/core';
import { Appoint, AppointService } from '../appoint.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment',
  imports: [CommonModule,ReactiveFormsModule,FormsModule], 
  templateUrl: './appointment.component.html'
})
export class AppointmentComponent implements OnInit {
  
  appointForm!: FormGroup;
  appointments: Appoint[] = [];
  appoint?:Appoint;
  selectedAppoint?: Appoint;
  errorMessage: string = '';
  isEdit: boolean=false;
  searchText:string ='';
  page:number =1;
  pageSize:number=10;

  constructor(private fb: FormBuilder, private appointService: AppointService) {}

  ngOnInit(): void {
    this.appointForm = this.fb.group({
      appointId:[null],
      patientName: ['', [Validators.required,Validators.minLength(5)]],
     phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      appointmentDate: ['', Validators.required],
      treatmentType: ['', Validators.required],
      dentistName: ['', Validators.required],
      status:['',Validators.required]
    });
  this.getAllAppointment();


    // this.loadAppointments();
  }
  get f(){
   return this.appointForm.controls;
 }
  // loadAppointments() {
  //   this.appointService.getAllAppointments().subscribe(data => {
  //     this.appointments = data;
  //   });
  // }

  onSubmit() :void {
    if (this.appointForm.invalid) {
      alert("P/s Fill The form Correctly");
        this.appointForm.markAllAsTouched(); // <-- forces required errors to show
      return;
    }
    else{
      if(!this.isEdit){
      const form = this.appointForm.value;
      delete form.appointId;
         const appointData = {
      ...form,
      phone: form.phone.toString() // ✅ force string
    };
      this.appointService.createAppointment(appointData).subscribe(() => {
        alert('Successfully registered the Appointment');
        this.getAllAppointment();
        this.resetForm();
        this.appointForm.patchValue({status:""});
        
      });
    }
    else
    {
      this.isEdit=true;
      let formValue : Appoint =this.appointForm.value;

       formValue= {...formValue, phone: this.appointForm.value.phone.toString()}
      this.appointService.updateAppoint(formValue).subscribe({
        next:(data)=>{
          alert("The Form Updated Successfully");
          this.getAllAppointment();
          this.resetForm();
          this.appointForm.patchValue({status:""});
          this.isEdit=false;
        },
        error:(err)=>{alert("Failed to Update The Form:"+ err);}
      })
    }
   }
  }
 
  getAllAppointment(){
    this.appointService.getAllAppointments().subscribe({
      next:(data)=>{
        if(data.length >0 ){
          this.appointments= data;
        }
      },
      error:(err)=>{ 
        alert("Failed to Load Appointment Data"+err);

      }
    })
  }

  getAppointById(appointId :number){
    this.appointService.getAppointById(appointId).subscribe({
      next:(data)=>{
  this.appoint=data;
      },
      error:(err)=>{alert("failed to get Appoint ById"+err);}
    })
  }
onEdit(appoint:Appoint){
  const dateApoint= appoint.appointmentDate ? 
  new Date (appoint.appointmentDate).toLocaleDateString('en-CA') : '';
  this.appointForm.patchValue({...appoint,appointmentDate:dateApoint})
  this.isEdit=true;

}

get getFiltereAppoints(){

  return this.appointments.filter(a=>
    a.patientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
     a.phone.toString().includes(this.searchText.toString()) 
  )
}

get GetPages(){
   const start = (this.page - 1) * this.pageSize
   return this.getFiltereAppoints.slice(start , start+ this.pageSize);
}

get TotalPages(){
  return Math.ceil(this.getFiltereAppoints.length / this.pageSize);
}

resetForm(){
  this.appointForm.reset();
  this.appointForm.patchValue({status:""});
  this.isEdit=false;
}

}
