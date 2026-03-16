import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodLivesComponent } from './god-lives.component';

describe('GodLivesComponent', () => {
  let component: GodLivesComponent;
  let fixture: ComponentFixture<GodLivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GodLivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GodLivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
