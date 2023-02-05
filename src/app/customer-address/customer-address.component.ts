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

  constructor(private api:ApiService,private router:Router,private util:UtilService) { }

  ngOnInit(): void {

    let userData = this.util.getObservable().subscribe((res) => {
      if(res.currentUserData && res.currentUserData.data){
        let data = res.currentUserData.data
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

}
