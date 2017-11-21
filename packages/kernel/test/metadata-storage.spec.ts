import 'reflect-metadata';
import {metadataStorage} from '../src/metadata/metadata-storage';
import {NoAnnotationController} from './stubs/no-annotation.controller';
import {ControllerMetadata} from '../src/metadata/metadata';
import {AnnotationController} from './stubs/annotation.controller';

describe('Metadata', () => {
  it('should has TestController metadata', async () => {
    metadataStorage.hasControllerMetadata(AnnotationController).should.be.true;
  });

  it('should find TestController metadata', async () => {
    const metadata = metadataStorage.findControllerMetadata(AnnotationController);
    metadata.should.be.not.null;
    metadata.target.should.be.equal(AnnotationController);
    metadata.methodDefinitions.has('findAction');
    metadata.methodDefinitions.has('getAction');
  });

  it('should add NoAnnotationController metadata', async () => {

    let newMetadata = new ControllerMetadata(NoAnnotationController);
    newMetadata.options = {routeBase: 'no-annotation'};
    newMetadata.methodDefinitions.set('listAction', {
      'method': 'GET',
      'route': '/list'
    });
    metadataStorage.registerControllerMetadata(newMetadata);
    let metadata = metadataStorage.findControllerMetadata(NoAnnotationController);
    metadata.should.be.not.null;
    metadata.target.should.be.equal(NoAnnotationController);
    metadata.methodDefinitions.has('findAction');
    metadata.methodDefinitions.has('getAction');

    let error = null;
    try {
      metadataStorage.registerControllerMetadata(newMetadata);
    } catch (e) {
      error = e;
    }
    error.should.be.not.null;
  });

  it('should reset metadata', async () => {
    metadataStorage.reset();
    metadataStorage.getControllerMetadataCollection().length.should.not.be.null;
  });
});