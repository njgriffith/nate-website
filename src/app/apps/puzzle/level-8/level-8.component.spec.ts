import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level8Component } from './level-8.component';

describe('Level8Component', () => {
  let component: Level8Component;
  let fixture: ComponentFixture<Level8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level8Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Level8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
