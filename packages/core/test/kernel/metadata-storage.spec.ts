import 'reflect-metadata';
import {ControllerMetadata, RouteMetadata} from '../../src/kernel/metadata/metadata';
import {NotAnnotatedController} from './stubs/not-annotated.controller';
import {MetadataStorage} from '../../src/kernel/metadata';

describe('Metadata', () => {

  const metadataStorage = new MetadataStorage();

  it('should add NotAnnotatedController metadata', async () => {

    const controllerMetadata = new ControllerMetadata();
    controllerMetadata.target = NotAnnotatedController;
    controllerMetadata.path = '/non-annotated';

    const routeMetadata = new RouteMetadata();
    routeMetadata.target = NotAnnotatedController;
    routeMetadata.path = '/index';
    routeMetadata.name = 'not_annotated_index';
    routeMetadata.propertyKey = 'indexAction';

    metadataStorage.registerMetadata(controllerMetadata, [routeMetadata]);
    const metadataCollection = metadataStorage.getRouteMetadataCollection(NotAnnotatedController);
    metadataCollection.length.should.be.equal(1);
    metadataCollection[0].target.should.be.equal(NotAnnotatedController);
    metadataCollection[0].propertyKey.should.be.equal('indexAction');
    metadataCollection[0].name.should.be.equal('not_annotated_index');
    metadataCollection[0].path.should.be.equal('/index');

    let error = null;
    try {
      metadataStorage.registerMetadata(controllerMetadata, [routeMetadata]);
    } catch (e) {
      error = e;
    }
    error.should.be.not.null;
  });

  it('should throw an exception when adding existing route metadata', async () => {
    const routeMetadata = new RouteMetadata();
    routeMetadata.target = NotAnnotatedController;
    routeMetadata.path = '/index';
    routeMetadata.name = 'not_annotated_index';
    routeMetadata.propertyKey = 'indexAction';

    let error = null;
    try {
      metadataStorage.addRouteMetadata(routeMetadata);
    } catch (e) {
      error = e;
    }
    error.should.be.not.null;
  });

  it('should remove controller metadata', async () => {
    metadataStorage.removeControllerMetadata(NotAnnotatedController);
    metadataStorage.hasControllerMetadata(NotAnnotatedController).should.be.false;
    metadataStorage.getRouteMetadataCollection(NotAnnotatedController).length.should.be.equal(0);
  });

  it('should throw exception when removing not existing controller metadata', async () => {
    let error = null;
    try {
      metadataStorage.removeControllerMetadata(NotAnnotatedController);
    } catch (e) {
      error = e;
    }
    error.should.be.not.null;
  });


  it('should throw exception when removing not existing route metadata', async () => {
    let error = null;
    try {
      metadataStorage.removeRouteMetadata('unknown_route');
    } catch (e) {
      error = e;
    }
    error.should.be.not.null;
  });

  it('should reset metadata', async () => {
    metadataStorage.reset();
    metadataStorage.getControllerMetadataCollection().length.should.be.equal(0);
    metadataStorage.getRouteMetadataCollection().length.should.be.equal(0);
  });
});