import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  firstName:any
  lastName:any
  emailId:any
  passcode:any
  registerForm: any;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  loginStatus: Object;
  showVerifyOtp: boolean=false;
  currentDate:any;
  showErrorMsg: boolean;
  showSuccessMsg: boolean=false;
  showResendOtp: boolean;
  constructor(private formBuilder: FormBuilder,private api:ApiService,private router:Router) { }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.registerForm = this.formBuilder.group({
      firstName:[null,[Validators.required]],
      lastName:[null,[Validators.required]],
      gender:['Male',[Validators.required]],
      dob:[null,[Validators.required]],
      phoneNo:[null,[Validators.required,Validators.maxLength(10),Validators.pattern(this.numberRegEx)]],
      emailId:[null,[Validators.required,Validators.email]],
      passcode:[null,[Validators.required]],
      otp:[null],
    })
  }

  setGender(type){
    // let value = type == 'yes' ? true : false
    this.registerForm.get('gender').setValue(type)
  }
  getDOB(event){
    let val=event.target.value
    this.registerForm.get('dob').setValue(val)

  }

  newRegister(){
    let form=this.registerForm.getRawValue()
    let body={
      "firstName":form.firstName,
      "lastName":form.lastName,
      "phoneNumber":Number(form.phoneNo),
      "password":form.passcode,
      "email":form.emailId,
      "gender":form.gender,
      "dateOfBirth":form.dob,
      "customerAddress":"",
      "wishlistProductIdDetails":null,
      "cartProductDetails":null,
      "orderHistory":null  
    }

    this.api.CustomerSignUp(body).subscribe(async (data:any)=>{
      console.log(data)
      if(data.status==1){
        this.showVerifyOtp=true
        this.showResendOtp=false
      }else if(data.message=='Already Use These Email'){
        this.showResendOtp=true
      }else this.showErrorMsg=true
    })
  }
  resendOtp(){
    let form=this.registerForm.getRawValue()
    let body={
      "email":form.emailId,
    }
    this.api.resendOTP(body).subscribe(async (data:any)=>{
      console.log(data)
      if(data.status==1){
        this.showVerifyOtp=true
      }
    })
  }

  otpVerification(){
    let form=this.registerForm.getRawValue()
    this.api.verifyOTP(form.otp).subscribe(async (data:any)=>{
      if(data.status){
        this.showSuccessMsg=true
        this.router.navigate(['/jewel/product-collections'])
      }else this.showErrorMsg=true
      console.log(data)
    })
  }

}
