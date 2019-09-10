import { TestBed } from '@angular/core/testing';

import { GoogleAuth2Service } from './google-auth2.service';

describe('GoogleAuth2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleAuth2Service = TestBed.get(GoogleAuth2Service);
    expect(service).toBeTruthy();
  });
});
