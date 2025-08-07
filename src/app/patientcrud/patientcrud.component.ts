import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Patient, PatientService } from '../patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-patientcrud',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './patientcrud.component.html',
  styleUrl: './patientcrud.component.css'
})
export class PatientcrudComponent implements OnInit {

formpatient !: FormGroup;
patients : Patient[]=[];
selectedPatient?: Patient;
errorMessage: string = '';
searchText : string ='';
page: number = 1;
pageSize: number = 7;

constructor(private fb:FormBuilder , private patientservice: PatientService) {

}

  ngOnInit(): void {
    this.formpatient= this.fb.group({
      id:[null],
      fullName:['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      phone:['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
      gender: ['',Validators.required],
      dateOfBirth: ['',Validators.required]
    })
    this.loadAllPatients();
  }

  get f(){

    return this.formpatient.controls;
  }

onSubmit()
{

}
editPatient(patient : Patient){
  const formattedDate = patient.dateOfBirth
  ? new Date(patient.dateOfBirth).toLocaleDateString('en-CA')
  : '';

this.formpatient.patchValue({
  ...patient, dateOfBirth:formattedDate
});
}
isFormEmpty(): boolean {
  const values = this.formpatient.value;
  return Object.values(values).every(val => !val); // all fields are falsy
}


updatePatient(){
  let formvalue: Patient=this.formpatient.value;

  formvalue = {
    ...formvalue
  };
  this.patientservice.updatePatient(formvalue).subscribe({
    next:(data)=>{
      this.loadAllPatients();
      this.resetForm();

    },
    error: (err)=> {
      this.errorMessage="unable to update";
      if(err.status==400 && err.error?.errors ) {
          console.log("error internal",err.error.errors);
      }
    }

  })
}
deletePatientById(id:number){
  if(confirm('are u sure to delete the patient?')) {
 this.patientservice.deletePatient(id).subscribe({
 next: ()=> {
  this.loadAllPatients();
  alert("Patient ID deleted")

 },
 error :() => alert('Failed to delete the patient')
 })
}
}
AddPatient(){
  if (this.formpatient.invalid) {
    this.errorMessage = 'Please fill all required fields correctly';
    return;
  }
 const patient =this.formpatient.value;
  this.patientservice.registerPatient(patient).subscribe({
   next:(data)=> { 
    console.log("the form Submited",data);
    console.log('Submitting patient:', this.formpatient.value);
    this.loadAllPatients();
    this.resetForm();
   },
   error: (err) => {
    if (err.status === 400 && err.error?.errors) {
      console.log('Server validation errors:', err.error.errors);
    }
    this.errorMessage = 'Unable to register patient';
  }
  });

}
resetForm(){
  this.formpatient.reset();
}

  loadAllPatients(){
   this.patientservice.getAllPatients().subscribe({
    next: (data)=> (this.patients = data),
    error: () =>{ alert("failed to load data");}
   })
  }

  getPateientById(id : number)

  {
    this.patientservice.getPatientId(id).subscribe({
     
      next :(data) => { 
        this.selectedPatient=data;
      },
      error : () => {
        this.errorMessage = 'Patient Form not found';
      }
    });
  }
  get filteredPatients() {
    return this.patients.filter(a =>
      a.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      a.phone.toLowerCase().includes(this.searchText.toLowerCase()) ||
      a.id?.toString().includes(this.searchText.toLowerCase())
    );
  }
  get paginatedPatints() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredPatients.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredPatients.length / this.pageSize);
  }
}
