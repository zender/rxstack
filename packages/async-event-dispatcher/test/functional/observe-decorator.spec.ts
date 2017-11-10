import 'es6-shim';
import {GenericEvent} from '../../src/generic-event';
import {Observe} from '../../src/decorators';
import {asyncEventDispatcher} from '../../src/async-event-dispatcher';

describe('@Observe decorator', function() {
  beforeEach(() => {
    asyncEventDispatcher.reset();

    class ObserverClass {
      @Observe('pre.foo')
      async preFoo(event: GenericEvent): Promise<void> { }

      @Observe('pre.foo', 20)
      async preFoo2(event: GenericEvent): Promise<void> { }

      @Observe('post.foo')
      async postFoo(event: GenericEvent): Promise<void> { }
    }
  });

  it('should add observers to async dispatcher', function() {
    asyncEventDispatcher.getListeners('pre.foo').length.should.be.equal(2);
    asyncEventDispatcher.hasListeners('pre.foo').should.be.true;
    asyncEventDispatcher.hasListeners('post.foo').should.be.true;
  });
});
