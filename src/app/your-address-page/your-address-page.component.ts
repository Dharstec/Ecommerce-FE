import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-your-address-page',
  templateUrl: './your-address-page.component.html',
  styleUrls: ['./your-address-page.component.scss']
})
export class YourAddressPageComponent implements OnInit {
  userData: any;

  constructor(private api:ApiService,private router:Router,private util:UtilService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    let userData = this.util.getObservable().subscribe((res) => {
      if(res.currentUserData && res.currentUserData.data){
        this.userData= res.currentUserData.data
        // this.cartListData=res.addCartlistCount ? res.addCartlistCount : []
      }
      // this.detailsForm= res.currentUserData ? this.util.getForm('customerAddress',res.currentUserData.data) : this.util.getForm('customerAddress')
      console.log(this.userData);
  
    });
  }

}
