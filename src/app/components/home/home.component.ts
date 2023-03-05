import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  productList: any;
  allProductList: any;
  listByCategory: any[];
  giftProducts: any[];
  listByColour: any=[
    {img:"assets/color/1.svg", colour:'Silver'},
    {img:"assets/color/2.svg", colour:'Rose Gold'},
    {img:"assets/color/3.svg", colour:'Gold'},
    {img:"assets/color/4.svg", colour:'Oxidised Silver'}
  ];
  listByStyle: any=[
    {img:"assets/circle/1.svg", style:'Everyday'},
    {img:"assets/circle/2.svg", style:'Office'},
    {img:"assets/circle/3.svg", style:'Party'},
    {img:"assets/circle/4.svg", style:'Traditional & Wedding'},
    // {img:"assets/circle/5.svg", style:'Wedding'},
    // {img:"assets/circle/6.svg", colour:'Rose Gold'},
    // {img:"assets/color/3.svg", colour:'Gold'},
    // {img:"assets/color/4.svg", colour:'Oxidised Silver'},
  ];

  constructor(private util:UtilService,private api:ApiService,private router:Router,private fb:FormBuilder, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show()
    this.api.getCall('Product/getProduct').subscribe(async (data:any)=>{
      console.log(data)
      this.productList=data.data
      await this.getlistByCategory()
      this.spinner.hide()
      // this.productList=this.productList
      // this.allProductList=this.productList
    })
  }
  getlistByCategory(){
    this.listByCategory=[]
    this.giftProducts=[]
    // this.listByColour=[]
    // this.listByStyle=[]
    this.productList.map(e=>{
      if(e.gift){
        this.giftProducts.push(e)
      }
      this.listByCategory.push({
        data:e,
        category:e.category[0].toLowerCase()
      })
      // this.listByColour.push({
      //   data:e,
      //   colour:e.colour[0].toLowerCase()
      // })
      // this.listByStyle.push({
      //   data:e,
      //   style:e.style[0].toLowerCase()
      // })
    })
    console.log('',this.listByCategory);
    console.log('',this.listByColour);
    // this.listByStyle=this.util.unique(this.listByStyle,['style'])
    // this.listByColour=this.util.unique(this.listByColour,['colour'])
    this.listByCategory=this.util.unique(this.listByCategory,['category'])
  }

  getSelectedCollection(row){
    return this.router.navigate(['/jewel/product-collections'],{state : {row}})
  }
  routeToDetails(data?:any){
    let productName=data.productName.replace(/\s/g,'-')
    let url=`/jewel/product-collections/details/${productName}`
    return this.router.navigate([url],{state : {data}})

    // return this.router.navigate([url],{queryParams:{productDetails:{...data}},  skipLocationChange: true})
}
  

}
