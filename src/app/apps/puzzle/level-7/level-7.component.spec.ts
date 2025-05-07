import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level7Component } from './level-7.component';

describe('Level7Component', () => {
  let component: Level7Component;
  let fixture: ComponentFixture<Level7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level7Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Level7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
