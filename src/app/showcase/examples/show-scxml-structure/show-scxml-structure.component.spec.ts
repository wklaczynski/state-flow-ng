import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowScxmlStructureComponent } from './show-scxml-structure.component';

describe('ShowScxmlStructureComponent', () => {
  let component: ShowScxmlStructureComponent;
  let fixture: ComponentFixture<ShowScxmlStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowScxmlStructureComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowScxmlStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
