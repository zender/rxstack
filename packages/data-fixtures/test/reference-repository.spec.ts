import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {DATA_FIXTURES_OPTIONS} from './DATA_FIXTURES_OPTIONS';
import {Injector} from 'injection-js';
import {ReferenceRepository} from '../src';

describe('ReferenceRepository', () => {
  // Setup application
  const app = new Application(DATA_FIXTURES_OPTIONS);
  let injector: Injector;
  let repository: ReferenceRepository;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    repository = injector.get(ReferenceRepository);
  });

  after(async() =>  {
    await app.stop();
  });

  it('should #addReference', async () => {
    repository.addReference('ref1', 'val1');
    repository.hasReference('ref1').should.be.true;
  });

  it('should throw an exception on #addReference', async () => {
    repository.addReference('ref2', 'val2');
    const func = () => {
      repository.addReference('ref2', 'val2');
    };
    func.should.throw();
  });

  it('should #getReference', async () => {
    repository.addReference('ref3', 'val3');
    repository.getReference('ref3').should.be.equal('val3');
  });

  it('should throw an exception on #getReference', async () => {
    repository.reset();
    const func = () => {
      repository.getReference('none');
    };
    func.should.throw();
  });
});
