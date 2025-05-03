import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantheonsComponent } from './pantheons.component';

describe('PantheonsComponent', () => {
  let component: PantheonsComponent;
  let fixture: ComponentFixture<PantheonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantheonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PantheonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
