import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAVirusComponent } from './not-a-virus.component';

describe('NotAVirusComponent', () => {
  let component: NotAVirusComponent;
  let fixture: ComponentFixture<NotAVirusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAVirusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotAVirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
