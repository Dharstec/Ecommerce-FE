import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailId:any
  passcode:any
  newPasscode:any
  showForgot:any=false
  errorMessage: any;
  loginData: any;
  showVerifyOtp: boolean;
  otp:number
  showChangePassword: boolean;

  constructor(private api:ApiService,private router:Router,private util:UtilService) { }

  ngOnInit(): void {
  }

  signIn(){
    if(!this.showForgot){
      let body={
        "email":this.emailId,
        "password":this.passcode
      }
      this.api.CustomerLogin(body).subscribe(async (data:any)=>{
        if(data.status){
          this.loginData=data
          this.errorMessage=false
          await this.util.setObservable('currentUserData',data)
          this.router.navigate(['/jewel/product-collections'])
        }else{
          this.errorMessage=true
          this.loginData=data.message
        }
        console.log(data)
      }, err => {
        this.errorMessage=true
        this.loginData=err.error.message
      });
    }else{
      let body={
        "email": this.emailId
      }
      this.api.CustomerLoginForget(body).subscribe(async (data:any)=>{
        if(data.message=='reset your password'){
          this.showVerifyOtp=true
        }
        console.log(data)
      }, err => {
        // this.errorMessage=true
        // this.loginData=err.error.message
      })
    }

  }

  otpVerification(){
    this.api.verifyOTP(this.otp).subscribe(async (data:any)=>{
      if(data.status){
        this.showChangePassword=true
        this.showVerifyOtp=false
      }
      console.log(data)
    })
  }
  updatePassword(){
    let body={
      "email":this.emailId,
      "password":this.newPasscode
    }
    this.api.resetPassword(body).subscribe(async (data:any)=>{
      if(data.status){

        // this.showSuccessMsg=true
        this.router.navigate(['/jewel/login'])
      }
      // else this.showErrorMsg=true
      console.log(data)
    })
  }

}
