import { TestBed } from '@angular/core/testing';

import { ReminderListService } from './reminder-list.service';

describe('ReminderListService', () => {
  let service: ReminderListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReminderListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
