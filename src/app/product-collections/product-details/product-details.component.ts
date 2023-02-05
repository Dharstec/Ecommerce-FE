import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  currentProductDetails:any
  productPolicies=[
    {img:'assets/lifetime_service.webp',Name:'Lifetime Plating Service'},
    {img:'assets/warranty.png',Name:'6 Month Warranty'},
    {img:'assets/returns.avif',Name:'30 Day Easy Returns'},
    {img:'assets/free_shipping.webp',Name:'Free Shipping'}
  ]
  currentUserData: any;
  cartList: any=[];
  wishList: any=[];
  addToWishlist: boolean=false;
  productList: any;
  constructor(private api:ApiService,private router:Router,private util:UtilService) {
    
   }

  async ngOnInit(): Promise<void>  {
    this.currentProductDetails=history.state.data
    console.log(history.state)
    let userData = this.util.getObservable().subscribe((res) => {
      if(res.currentUserData && res.currentUserData){
        this.currentUserData = res.currentUserData
        this.wishList=res.addWishlistCount ? res.addWishlistCount : []
        this.cartList=res.addCartlistCount ? res.addCartlistCount : []
        this.wishList.forEach(e=>{
          this.addToWishlist=this.currentProductDetails.productId==e?._id && !this.addToWishlist ? true : false
        })
      }else{
        this.wishList=res.addWishlistCount || []
        this.cartList=res.addCartlistCount || []
        this.wishList.forEach(e=>{
          this.addToWishlist=this.currentProductDetails.productId==e?._id && !this.addToWishlist? true : false
        }) 
      }
  
    });

    // await this.getAllProduct()
    // $('.product-details').animate({scrollTop:0});
  }
  subMenuOpen(id){
    $('#' + id).toggleClass('open').siblings().slideToggle(300);
  }

  addToCart(){
    if(this.currentUserData){
      // this.cartList=this.currentUserData.cartProductDetails || []
      if(this.cartList.length){
        this.cartList.forEach(e=>{
          if(e.productId==this.currentProductDetails.productId){
             e['quantity']+=1
          }else{
            this.cartList.push({
              "productId":   this.currentProductDetails.productId,
              "quantity": 1,
              "_id":   this.currentProductDetails.productId
          })
          }
        })
      }else{
        this.cartList.push({
          "productId":   this.currentProductDetails.productId,
          "quantity": 1,
          "_id":   this.currentProductDetails.productId
      })
      }
      this.cartList=this.util.unique(this.cartList,['_id'])
      this.currentUserData.cartProductDetails=this.cartList
      this.cartList.map(e=>e.productId==this.currentProductDetails.productId ? e['data']=this.currentProductDetails : false)
      this.util.setObservable('addCartlistCount',this.cartList)
      // this.util.setObservable('currentUserData',this.currentUserData)
    }else{
      if(this.cartList.length){
        this.cartList.forEach(e=>{
          if(e.productId==this.currentProductDetails.productId){
             e['quantity']+=1
          }else{
           return this.cartList.push({
              "data": this.currentProductDetails,
              "quantity": 1,
              "_id":   this.currentProductDetails.productId
          })
          }
        })
      }else{
        this.cartList.push({
          "data": this.currentProductDetails,
          "quantity": 1,
          "_id":   this.currentProductDetails.productId
      })
      }
      this.cartList=this.util.unique(this.cartList,['_id'])
    }
    this.util.setObservable('addCartlistCount',this.cartList)
    this.router.navigate(['/jewel/cart'])
  }

  async BuyItNow(){
    await this.addToCart()
    this.router.navigate(['/jewel/customer-address'])
  }

  async addWishlist(){
    // this.addToWishlist=!this.addToWishlist
    if(this.currentUserData){
      // this.wishList=this.currentUserData.cartProductDetails || []

      this.wishList.push({
          "_id":   this.currentProductDetails.productId,
          "data": this.currentProductDetails,
      })
      this.wishList=this.util.unique( this.wishList,['_id'])
      let formatedWish= this.wishList.map(e=>e._id)
      this.currentUserData.wishlistProductIdDetails=formatedWish
      this.util.setObservable('addWishlistCount',this.wishList)
      // this.util.setObservable('currentUserData',this.currentUserData)
    }else{
      this.wishList.push({
        "_id":   this.currentProductDetails.productId,
        "data": this.currentProductDetails,
    })

      this.wishList=this.util.unique(this.wishList,['_id'])
      this.util.setObservable('addWishlistCount',this.wishList)
    }
    this.router.navigate(['/jewel/add-to-wishlist'])
  }

  async getAllProduct(){
    return this.api.getProductData().subscribe(async (data:any)=>{
      console.log(data)
      this.productList=data
      this.productList=this.productList.data
      this.productList.forEach(e=> e['wishList']=false)
    })
  }

}
