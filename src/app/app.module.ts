import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, TitleCasePipe } from '@angular/common';
// import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
// import { AngularMaterialModule}  from './angular-material/angular-material/angular-material.module'
//
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProductCollectionsComponent } from './product-collections/product-collections/product-collections.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductDetailsComponent } from './product-collections/product-details/product-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProductPersonalisedComponent } from './product-personalised/product-personalised.component';
import { GiftProductComponent } from './gift-product/gift-product.component';
import { NewArrivalsProductComponent } from './new-arrivals-product/new-arrivals-product.component';
import { CartComponent } from './cart/cart.component';
import { LoginSecurityComponent } from './login-security/login-security.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CustomerAddressComponent } from './customer-address/customer-address.component';
import { AddWishlistComponent } from './add-wishlist/add-wishlist.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProductCollectionsComponent,
    FooterComponent,
    ProductDetailsComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProductPersonalisedComponent,
    GiftProductComponent,
    NewArrivalsProductComponent,
    CartComponent,
    LoginSecurityComponent,
    OrderDetailsComponent,
    CustomerAddressComponent,
    AddWishlistComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSliderModule,
    // NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    // AngularMaterialModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule
 
  ],
  providers: [
    TitleCasePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
