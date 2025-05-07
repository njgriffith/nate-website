import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level9Component } from './level-9.component';

describe('Level9Component', () => {
  let component: Level9Component;
  let fixture: ComponentFixture<Level9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level9Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Level9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
