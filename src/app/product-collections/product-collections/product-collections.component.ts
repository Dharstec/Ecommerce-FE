import { Component, HostListener, Input, OnInit, ViewChild,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder,FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UtilService} from 'src/app/services/util.service';
import * as $ from 'jquery';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-product-collections',
  templateUrl: './product-collections.component.html',
  styleUrls: ['./product-collections.component.scss']
})
export class ProductCollectionsComponent implements OnInit {
  @ViewChild('stickyMenu') menuElement: ElementRef;
  productList:any=[]
  categoryDropdownList:any;
  stoneDropdownList:any;
  colourDropdownList:any;
  styleDropdownList:any;
  forDropdownList:any;
  sortByDropdownList:any;
  // dropdownSettings:IDropdownSettings={};

  minValue: number = 0;
  maxValue: number = 10000;
  slideOptions: Options = {
    floor: 0,
    ceil: 10000,
    step: 100,
    showTicks: true
  };
  
  setMinValue: any;
  setMaxValue: any;
  filterForm: FormGroup;
  allProductList: any;
  filterSelected: boolean;
  selectedFilterList: any[];
  sortByFilter:any
  sticky: boolean;
  elementPosition: any;
  prevId:any;
  pageType: any;

  constructor(private util:UtilService,private api:ApiService,private router:Router,private activeRoute:ActivatedRoute,private fb:FormBuilder,private spinner:NgxSpinnerService) {
   }
   @HostListener('window:scroll', ['$event'])
   handleScroll(){
       const windowScroll = window.pageYOffset;
       if(windowScroll >= (this.elementPosition-70)){
           this.sticky = true;
       } else {
           this.sticky = false;
       }
   }
  async ngOnInit(): Promise<void> {
    this.activeRoute.queryParams.subscribe(res=>{
      console.log('ssssssss',res.type)
      this.pageType=res.type
    })
    this.spinner.show()
    this.filterForm= this.util.getForm('productFilter')
    this.sortByFilter='FEATURED'
    this.api.getCall('Product/getProduct').subscribe(async data=>{
      console.log(data)
      this.productList=data
      this.productList=this.productList.data
      this.allProductList=this.productList
      if(this.pageType=='gift'){
        this.productList = this.productList.filter(e=>e.gift)
        console.log('gift product',this.productList )
      }else if(this.pageType=='personalised'){
        this.productList = this.productList.filter(e=>e.personalised)
        console.log('Personalised product',this.productList )
      }else if(this.pageType=='arrivals'){
        this.productList = this.productList.filter(e=>e.latest)
        console.log('New arrived product',this.productList )
      }
     setTimeout(() => {
        this.spinner.hide();
    }, 2000);

      await this.getFilterDropDownData()
      // this.spinner.hide();
    })
    
    // let data=history.state.row
    // console.log(data)
    // this.api.getLoginData().subscribe(async data=>{
    //   console.log(data)
    // })
  }
  ngAfterViewInit(){
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  routedfromNav(){
    
  }

   getFilterDropDownData(){
    this.categoryDropdownList =this.util.getStatic('categoryDropdown');
    this.stoneDropdownList = this.util.getStatic('stoneDropdown') ;
    this.colourDropdownList = this.util.getStatic('colourDropdown');
    this.styleDropdownList = this.util.getStatic('styleDropdown') ;
    this.forDropdownList = this.util.getStatic('forDropdown') ;
    this.sortByDropdownList = this.util.getStatic('sortByDropdown') ;
    //count category items
    this.categoryDropdownList.map((e:any)=>{
      e.count=0
      this.productList.map((x:any)=>{
        x.category.map((l:any)=>{
          if(e.item_text.toLowerCase()==l.toLowerCase()){
            e.count+=1
          }
        })
      })
       e['field_name']=`${e.item_text} (${e.count})`
    })
    // set range in price
    let data=this.productList.sort((x,y)=>{
      let a=x.discountPrice
      let b=y.discountPrice
      return a-b
    })
    this.minValue = data[0].discountPrice;
    this.maxValue= data[data.length-1].discountPrice
    this.setMinValue=this.minValue
    this.setMaxValue=this.maxValue
    this.slideOptions.floor=data[0].discountPrice;
    this.slideOptions.ceil=data[data.length-1].discountPrice
    //count colour items
    this.stoneDropdownList.map((e:any)=>{
      e.count=0
      this.productList.map((x:any)=>{
        x.stone.map((l:any)=>{
          if(e.item_text.toLowerCase()==l.toLowerCase()){
            e.count+=1
          }
        })
      })
       e['field_name']=`${e.item_text} (${e.count})`
    })
      //count colour items
      this.colourDropdownList.map((e:any)=>{
        e.count=0
        this.productList.map((x:any)=>{
          x.colour.map((l:any)=>{
            if(e.item_text.toLowerCase()==l.toLowerCase()){
              e.count+=1
            }
          })
        })
         e['field_name']=`${e.item_text} (${e.count})`
      })
        //count style items
        this.styleDropdownList.map((e:any)=>{
          e.count=0
          this.productList.map((x:any)=>{
            x.style.map((l:any)=>{
              if(e.item_text.toLowerCase()==l.toLowerCase()){
                e.count+=1
              }
            })
          })
           e['field_name']=`${e.item_text} (${e.count})`
        })
       //count for items
       this.forDropdownList.map((e:any)=>{
        e.count=0
        this.productList.map((x:any)=>{
          x.for.map((l:any)=>{
            if(e.item_text.toLowerCase()==l.toLowerCase()){
              e.count+=1
            }
          })
        })
         e['field_name']=`${e.item_text} (${e.count})`
      })
 
    //  return this.dropdownSettings = {
    //   idField: 'item_id',
    //   textField: 'field_name',
    //   enableCheckAll: false,
    //   allowSearchFilter: true,
    //   itemsShowLimit: 1,
    // };
  }
  async getFilterData(event,data?:any,type?:any){
    let checked = type!='remove' ? event.target.checked :false
    data.checked = checked ? true:false
    let prevType;
    let temp=[]
    if(type=='remove'||!checked){
      let index=this.selectedFilterList.findIndex(e=>e.item_id==data.item_id)
      this.selectedFilterList.splice(index,1)
    }
  
    // let list=[]
    this.selectedFilterList=!this.selectedFilterList || type=='remove' ? [] : this.selectedFilterList
    let productList=!this.selectedFilterList.length?this.allProductList : this.productList
    let mergeList=[...this.categoryDropdownList,...this.styleDropdownList,...this.colourDropdownList,...this.stoneDropdownList,...this.forDropdownList]
    // this.allProductList.forEach(e=>{
    //   mergeList.map(x=>{
    //     e.category.map(y=>{
    //       if(x.item_id.toLowerCase()==y.toLowerCase() && x.checked){
    //         temp.push(e)
    //         this.selectedFilterList.push(y)
    //       }
    //     })
    //   })
    
    // })
    // switch(type){
    //   case 'category':{
    //     productList.forEach(e=>{
    //       e.category.map(x=>{
    //         this.categoryDropdownList.forEach(y=>{
    //           if(y.item_id.toLowerCase()==x.toLowerCase() && y.checked){
    //             temp.push(e)
    //             this.selectedFilterList.push(y)
    //           }
    //         })
    //       })
    //     })
    //     break;      
    //   }
    //   case 'stone':{
    //     productList.forEach(e=>{
    //       e.stone.map(x=>{
    //         this.stoneDropdownList.forEach(y=>{
    //           if(y.item_id.toLowerCase()==x.toLowerCase() && y.checked){
    //             temp.push(e)
    //             this.selectedFilterList.push(y)
    //           }
    //         })
    //       })
    //     })
    //     break;      
    //   }
    //   case 'colour':{
    //     productList.forEach(e=>{
    //       e.colour.map(x=>{
    //         this.colourDropdownList.forEach(y=>{
    //           if(y.item_id.toLowerCase()==x.toLowerCase() && y.checked){
    //             temp.push(e)
    //             this.selectedFilterList.push(y)
    //           }
    //         })
    //       })
    //     })
    //     break;      
    //   }
    //   case 'style':{
    //     productList.forEach(e=>{
    //       e.style.map(x=>{
    //         this.styleDropdownList.forEach(y=>{
    //           if(y.item_id.toLowerCase()==x.toLowerCase() && y.checked){
    //             temp.push(e)
    //             this.selectedFilterList.push(y)
    //           }
    //         })
    //       })
    //     })
    //     break;      
    //   }
    //   case 'for':{
    //     productList.forEach(e=>{
    //       e.for.map(x=>{
    //         this.forDropdownList.forEach(y=>{
    //           if(y.item_id.toLowerCase()==x.toLowerCase() && y.checked){
    //             temp.push(e)
    //             this.selectedFilterList.push(y)
    //           }
    //         })
    //       })
    //     })
    //     break;      
    //   }
    //   default:{
    //     // this.allProductList.forEach(e=>{
    //     //   this.selectedFilterList.
    //     //   e.for.map(x=>{
    //     //     this.forDropdownList.forEach(y=>{
    //     //       if(y.item_id.toLowerCase()==x.toLowerCase() && y.checked){
    //     //         temp.push(e)
    //     //         this.selectedFilterList.push(y)
    //     //       }
    //     //     })
    //     //   })
    //     // })
    //   }
    // }
  
    // if(!this.selectedFilterList.length){
      this.allProductList.forEach(async e=>{
        if(type=='price' && e.discountPrice){

        }
        e.category.map(x=>{
          this.categoryDropdownList.forEach(y=>{
            if(y.item_id.toLowerCase()==x.toLowerCase() && y.checked){
              temp.push(e)
              this.selectedFilterList.push(y)
              // this.filterSelected=true
            }
          })
        })
        e.style.map(x=>{
          this.styleDropdownList.map(y=>{
            if(y.item_id.toLowerCase()==x.toLowerCase()&& y.checked){
              temp.push(e)
              this.selectedFilterList.push(y)
              // this.filterSelected=true
            }
          })
        })
        e.colour.map(x=>{
          this.colourDropdownList.map(y=>{
            if(y.item_id.toLowerCase()==x.toLowerCase()&& y.checked){
              temp.push(e)
              this.selectedFilterList.push(y)
              // this.filterSelected=true
            }
          })
        })
        e.stone.map(x=>{
          this.stoneDropdownList.map(y=>{
            if(y.item_id.toLowerCase()==x.toLowerCase()&& y.checked){
              temp.push(e)
              this.selectedFilterList.push(y)
              // this.filterSelected=true
            }
          })
        })
        e.for.map(x=>{
          this.forDropdownList.map(y=>{
            if(y.item_id.toLowerCase()==x.toLowerCase()&& y.checked){
              temp.push(e)
              this.selectedFilterList.push(y)
              // this.filterSelected=true
            }
          })
        })
      })
   
  if(this.selectedFilterList.length){
    this.selectedFilterList=this.util.unique(this.selectedFilterList,['item_id'])
    if(this.selectedFilterList.length!=1 && this.selectedFilterList.length){
      // temp=[]
      let val=this.selectedFilterList[this.selectedFilterList.length-1]
      // val.forEach(y=>{
         this.productList.forEach(e=>{
          if(val.type=='category'){
            e.category.map(x=>{
              if(val.item_id.toLowerCase()==x.toLowerCase() && val.checked){
                temp.push(e)
              }
            })
          }if(val.type=='stone'){
                e.stone.map(x=>{
              if(val.item_id.toLowerCase()==x.toLowerCase() && val.checked){
                temp.push(e)
              }
           })
          }
          if(val.type=='colour'){
                e.colour.map(x=>{
              if(val.item_id.toLowerCase()==x.toLowerCase() && val.checked){
                temp.push(e)
              }
           })
          }if(val.type=='style'){
                  e.style.map(x=>{
                if(val.item_id.toLowerCase()==x.toLowerCase() && val.checked){
                  temp.push(e)
                }
            })
            }if(val.type=='for'){
                  e.for.map(x=>{
                if(val.item_id.toLowerCase()==x.toLowerCase() && val.checked){
                  temp.push(e)
                }
            })
            }
        // })
      })

    }
    this.productList=this.util.unique(temp,['_id'])
  }else this.productList=this.allProductList
  prevType=type
  // await this.getFilterData()
  }

  filterByPrice(event,type?:any){
    let temp = []
    // if(this.productList.length){
    //   this.productList.forEach(e=>{
    //     if(event.value<=e.discountPrice && e.discountPrice<=event.highValue){
    //       temp.push(e)
    //     }
    //   })
    // }else{
      this.allProductList.forEach(e=>{
        if(event.value<=e.discountPrice && e.discountPrice<=event.highValue){
          temp.push(e)
        }
      })
    // }
    this.productList=temp

  }
  getSortByFilter(data,id){
    this.sortByFilter=data?.field_name.toUpperCase()
    let temp=this.allProductList
    let sortByName,sortByPrice,sortByLatest,SortByDiscount
    $('#' + id).toggleClass('open').siblings().slideToggle(300);
    //SortByName
    if(data?.item_id=='A-Z' || data?.item_id=='Z-A'){
       sortByName=temp.sort((a,b)=>{
        return a.productName < b.productName ?  -1 : a.productName > b.productName ? 1 :0
      })
    }
  //SortByPrice
    if(data?.item_id=='low to high' || data?.item_id=='high to low'){
      sortByPrice=temp.sort((a,b)=>{
      return a.discountPrice - b.discountPrice
    })
    }
    //SortByNew
    if(data?.item_id=='old to new' || data?.item_id=='new to old'){
      sortByLatest=temp.sort((a,b)=>{
        return a.createdAt - b.createdAt
      })
    }
    //SortByDiscount
    if(data?.item_id=='% Sale off'){
      SortByDiscount=temp.sort((a,b)=>{
        let x=((a.actualPrice-a.discountPrice)/a.actualPrice)*100
        let y=((b.actualPrice-b.discountPrice)/b.actualPrice)*100
        return y-x
      })
    }
      switch(data?.item_id){
        case'Best Selling':return this.productList=this.allProductList
        case'A-Z':return this.productList=sortByName
        case'Z-A':return this.productList=sortByName.reverse()
        case'low to high':return this.productList=sortByPrice
        case'high to low':return this.productList=sortByPrice.reverse()
        case'new to old':return  this.productList=sortByLatest
        case'old to new':return this.productList=sortByLatest.reverse()
        case'% Sale off':return this.productList=SortByDiscount
        case'Featured':return this.productList=this.allProductList
      }
  }
  clearAllFilter(){
    this.categoryDropdownList.forEach(e=> e.checked = false)
    this.styleDropdownList.forEach(e=> e.checked = false)
    this.colourDropdownList.forEach(e=> e.checked = false)
    this.stoneDropdownList.forEach(e=> e.checked = false)
    this.forDropdownList.forEach(e=> e.checked = false)
    this.selectedFilterList=[]
    this.productList=this.allProductList
  }

  subMenuOpen(id){
    let idList=[{id:'category'},{id:'stone'},{id:'price'},{id:'colour'},{id:'style'},{id:'for'},{id:'sortBy'}]
      $('#' + id).toggleClass('open').siblings().slideToggle(300); 
      // if(this.prevId!=id)  $('#' + this.prevId).toggleClass('open').siblings().slideUp(300)  
      // if(this.prevId==id){
      //   // $('#' + id).toggleClass('open')
      //   $('#' + this.prevId).toggleClass('open')
      // }  
    this.prevId=id
  }

  changePrice(event,type){
     type=='min' ?   this.minValue=this.filterForm.get('minValue').value :   this.maxValue=this.filterForm.get('maxValue').value
  }

  routeToDetails(data?:any){
      let productName=data.productName.replace(/\s/g,'-')
      let url=`/jewel/product-collections/details/${productName}`
      return this.router.navigate([url],{state : {data}})

      // return this.router.navigate([url],{queryParams:{productDetails:{...data}},  skipLocationChange: true})
  }
  

}
