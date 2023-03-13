import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilService } from '../services/util.service';
import { MatDialog } from '@angular/material/dialog';
import { RemoveAddressPopupComponent } from './remove-address-popup/remove-address-popup.component';

@Component({
  selector: 'app-your-address-page',
  templateUrl: './your-address-page.component.html',
  styleUrls: ['./your-address-page.component.scss']
})
export class YourAddressPageComponent implements OnInit {
  userData: any;
  isEdit: boolean;
  editForm: any;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  passwordRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
  currentUserIndex: any;

  constructor(private api:ApiService,private router:Router,private util:UtilService,private snackBar:MatSnackBar,
    private formBuilder:FormBuilder,
    public  dialog:MatDialog,
    ) { }

  ngOnInit(): void {
    let userData = this.util.getObservable().subscribe((res) => {
      if(res.currentUserData && res.currentUserData.data){
        this.userData=res.currentUserData.data
        // this.cartListData=res.addCartlistCount ? res.addCartlistCount : []
      }
      // this.detailsForm= res.currentUserData ? this.util.getForm('customerAddress',res.currentUserData.data) : this.util.getForm('customerAddress')
      console.log(this.userData);
  
    });
  }

  editAddress(data,i){
    this.editForm = this.formBuilder.group({
      firstName:[data.firstName ? data.firstName : null,[Validators.required]],
      lastName:[data.lastName ? data.lastName : null,[Validators.required]],
      countryName:[data.country ? data.country : null,[Validators.required]],
      cityName:[data.city ? data.city : null,[Validators.required]],
      pinCode:[data.pincode ? data.pincode : null,[Validators.required,Validators.maxLength(6),Validators.pattern(this.numberRegEx)]],
      stateName:[data.state ? data.state : null,[Validators.required]],
      address:[data.doorNoAndStreet ? data.doorNoAndStreet : null,[Validators.required]],
      landmark:[data.landmark ? data.landmark : null,[Validators.required]],
      phoneNo:[data.phoneNo ? data.phoneNo : null,[Validators.required,Validators.maxLength(10),Validators.pattern(this.numberRegEx)]],
    })
    this.isEdit=true
    this.currentUserIndex=i
  }

  openConfirmDialog(row?:any,i?:any){
    this.currentUserIndex=i
    let dialog = this.dialog.open(RemoveAddressPopupComponent, {
      minWidth: '30vw',
      disableClose: true,
      data:{
        "currentAddress":row,
      }
    })
    dialog.afterClosed().subscribe((e:any)=>{
      console.log('from dialog data',e?.data.response)
      e?.data.response=='yes' ? this.deleteAddress(e?.data.address) : null
    })
  }

  deleteAddress(data){
    // let index=this.userData.address.findIndex(e=>e.doorNoAndStreet==data.doorNoAndStreet)
    this.userData.address.splice(this.currentUserIndex,1)
    this.updateCustomer('delete')
  }

  saveEdit(){
    let form =this.editForm.getRawValue()
    this.userData.address[this.currentUserIndex]['country']=form.countryName
    this.userData.address[this.currentUserIndex]['city']=form.cityName
    this.userData.address[this.currentUserIndex]['state']=form.stateName
    this.userData.address[this.currentUserIndex]['pincode']=form.pinCode
    this.userData.address[this.currentUserIndex]['doorNoAndStreet']=form.address
    this.userData.address[this.currentUserIndex]['landmark']=form.landmark
    this.updateCustomer('edit')
  }

  updateCustomer(type?:any){
    let body={
      "email": this.userData.email,
      "address": this.userData.address,
     }
   
    return this.api.putCall('Customer/updateCustomer',body).subscribe(async data=>{
      let snackBarRef = this.snackBar.open(type=='edit'?"Address saved successfully":'Address deleted successfully','Close',{
        duration:3000
      });
      this.isEdit=false
    },err=>{
      console.log('error in update in customer data',err)
    })
  }

}
