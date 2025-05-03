import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrawberryJamComponent } from './strawberry-jam.component';

describe('StrawberryJamComponent', () => {
  let component: StrawberryJamComponent;
  let fixture: ComponentFixture<StrawberryJamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrawberryJamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StrawberryJamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
