import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWishlistComponent } from './add-wishlist/add-wishlist.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RegisterComponent } from './components/register/register.component';
import { CustomerAddressComponent } from './customer-address/customer-address.component';
import { GiftProductComponent } from './gift-product/gift-product.component';
import { LoginSecurityComponent } from './login-security/login-security.component';
import { NewArrivalsProductComponent } from './new-arrivals-product/new-arrivals-product.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ProductCollectionsComponent } from './product-collections/product-collections/product-collections.component';
import { ProductDetailsComponent } from './product-collections/product-details/product-details.component';
import { ProductPersonalisedComponent } from './product-personalised/product-personalised.component';


const routes: Routes = [
  { path: '', redirectTo: 'jewel', pathMatch: 'full' },
  { path: 'jewel', component: NavBarComponent,data: { title: 'Home'},
  children: [
    { path: '', redirectTo: 'home',pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: 'Home'}},
    { path: 'login', component: LoginComponent, data: { title: 'Login'}},
    { path: 'register', component: RegisterComponent,data: { title: 'Register'}},
    { path: 'add-to-wishlist', component: AddWishlistComponent,data: { title: 'Wishlist'}},
    { path: 'cart', component: CartComponent,data: { title: 'Cart'}},
    { path: 'product-collections', component: ProductCollectionsComponent, data: { title: 'Collections'}},
     { path: 'product-collections/details/:name', component: ProductDetailsComponent, data: { title: 'Details'}},
     { path: 'product-personalised', component: ProductPersonalisedComponent, data: { title: 'Personalised'}},
     { path: 'product-gifts', component: ProductCollectionsComponent, data: { title: 'Gifts', type:'gift'}},
     { path: 'product-new-arrivals', component: NewArrivalsProductComponent, data: { title: 'New-arrivals'}},
     { path: 'login-security', component: LoginSecurityComponent, data: { title: 'Login-Security'}},
     { path: 'order-details', component: OrderDetailsComponent, data: { title: 'Your-orders'}},
     { path: 'customer-address', component: CustomerAddressComponent, data: { title: 'Address'}},
   ]},
  { path: '**', component: NavBarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
