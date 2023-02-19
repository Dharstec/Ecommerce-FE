import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { configurations } from 'src/assets/constant/config';

@Injectable({
  providedIn: 'root'
})
export class DataSetService {

  private globalObservables: any = {
    currentUserData: null,
    isApplicationLoaded: null,
    currentFiltered:null, // Used in all dasboards filter
    addWishlistCount:null, // Used in all dasboards filter
    addCartlistCount:null,
  }

  private cache = {
    organizationDetails:null,
    azureSubscriptionList:[],
    subscriptionList:[],
    deployedBlueprintProjectList:[],
    userInfo:null,
    userImage:null,
    currentProject:null,
    resourceTypeList:[],
    masterProviderList:[],
    providerList:[],
    applicationMonitorMenus:[]
  }

  //common observable for all components and functionalities
  private globalObj = new BehaviorSubject(this.globalObservables);
  globalValues = this.globalObj.asObservable();
  
  private cacheTrigger = new BehaviorSubject(null)
  cacheListener = this.cacheTrigger.asObservable();

  constructor() { }

  getCache(target, reset?: any) {
    let temp = this.cache.hasOwnProperty(target) ? this.cache[target] : null;
    if (reset) {
      this.cache[target] = null;
    }
    return temp;
  }

  setCache(target, value): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cache.hasOwnProperty(target)) {
        console.groupCollapsed('%c Cache  %c: ' + target + ' set ', configurations.cache, configurations.successValue);
        console.log(value);
        console.groupEnd();
        // if(this.ignoreConsole(target)){
        //   console.groupCollapsed('%c Cache  %c: ' + target + ' set ', configurations.cache, configurations.successValue);
        //   console.log(value);
        //   console.groupEnd();
        // }
        this.cache[target] = value;
        this.cacheTrigger.next(target);
        resolve(true);
      } else {
        console.warn(target + " cache not present");
        reject(false);
      }
    });
  }


   //sets the value to target key in global observable
   setObservable(target, value) {
    let curr = this.globalObj.getValue();
    if (curr.hasOwnProperty(target)) {
      curr[target] = value;
      this.globalObj.next(curr);
      console.groupCollapsed('%c Observable  %c: ' + target + ' set ', configurations.observable, configurations.successValue);
      console.log(value);
      console.groupEnd();
    } else {
      console.warn(target + " observable not found");
    }
  }

  getObservable(): Observable<any> {
    return this.globalValues;
  }

}
