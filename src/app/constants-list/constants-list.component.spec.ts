import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstantsListComponent } from './constants-list.component';

describe('ConstantsListComponent', () => {
  let component: ConstantsListComponent;
  let fixture: ComponentFixture<ConstantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstantsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
