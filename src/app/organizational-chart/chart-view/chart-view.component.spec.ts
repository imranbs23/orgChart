import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartViewComponent } from './chart-view-test.component';

describe('ChartViewComponent', () => {
  let component: ChartViewComponent;
  let fixture: ComponentFixture<ChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
