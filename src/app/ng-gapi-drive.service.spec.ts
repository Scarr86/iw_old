import { TestBed } from '@angular/core/testing';

import { NgGapiDriveService } from './ng-gapi-drive.service';

describe('NgGapiDriveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgGapiDriveService = TestBed.get(NgGapiDriveService);
    expect(service).toBeTruthy();
  });
});
