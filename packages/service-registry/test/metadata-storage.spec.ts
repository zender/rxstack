import {metadataStorage} from '../src/metadata-storage';
import {MyManager, MyService3, MyService4} from './stubs';
const chai = require('chai');
const expect = chai.expect;

describe('MetadataStorage', () => {
  it('should register service metadata by priority', () => {
    const names = ['my-service-2', 'my-service-1', 'my-service-3'];
    expect(metadataStorage.all(MyManager.ns)).to.be.length(3);
    metadataStorage.all(MyManager.ns).forEach((metadata: ServiceRegistryMetadata, idx) => {
      expect(metadata.name).to.be.equal(names[idx]);
    });
  });

  it('should get metadata by target', () => {
    let metadata3 = metadataStorage.get(MyService3, MyManager.ns);
    expect(metadata3.target).to.be.equal(MyService3);
  });

  it('should get not registered service metadata', () => {
    let metadata4 = metadataStorage.get(MyService4, MyManager.ns);
    expect(metadata4).to.be.null;
  });

  it('should remove not registered service metadata', () => {
    metadataStorage.remove(MyService4, MyManager.ns);
    expect(metadataStorage.all(MyManager.ns)).to.be.length(3);
  });

  it('should remove registered service metadata', () => {
    metadataStorage.remove(MyService3, MyManager.ns);
    expect(metadataStorage.all(MyManager.ns)).to.be.length(2);
  });
});
