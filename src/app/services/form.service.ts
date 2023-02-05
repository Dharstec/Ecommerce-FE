import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  constructor(private formBuilder: FormBuilder) { }

  getForm(type, data?: any, def?: any) {
    switch (type) {
      case 'productFilter':{
        let tempForm = this.formBuilder.group({
          category:[null],
          stone:[null],
          style:[null],
          colour:[null],
          for:[null],
          sortBy:[null],
          minPrice:[null],
          maxPrice:[null],
        })
        return tempForm;
      }
      case 'customerDetails':{
        let tempForm = this.formBuilder.group({
          firstName:[data && data.firstName ? data.firstName : null,[Validators.required]],
          lastName:[data && data.lastName ? data.lastName : null,[Validators.required]],
          gender:[data && data.gender ? data.gender : 'Male',[Validators.required]],
          dob:[data && data.dateOfBirth ? data.dateOfBirth : null,[Validators.required]],
          phoneNo:[data && data.phoneNumber ? data.phoneNumber : null,[Validators.required,Validators.maxLength(10),Validators.pattern(this.numberRegEx)]],
          emailId:[data && data.email ? data.email : null,[Validators.required,Validators.email]],
          passcode:[data && data.password ? data.password : null,[Validators.required]],
        })
        return tempForm;
      }
      case 'customerAddress':{
        let tempForm = this.formBuilder.group({
          firstName:[data && data.firstName ? data.firstName : null,[Validators.required]],
          lastName:[data && data.lastName ? data.lastName : null,[Validators.required]],
          phoneNo:[data && data.phoneNumber ? data.phoneNumber : null,[Validators.required,Validators.maxLength(10),Validators.pattern(this.numberRegEx)]],
          emailId:[data && data.email ? data.email : null,[Validators.required,Validators.email]],
          countryName:[data && data.countryName ? data.countryName : null,[Validators.required]],
          cityName:[data && data.cityName ? data.cityName : null,[Validators.required]],
          stateName:[data && data.stateName ? data.stateName : null,[Validators.required]],
          pinCode:[data && data.pinCode ? data.pinCode : null,[Validators.required]],
          address:[data && data.address ? data.address : null,[Validators.required]],
          saveInfo:[data && data.saveInfo ? data.saveInfo : null],
        })
        return tempForm;
      }
      case 'pushSort':{
        return this.addSortArray(data);
      }
    }
  }
  addSortArray(data?:any){
    let tempForm = this.formBuilder.group({
      name :[data && data.item_id ? data.item_id : null],
      value :[false],
    })
    return tempForm;
  }
}
