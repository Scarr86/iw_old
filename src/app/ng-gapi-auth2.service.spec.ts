import { TestBed } from '@angular/core/testing';

import { NgGapiAuth2Service } from './ng-gapi-auth2.service';

describe('NgGapiAuth2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgGapiAuth2Service = TestBed.get(NgGapiAuth2Service);
    expect(service).toBeTruthy();
  });
});
