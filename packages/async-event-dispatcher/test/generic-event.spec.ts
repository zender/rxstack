import {GenericEvent} from '../src/generic-event';

describe('GenericEvent', () => {

  let genericEvent: GenericEvent;

  beforeEach(() => {
    genericEvent = new GenericEvent();
  });

  it('should not stop propagation', () => {
    genericEvent.isPropagationStopped().should.be.false;
  });

  it('should stop propagation', () => {
    genericEvent.stopPropagation();
    genericEvent.isPropagationStopped().should.be.true;
  });
});