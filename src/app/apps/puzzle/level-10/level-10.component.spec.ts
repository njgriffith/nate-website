import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level10Component } from './level-10.component';

describe('Level10Component', () => {
  let component: Level10Component;
  let fixture: ComponentFixture<Level10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level10Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Level10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
