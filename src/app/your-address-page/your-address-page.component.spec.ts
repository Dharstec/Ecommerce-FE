import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourAddressPageComponent } from './your-address-page.component';

describe('YourAddressPageComponent', () => {
  let component: YourAddressPageComponent;
  let fixture: ComponentFixture<YourAddressPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourAddressPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
