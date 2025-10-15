import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelesteSpeedrunComponent } from './celeste-speedrun.component';

describe('CelesteSpeedrunComponent', () => {
  let component: CelesteSpeedrunComponent;
  let fixture: ComponentFixture<CelesteSpeedrunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelesteSpeedrunComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CelesteSpeedrunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
