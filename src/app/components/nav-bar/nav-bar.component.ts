import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';


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
  
  constructor(private api:ApiService,private router:Router,private util:UtilService) {
   }

  ngOnInit(): void {
    this.userLogin=true
  //   this._subscription = this.util.getCartData().subscribe((value) => {
  //     let temp=0
  //     value.forEach(e=>{
  //       temp+=e.quantity
  //     })
  //     this.cartListCount = temp
  // })
    this.activeNavBar='collections'
  }
  toggleSearchBar(){
        this.showSearchBar=!this.showSearchBar
  }
  selectedNavBar(val,url?:any){
    this.activeNavBar=val
    return this.router.navigate([url])
  }
  search(event?:any){
    let searchValue = event.target.value.toLowerCase()
    // if(searchValue) $(".search-expand").addClass('open')
    // else $(".search-expand").removeClass('open')
  }

  loginPage(){
    if(!this.userLogin){
      this.activeNavBar=''
      return this.router.navigate(['/jewel/login'])
    }else return
  }


}
