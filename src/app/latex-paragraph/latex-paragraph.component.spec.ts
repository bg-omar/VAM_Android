import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatexParagraphComponent } from './latex-paragraph.component';

describe('LatexParagraphComponent', () => {
  let component: LatexParagraphComponent;
  let fixture: ComponentFixture<LatexParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatexParagraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatexParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
