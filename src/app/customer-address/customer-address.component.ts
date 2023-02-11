import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';

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
  productPolicies=[
    {img:'assets/lifetime_service.webp',Name:'Lifetime Plating Service'},
    {img:'assets/warranty.png',Name:'6 Month Warranty'},
    {img:'assets/returns.avif',Name:'30 Day Easy Returns'},
    {img:'assets/free_shipping.webp',Name:'Free Shipping'}
  ]
  userData: any;

  constructor(private api:ApiService,private router:Router,private util:UtilService) { }

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
    });

  }

  setTotalPrice(){
    let val=0
    this.cartListData.forEach(e=>{
      val = val + (e.quantity*e.data.discountPrice) 
    })
    this.totalAmt=val
  }

  updateOrder(){
    console.log('user details', this.userData)
    console.log('list', this.cartListData);
    
    if(!this.userData) return
    let body={
      "orderedBy": this.userData?._id, // customer Id
      "giftWrap": true,
      "customerName": `${ this.userData?.firstName} ${ this.userData?.lastName}`,
      "customerPhoneNumber": Number(this.userData.phoneNumber),
      "customerEmailId": this.userData.email,
      "customerAddress": this.userData.customerAddress,
      "orderStatus": [
          "pending"
      ],
      "orders": []
  }
  this.cartListData.map((e,i)=>{
    let name='order'+i
    e['orders'].push({
      'order1': {
        "produtDetails": e._id,
        "quantity": e.quantity
      }
    })
  })
  console.log('body',body);
  
    this.api.createorder(body).subscribe(res=>{
      console.log(res);
      
    })
  }

}
