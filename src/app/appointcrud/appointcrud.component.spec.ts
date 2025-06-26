import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointcrudComponent } from './appointcrud.component';

describe('AppointcrudComponent', () => {
  let component: AppointcrudComponent;
  let fixture: ComponentFixture<AppointcrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointcrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
