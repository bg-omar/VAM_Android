import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEquationComponent } from './generate-equation.component';

describe('GenerateEquationComponent', () => {
  let component: GenerateEquationComponent;
  let fixture: ComponentFixture<GenerateEquationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateEquationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateEquationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
