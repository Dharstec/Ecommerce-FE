import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';
declare var Razorpay: any; 

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.scss']
})
export class CustomerAddressComponent implements OnInit {
  cartListData: any;
  detailsForm: any;
  totalAmt: number;
  paymentPage:any
  couponCode:any
  productPolicies=[
    {img:'assets/lifetime_service.webp',Name:'Lifetime Plating Service'},
    {img:'assets/warranty.png',Name:'6 Month Warranty'},
    {img:'assets/returns.avif',Name:'30 Day Easy Returns'},
    {img:'assets/free_shipping.webp',Name:'Free Shipping'}
  ]
  userData: any;
  allcouponsList: any;
  discountAmt: any;
  subTotalAmt: any;

  payment_creation_id=null;
  razorPayOptions = {
    "key": '', // Enter the Key ID generated from the Dashboard
    "amount": 0, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
    "currency": "INR",
    "name": "Silver Jewellery",
    "description": "favouright bill payment",
    // "order_id":"ORDERID_FROM_BACKEND",
    "image": "https://example.com/your_logo",
    "handler": function (response) {
      console.log("this is the response ",response);
    },
    "notes": {
        "address": "Thank you for saving people in need"
    },
    "theme": {
        "color": "#8bf7a8"
    },
    // http_post:this.apiService
};


  constructor(private api:ApiService,private router:Router,private util:UtilService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {

    let userData = this.util.getObservable().subscribe((res) => {
      if(res.currentUserData && res.currentUserData.data){
        this.userData= res.currentUserData.data
        this.cartListData=res.addCartlistCount ? res.addCartlistCount : []

      }else{
        this.cartListData=res.addCartlistCount ? res.addCartlistCount : []
      }
      this.detailsForm= res.currentUserData ? this.util.getForm('customerAddress',res.currentUserData.data) : this.util.getForm('customerAddress')
      this.setTotalPrice()
      this.getCouponsCode()
    });
  }

  getCouponsCode(){
    this.api.getCall('Coupon/getCoupon').subscribe((res:any)=>{
      res.data.map(e=>{
        e['active']=false
      })
      this.allcouponsList=res.data
      console.log('Coupons get',res);
      
    }, err=>{
      console.log("error in get coupon code",err);
    })
  }
  addressSelection(val,data?:any,type?:any){
    this.detailsForm.get('addressType').setValue(val)
    if(val=='exist'){
      this.detailsForm.get('address').setValue(data.doorNoAndStreet ? data.doorNoAndStreet :'')
      this.detailsForm.get('cityName').setValue(data.city? data.city :'')
      this.detailsForm.get('stateName').setValue(data.state? data.state :'')
      this.detailsForm.get('pinCode').setValue(data.pincode? data.pincode :'')
      this.detailsForm.get('countryName').setValue(data.country? data.country :'')
      this.detailsForm.get('landmark').setValue(data.landmark? data.landmark :'')
    
    }
  }
  get addressList() {
    return this.detailsForm.get('addressArray') as FormArray;
  }
  paymentMethod(val){
    this.detailsForm.get('paymentType').setValue(val)
  }
  applyDiscount(row){
    this.allcouponsList.map(e=>e.active=false)
    this.totalAmt=this.subTotalAmt
    this.couponCode=row.couponName
   
    row['active']=true
    let percent=row.discountPercentage
    percent=percent.slice(0, -1)

    this.discountAmt=this.totalAmt*(Number(percent)/100)
    this.totalAmt-=this.discountAmt.toFixed(2)
    
  }
  removeCoupon(){
    this.allcouponsList.map(e=>e.active=false)
    this.couponCode=null
    this.totalAmt=this.subTotalAmt
  }

  setTotalPrice(){
    let val=0
    this.cartListData.forEach(e=>{
      val = val + (e.quantity*e.data.discountPrice) 
    })
    this.totalAmt=val
    this.subTotalAmt=val
  }
  saveAddress(event){
    let check=event.target.checked
    if(check){
      
    }else{

    }
  }

  async updateOrder(){
    console.log('user details', this.userData)
    console.log('list', this.cartListData);
    let form=this.detailsForm.getRawValue()
    console.log('form', form);
    if(!this.userData) return  this.router.navigate(['/jewel/login'])
    
    let body={
      "orderedBy": this.userData?._id, // customer Id
      "giftWrap": true,
      "customerName": `${ this.userData?.firstName} ${ this.userData?.lastName}`,
      "customerPhoneNumber": Number(this.userData.phoneNumber),
      "customerEmailId": this.userData.email,
      "customerAddress": {
          "doorNoAndStreet":form.address,
          "city":form.cityName,
          "state":form.stateName,
          "pincode":form.pinCode,
          "landmark":form.landmark,
          "country":form.countryName,
        },
      "orderStatus": "pending",
      "orders": [],
      "modeOfPayment":[{
            "mode": form.paymentType,
            "status": "0",
            "comment": "pending"
        }]
  }
  this.cartListData.map((e,i)=>{
    body['orders'].push({
        "productId": e._id,
        "quantity": e.quantity
    })
  })
  console.log('body',body);
  
    this.api.postCall('Order/createOrder',body).subscribe(async(res:any)=>{
      console.log("response for purchase ",res);
      // let payload = res.payload;
      if(res && res.data._id && this.totalAmt && form.paymentType=='razorPay'){
        this.razorPayOptions.key ='rzp_test_12TPBZPyRN4lxg';
        // this.razorPayOptions.order_id = res["data"]["_id"];
        this.razorPayOptions.amount = this.totalAmt*100;
        console.log("op",this.razorPayOptions)
        this.razorPayOptions.handler =  this.razorPayResponseHandler;
        var rzp1 = new Razorpay(this.razorPayOptions);
        rzp1.open();
        let snackBarRef = this.snackBar.open(res.message,'Close',{
          duration:5000
        });
        console.log('order created successful',res);
      }else{
        let snackBarRef = this.snackBar.open(res.message,'Close',{
          duration:5000
        });
      }
       form.addressType!='exist' ? await this.updateCustomer() :false


      
    // } 
  }, err=>{
    console.log("error in order creation",err);
  })
  }

  razorPayResponseHandler(response){
    const backend_url=''
    const paymentId = response.razorpay_payment_id;
    const url =  backend_url+'/razorpay/'+paymentId+'/'+this.razorPayOptions.amount+'/'; //+this.razorPayOptions.order_id
    console.log(paymentId)
    // Using my server endpoints to capture the payment
    fetch(url, {
    method: 'get',
    headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
    })
    .then(resp =>  resp.json())
    .then(function (data) {
            console.log('payement razor pay',data)
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
   }

   updateCustomer(type?:any){
    console.log(this.userData)
    let body;
    let form =this.detailsForm.getRawValue()
    if(this.userData.address.length){
      body={
        "_id": this.userData._id,
        "address":this.userData.address
      }
    }else{
      body={
        "_id": this.userData._id,
        "customerAddress": {
          "doorNoAndStreet":form.address,
          "city":form.cityName,
          "state":form.stateName,
          "pincode":form.pinCode,
          "landmark":form.landmark,
          "country":form.countryName,
        },
        "address":[],
      }
    }
    if(form.saveInfo){
      ///update the address
      body.address.push({
        "doorNoAndStreet":form.address,
        "city":form.cityName,
        "state":form.stateName,
        "pincode":form.pinCode,
        "landmark":form.landmark,
        "country":form.countryName,
      })
    }
    return this.api.putCall('Customer/updateCustomer',body).subscribe(async data=>{
      console.log('updated customer address',data)
    },err=>{
      console.log('error in update in customer data',err)
    })
  }

}
