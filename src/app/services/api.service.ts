import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  getProductData(){
    let url='https://ecommerce-kxhu.onrender.com/Product/getProduct';
    return this.http.get(url);
  }
  CustomerLogin(body){
    let url='https://ecommerce-kxhu.onrender.com/Customer/loginCustomer';
    return this.http.post(url,body);
  }
  CustomerLoginForget(body){
    let url='https://ecommerce-kxhu.onrender.com/Customer/forgetPassword';
    return this.http.post(url,body);
  }
  CustomerSignUp(body){
    let url='https://ecommerce-kxhu.onrender.com/Customer/customerSignup';
    return this.http.post(url,body);
  }
  CustomerUpdateLogin(body){
    let url='https://ecommerce-kxhu.onrender.com/Customer/updateCustomer';
    return this.http.post(url,body);
  }
  verifyOTP(otp){
    let url=`https://ecommerce-kxhu.onrender.com/Customer/verifyCustomerOtp/${otp}`;
    return this.http.get(url);
  }
  resendOTP(body){
    let url=`https://ecommerce-kxhu.onrender.com/Customer/resendOtp`;
    return this.http.post(url,body);
  }
  resetPassword(body){
    let url=`https://ecommerce-kxhu.onrender.com/Customer/resetPassword`;
    return this.http.post(url,body);
  }
}
