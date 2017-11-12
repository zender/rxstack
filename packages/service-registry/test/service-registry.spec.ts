import {metadataStorage} from '../src/metadata-storage';
import {MyInterface, MyManager, MyService1, MyService2, MyService3, MyService4} from './stubs';
import {ServiceRegistryMetadata} from '../src/metadata';
const chai = require('chai');
const expect = chai.expect;

describe('ServiceRegistry', () => {
  const manager = new MyManager();
  // mimic the injector
  const injector = new Map<Function, MyInterface>();
  injector.set(MyService1, new MyService1());
  injector.set(MyService2, new MyService2());
  injector.set(MyService3, new MyService3());
  injector.set(MyService4, new MyService4());

  it('should add services to manager', () => {
    metadataStorage.all(MyManager.ns).forEach((metadata: ServiceRegistryMetadata) => {
      manager.services.set(metadata.name, injector.get(metadata.target));
    });
    expect(manager.services.size).to.be.equal(2);
  });

  it('should get services from manager', () => {
    expect(manager.services.get('my-service-1')).to.be.instanceof(MyService1);
    expect(manager.services.get('my-service-2')).to.be.instanceof(MyService2);
  });


  it('should modify value', () => {
    expect(manager.apply(1)).to.be.equal(4);
  });
});
