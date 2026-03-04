import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuffILikeComponent } from './stuff-i-like.component';

describe('StuffILike', () => {
  let component: StuffILikeComponent;
  let fixture: ComponentFixture<StuffILikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StuffILikeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StuffILikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
