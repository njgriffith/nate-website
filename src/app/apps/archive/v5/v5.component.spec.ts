import { ComponentFixture, TestBed } from '@angular/core/testing';

import { V5Component } from './v5.component';

describe('V5Component', () => {
  let component: V5Component;
  let fixture: ComponentFixture<V5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(V5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
