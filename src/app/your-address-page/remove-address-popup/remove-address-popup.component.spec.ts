import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAddressPopupComponent } from './remove-address-popup.component';

describe('RemoveAddressPopupComponent', () => {
  let component: RemoveAddressPopupComponent;
  let fixture: ComponentFixture<RemoveAddressPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveAddressPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAddressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
