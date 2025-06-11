import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VamComponent } from './vam.component';

describe('VamComponent', () => {
  let component: VamComponent;
  let fixture: ComponentFixture<VamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
