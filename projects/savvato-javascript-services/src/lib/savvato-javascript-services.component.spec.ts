import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavvatoJavascriptServicesComponent } from './savvato-javascript-services.component';

describe('SavvatoJavascriptServicesComponent', () => {
  let component: SavvatoJavascriptServicesComponent;
  let fixture: ComponentFixture<SavvatoJavascriptServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavvatoJavascriptServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavvatoJavascriptServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
