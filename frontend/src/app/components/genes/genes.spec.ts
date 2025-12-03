import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genes } from './genes';

describe('Genes', () => {
  let component: Genes;
  let fixture: ComponentFixture<Genes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Genes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
