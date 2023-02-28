import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  currentUserData: any;
  orderList: any=[];
  productCount:any=1
  totalAmt: number;
  productPolicies=[
    {Name:'Lifetime Plating Service'},
    {Name:'6 Month Warranty'},
    {Name:'30 Day Easy Returns'},
    {Name:'Free Shipping'}
  ]
  cartListData: any=[];

  constructor(private api:ApiService,private router:Router,private util:UtilService, private snackBar:MatSnackBar) { }

  ngOnInit(): void {
   
    let userData = this.util.getObservable().subscribe((res) => {
      if(res.currentUserData && res.currentUserData.data){
        this.currentUserData = res.currentUserData.data
       // this.wishListData=res.addWishlistCount //this.currentUserData.wishlistProductIdDetails ? this.currentUserData.wishlistProductIdDetails : []
       // this.cartListData=res.addCartlistCount//this.currentUserData.cartProductDetails ? this.currentUserData.cartProductDetails : []
      }else{
     //   this.wishListData=res.addWishlistCount || []
      //  this.cartListData=res.addCartlistCount || []
      } 
      console.log("Current user data",this.currentUserData)
      // console.log("Wishlist product",this.wishListData)
      this.getOrderList()
    });
  }

  
  // removeWishlist(list){
  //   let index=this.wishListData.findIndex(e=>e.productId==list.productId)
  //   this.wishListData.splice(index,1)
  //   this.util.setObservable('addWishlistCount',this.wishListData)
  //   if(this.currentUserData){
  //     this.updateCustomer('removeWishlist') 
  //   }else{
  //     let snackBarRef = this.snackBar.open("Wishlist removed successfully",'Close',{
  //       duration:5000
  //     });
  //   }
  
  // }

getOrderList(){
  // console.log(this.currentUserData)
 
  return this.api.getCall('Order/getAllOrder').subscribe(async data=>{
    let user_id=sessionStorage.getItem('user_id')
    this.orderList=data.data.filter(e=>e.orderedBy!=null ? e.orderedBy._id==user_id :false)
    console.log('hhhhhhhhhhh',this.orderList)
  },err=>{
    console.log('error in get all order list',err)
  })
}

  updateCustomer(type?:any){
    console.log(this.currentUserData)
    let body;
    if(type=='addToCart'){
      let temp=_.cloneDeep(this.currentUserData.cartProductDetails)
      temp.map(e=>{
        delete e.data
        delete e._id
      })
      body={
        // "_id": this.currentUserData.data._id,
        "email": this.currentUserData.email,
        "cartProductDetails": temp,
    }
    }else{
      let temp=_.cloneDeep(this.currentUserData.wishlistProductIdDetails)
      temp.map(e=>{
        delete e.data
      })
      body={
        // "_id": this.currentUserData.data._id,
        "email": this.currentUserData.email,
        "wishlistProductIdDetails": temp,
    }
    }
   
    return this.api.putCall('Customer/updateCustomer',body).subscribe(async data=>{
      let snackBarRef = this.snackBar.open(type=='addToCart'?"Removed from cart successfully":'Wishlist removed successfully','Close',{
        duration:5000
      });
      console.log(data)
    },err=>{
      console.log('error in update in customer data',err)
    })
  }


}
