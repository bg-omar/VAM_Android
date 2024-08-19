import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatexDisplayComponent } from './latex-display.component';

describe('LatexDisplayComponent', () => {
  let component: LatexDisplayComponent;
  let fixture: ComponentFixture<LatexDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatexDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatexDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
