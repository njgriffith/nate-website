import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumReviewsComponent } from './album-reviews.component';

describe('AlbumReviewsComponent', () => {
  let component: AlbumReviewsComponent;
  let fixture: ComponentFixture<AlbumReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumReviewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlbumReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
