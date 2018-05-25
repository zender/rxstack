import 'reflect-metadata';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {TokenExtractorManager} from '../src/token-extractors/token-extractor-manager';
import {QueryParameterTokenExtractor} from '../src/token-extractors/query-parameter-token-extractor';
import {Application, Request} from '@rxstack/core';
import {environmentSecurity} from './environments/environment.security';

describe('Security:TokenExtractors', () => {
  // Setup application
  const app = new Application(AppModule.configure(environmentSecurity), environmentSecurity);
  let injector: Injector = null;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should get extractor by name', async () => {
    const manager = injector.get(TokenExtractorManager);
    manager.getByName(QueryParameterTokenExtractor.EXTRACTOR_NAME)
      .should.be.instanceOf(QueryParameterTokenExtractor);
  });

  describe('QueryParameterTokenExtractor', () => {
    it('should extract token from query', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.params.set('bearer', 'generated-token');
      manager.extract(request).should.be.equal('generated-token');
    });

    it('should not extract the token', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.params.set('some', 'generated-token');
      (manager.extract(request) === null).should.be.true;
    });
  });

  describe('HeaderTokenExtractor', () => {
    it('should extract token from headers', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.headers.set('authorization', 'Bearer generated-token');
      manager.extract(request).should.be.equal('generated-token');
    });

    it('should not extract the token', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.headers.set('some', 'generated-token');
      (manager.extract(request) === null).should.be.true;
    });

    it('should not extract the token if prefix is not found', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.headers.set('authorization', 'generated-token');
      (manager.extract(request) === null).should.be.true;
    });
  });
});
