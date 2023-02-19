import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  productList: any;

  constructor(private api:ApiService,private router:Router,private util:UtilService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getproductlist()
  }

  signIn(){
    if(!this.showForgot){
      let body={
        "email":this.emailId,
        "password":this.passcode
      }
      this.api.postCall('Customer/loginCustomer',body).subscribe(async (data:any)=>{
        if(data.status){
          this.loginData=data
          this.errorMessage=false 
          if(this.loginData.data.cartProductDetails){
            this.loginData.data.cartProductDetails.map(e=>{
              this.productList.forEach(y=>{
                if(e.productId==y._id || e._id==y._id ){
                  e['data']=y
                }
              })
            })
          }else this.loginData.data.cartProductDetails =[]
          if(this.loginData.data.wishlistProductIdDetails){
            this.loginData.data.wishlistProductIdDetails.map((e,i)=>{
              this.productList.forEach(y=>{
                if(e==y._id){
                  this.loginData.data.wishlistProductIdDetails[i]={
                    _id:e,
                    data:y
                  }
                }
              })
            })
          }else this.loginData.data.wishlistProductIdDetails=[]
          
          
          this.util.setObservable('addWishlistCount',this.loginData.data.wishlistProductIdDetails)
          this.util.setObservable('addCartlistCount',this.loginData.data.cartProductDetails)
          this.util.setObservable('currentUserData',data)
          localStorage.setItem('user_data',JSON.stringify(this.loginData.data))
          sessionStorage.setItem('access-token',this.loginData.token)
          sessionStorage.setItem('user_id',this.loginData.data._id)
          sessionStorage.setItem('user_pw',this.passcode)
          sessionStorage.setItem('user_name',this.loginData.data.email)
          let snackBarRef = this.snackBar.open("Login Successfully",'Close',{
            duration:5000
          });
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
      this.api.postCall('Customer/loginCustomer',body).subscribe(async (data:any)=>{
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

  getproductlist(){
    return this.api.getCall('Product/getProduct').subscribe(async data=>{
      this.productList=data.data
      console.log(data)
    })
  }

  otpVerification(){
    let url=`Customer/verifyCustomerOtp/${this.otp}`
    this.api.getCall(url).subscribe(async (data:any)=>{
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
    this.api.postCall('Customer/resetPassword',body).subscribe(async (data:any)=>{
      if(data.status==1){
        let snackBarRef = this.snackBar.open(data.message,'Close',{
          duration:3000
        });
        // this.showSuccessMsg=true
        this.router.navigate(['/jewel/login'])
      }
      // else this.showErrorMsg=true
      console.log(data)
    })
  }

}
