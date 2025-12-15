import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level11Component } from './level-11.component';

describe('Level11Component', () => {
  let component: Level11Component;
  let fixture: ComponentFixture<Level11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level11Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Level11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
