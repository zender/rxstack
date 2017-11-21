import 'reflect-metadata';
import {metadataStorage} from '../src/metadata/metadata-storage';
import {ControllerMetadata} from '../src/metadata/metadata';
import {AnnotatedController} from './stubs/annotated.controller';
import {NotAnnotatedController} from './stubs/not-annotated.controller';

describe('Metadata', () => {
  it('should has AnnotatedController metadata', async () => {
    metadataStorage.hasControllerMetadata(AnnotatedController).should.be.true;
  });

  it('should find AnnotatedController metadata', async () => {
    const metadata = metadataStorage.findControllerMetadata(AnnotatedController);
    metadata.should.be.not.null;
    metadata.target.should.be.equal(AnnotatedController);
    metadata.methodDefinitions.has('indexAction');
  });

  it('should add NotAnnotatedController metadata', async () => {

    const newMetadata = new ControllerMetadata(NotAnnotatedController);
    newMetadata.options = {routeBase: 'no-annotation'};
    newMetadata.methodDefinitions.set('indexAction', {
      'method': 'GET',
      'route': '/index'
    });
    metadataStorage.registerControllerMetadata(newMetadata);
    const metadata = metadataStorage.findControllerMetadata(NotAnnotatedController);
    metadata.should.be.not.null;
    metadata.target.should.be.equal(NotAnnotatedController);
    metadata.methodDefinitions.has('indexAction');

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
    metadataStorage.getControllerMetadataCollection().length.should.be.equal(0);
  });
});