import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-wishlist',
  templateUrl: './add-wishlist.component.html',
  styleUrls: ['./add-wishlist.component.scss']
})
export class AddWishlistComponent implements OnInit {
  currentUserData: any;
  wishListData: any;
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
        this.wishListData=res.addWishlistCount //this.currentUserData.wishlistProductIdDetails ? this.currentUserData.wishlistProductIdDetails : []
        this.cartListData=res.addCartlistCount//this.currentUserData.cartProductDetails ? this.currentUserData.cartProductDetails : []
      }else{
        this.wishListData=res.addWishlistCount || []
        this.cartListData=res.addCartlistCount || []
      } 
      console.log("Current user data",this.currentUserData)
      console.log("Wishlist product",this.wishListData)
    });
  }


  removeWishlist(list){
    let index=this.wishListData.findIndex(e=>e.productId==list.productId)
    this.wishListData.splice(index,1)
    this.util.setObservable('addWishlistCount',this.wishListData)
    if(this.currentUserData){
      this.updateCustomer('removeWishlist') 
    }else{
      let snackBarRef = this.snackBar.open("Wishlist removed successfully",'Close',{
        duration:5000
      });
    }
  
  }

  addToCart(row){
    if(this.currentUserData){
      // this.cartList=this.currentUserData.cartProductDetails || []
      if(this.cartListData.length){
        this.cartListData.forEach(e=>{
          if(e.productId==row._id){
             e['quantity']+=1
          }else{
            this.cartListData.push({
              "data": row,
              "productId":   row._id,
              "quantity": 1,
              "_id":   row._id
          })
          }
        })
      }else{
        this.cartListData.push({
          "data": row,
          "productId":  row._id,
          "quantity": 1,
          "_id":  row._id
      })
      }
      this.cartListData=this.util.unique(this.cartListData,['productId'])
      this.currentUserData.cartProductDetails=this.cartListData
      this.cartListData.map(e=>e.productId==row._id ? e['data']=row : false)
      this.util.setObservable('addCartlistCount',this.cartListData)
      // this.util.setObservable('currentUserData',this.currentUserData)
    }else{
      if(this.cartListData.length){
        this.cartListData.forEach(e=>{
          if(e.productId==row._id){
             e['quantity']+=1
          }else{
           return this.cartListData.push({
              "data":row,
              "quantity": 1,
              "_id":  row._id
          })
          }
        })
      }else{
        this.cartListData.push({
          "data": row,
          "quantity": 1,
          "_id": row._id
      })
      }
      this.cartListData=this.util.unique(this.cartListData,['_id'])
    }
    this.util.setObservable('addCartlistCount',this.cartListData)
    this.currentUserData && this.currentUserData.data ? this.updateCustomer('addToCart') :null
    this.router.navigate(['/jewel/cart'])
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
