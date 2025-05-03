import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoleVaultComponent } from './pole-vault.component';

describe('PoleVaultComponent', () => {
  let component: PoleVaultComponent;
  let fixture: ComponentFixture<PoleVaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoleVaultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoleVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
