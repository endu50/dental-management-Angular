import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { PatientService, Patient } from '../patient.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-patient-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './patient-register.component.html',
  styleUrl: './patient-register.component.css'
})
export class PatientRegisterComponent implements OnInit {
  patientForm!: FormGroup;
  Patients: Patient [] =[];
  patient? :Patient;
  submitted = false;
  isEdited:boolean=false;
  patientIdAfterSubmit: number | null = null; // 👈 store the patientId
  page : number=1;
  pageSize: number=10;
  searchText: string='';

  constructor(private fb: FormBuilder, public patientService: PatientService) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      id:[null],
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
    this.getPatients();
  }


  get f() { return this.patientForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.patientForm.invalid) {
      alert("P/s Fill the Required filled correctly");
      this.patientForm.markAllAsTouched();
      return;
    }

    if(!this.isEdited) {

    const patient: Patient = this.patientForm.value;
    delete patient.id;
    this.patientService.registerPatient(patient).subscribe({
      next: (data)=> {
      console.log("the form value",this.patientForm.value);
      alert('Patient registered successfully');
       this.patientIdAfterSubmit=data.id;
       this.getPatients();
       this.patientForm.reset();
       this.patientForm.patchValue({gender : ""});
      this.submitted = false;
      },
      error : (err)=>{
        console.log("Error"+err );
        alert("Failed to Register try again ???");

      }
    });
    return;
  }
  else{

   this.isEdited=true;
   let  formValue :Patient=this.patientForm.value;
   formValue={...formValue};
    
   this.patientService.updatePatient(formValue).subscribe({
    next:(data)=>  {
      
      //this.patient=data;
      alert("The Patient Form Updated Successfully!!");
      this.getPatients();
      this.formReset();
      this.patientForm.patchValue({gender : ""});
      this.isEdited=false;

    },
    error:(err)=>{alert("Unable to update"+err);}
   })
 
  }

  }
  onEdit(pat : Patient){
    const DateForm= pat.dateOfBirth ? 
    new Date(pat.dateOfBirth).toLocaleDateString('en-CA')
    : '';
    this.patientForm.patchValue({...pat,dateOfBirth:DateForm})
    this.isEdited=true;
  }
  getPatientById(id:number){
    this.patientService.getPatientId(id).subscribe({
      next:(data)=>{
        this.patient=data;
      },
      error:(err)=>{alert("Failed to get PatientBy Id"+err);}

    })
  }
  getPatients(){
    this.patientService.getAllPatients().subscribe({
      next:(data)=>{
        if(data.length >0){
        this.Patients=data;
        }
      },
      error:(err)=>{alert("Failed to Load Patient Data"+err);}
    })
  }

    formReset(){
    this.patientForm.reset();
    this.patientForm.patchValue({gender : ""});
    this.patientIdAfterSubmit=null;
  }
  get getFilteredPage(){

    return this.Patients.filter(a=>
     a.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
     a.phone.toLowerCase().includes(this.searchText.toLowerCase())
    );

  }

 get getPage(){
    const start= (this.page - 1) * this.pageSize;
    return this.getFilteredPage.slice(start, start + this.pageSize)

  }

  get totalPage(){
    return Math.ceil(this.getFilteredPage.length / this.pageSize)
  }

}
