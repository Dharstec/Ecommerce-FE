import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
const   rootUrl = `${environment.baseURL}`;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

    
  public getCall(url: any) {
    return this.http.get<any>(`${rootUrl}${url}`)
      .pipe(catchError(this.errroHandler))
  }

  public postCall(uri: any, body: any) {
    const url = `${rootUrl}${uri}`;
    return this.http.post<any>(url, body)
      .pipe(catchError(this.errroHandler))
  }
  public putCall(uri: any, body: any) {
    const url = `${rootUrl}${uri}`;
    return this.http.put<any>(url, body)
      .pipe(catchError(this.errroHandler))
  }


  public errroHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  getProductData(){
    // `${rootUrl}${url}`
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
  CustomerUpdate(body){
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
  //order
  createorder(body){
    let url=`https://ecommerce-kxhu.onrender.com/Order/createOrder`;
    return this.http.post(url,body);
  }
}
