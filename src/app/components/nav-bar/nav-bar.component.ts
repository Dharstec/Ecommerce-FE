import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  searchText:any
  activeNavBar:any
  emailId:any
  productList:any
  showSearchBar:any
  wishListCount:number=0
  cartListCount:number=0
  private _subscription: any;
  userLogin: boolean;
  categoryDropdownList: any;
  stoneDropdownList: any;
  colourDropdownList: any;
  styleDropdownList: any;
  forDropdownList: any;
  sortByDropdownList: any;
  userData: any;
  
  constructor(private api:ApiService,private router:Router,private util:UtilService,private changeDetectorRefs: ChangeDetectorRef,private zone:NgZone) {
   }

  ngOnInit(): void {
    this.userData = this.util.getObservable().subscribe((res) => {
      if(res.currentUserData && res.currentUserData.data){
        let data = res.currentUserData.data
        this.wishListCount=res.addWishlistCount ? res.addWishlistCount.length : 0
        this.cartListCount=res.addCartlistCount ? res.addCartlistCount.length : 0
        this.userLogin=true
      }else{
        this.userLogin=false
        this.wishListCount=res.addWishlistCount ? res.addWishlistCount.length : 0
        this.cartListCount=res.addCartlistCount ? res.addCartlistCount.length : 0
      }
    });
    let result =localStorage.getItem('user_data');
      let data;
      if(result){
        let val=JSON.parse(result)
        data=val?.data
        this.util.setObservable('currentUserData',data) 
        this.userLogin=true
      }else this.userLogin=false



    this.categoryDropdownList =this.util.getStatic('categoryDropdown');
    this.stoneDropdownList = this.util.getStatic('stoneDropdown') ;
    this.colourDropdownList = this.util.getStatic('colourDropdown');
    this.styleDropdownList = this.util.getStatic('styleDropdown') ;
    this.forDropdownList = this.util.getStatic('forDropdown') ;
    this.sortByDropdownList = this.util.getStatic('sortByDropdown') ;

    this.activeNavBar='collections'
  }
  // ngAfterViewInit(){
  //      this.util.getCurrentUserData().subscribe((data) => {
  //     this.userLogin= data ? true :false
  //     this.changeDetectorRefs.detectChanges();
  //    })
  // }
  toggleSearchBar(){
        this.showSearchBar=!this.showSearchBar
  }
  selectedNavBar(val,url?:any){
    this.activeNavBar=val
    return this.router.navigate([url],{queryParams:{type:val}})
  }
  search(event?:any){
    let searchValue = event.target.value.toLowerCase()
    // if(searchValue) $(".search-expand").addClass('open')
    // else $(".search-expand").removeClass('open')
  }
  getSelectedCollection(row){
    return this.router.navigate(['/jewel/product-collections'],{state : {row}})
  }

  loginPage(){
    if(!this.userLogin){
      this.activeNavBar=''
      return this.router.navigate(['/jewel/login']) 
    }else return
  }

  logOut(){
       this.util.setObservable('currentUserData',null)
       this.util.setObservable('addWishlistCount',null)
       this.util.setObservable('addCartlistCount',null)
      //  localStorage.removeItem('user_data')
       localStorage.clear()
       sessionStorage.clear()
       this.userLogin=false
       return this.router.navigate(['/jewel/login']) 
  }


}
