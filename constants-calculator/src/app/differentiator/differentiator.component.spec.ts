import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferentiatorComponent } from './differentiator.component';

describe('DifferentiatorComponent', () => {
  let component: DifferentiatorComponent;
  let fixture: ComponentFixture<DifferentiatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DifferentiatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DifferentiatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
