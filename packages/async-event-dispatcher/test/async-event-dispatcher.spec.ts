import {asyncEventDispatcher} from '../src/async-event-dispatcher';
import {GenericEvent} from '../src/generic-event';

class CustomEvent extends GenericEvent {
  modified = 0;
}

describe('AsyncEventDispatcher', () => {

  beforeEach(() => {
    asyncEventDispatcher.reset();
  });

  it('initial state', () => {
    asyncEventDispatcher.getListeners('pre.foo').length.should.be.equal(0);
  });

  it('should add listeners', () => {
    asyncEventDispatcher
      .addListener('pre.foo', async (event: GenericEvent): Promise<void> => { });

    asyncEventDispatcher
      .addListener('pre.foo', async (event: GenericEvent): Promise<void> => { });

    asyncEventDispatcher.getListeners('pre.foo').length.should.be.equal(2);
  });

  it('should dispatch', async () => {
    const event = new CustomEvent();

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 1;
      }, 0);

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 2;
      }, 10);

    await asyncEventDispatcher.dispatch('pre.foo', event);
    event.modified.should.be.equal(2);
  });

  it('should dispatch without event', async () => {
    asyncEventDispatcher
      .addListener('pre.bar', async (event: GenericEvent): Promise<void> => {});

    const event = await asyncEventDispatcher.dispatch('pre.bar');
    event.should.be.an.instanceof(GenericEvent);
  });

  it('should remove listeners', async () => {
    asyncEventDispatcher
      .addListener('pre.foo', async (event: GenericEvent): Promise<void> => { });
    asyncEventDispatcher.removeListeners('pre.foo');
    asyncEventDispatcher.getListeners('pre.foo').length.should.be.equal(0);
    // should do nothing
    await asyncEventDispatcher.dispatch('pre.foo');
  });


  it('should stop event propagation', async () => {
    const event = new CustomEvent();

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 1;
        event.stopPropagation();
      }, 0);

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 2;
      }, 10);


    await asyncEventDispatcher.dispatch('pre.foo', event);
    event.isPropagationStopped().should.be.true;
    event.modified.should.be.equal(1);
  });

  it('should throw error', async () => {
    asyncEventDispatcher
      .addListener('pre.bar', async (event: GenericEvent): Promise<void> => {
        throw new Error('error');
      });

    await asyncEventDispatcher.dispatch('pre.bar').catch((err) => {
      err.message.should.be.equal('error');
    });
  });
});