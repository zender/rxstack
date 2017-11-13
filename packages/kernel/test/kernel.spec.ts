import {KERNEL_PROVIDERS} from '../src/providers';
import {ReflectiveInjector} from 'injection-js';
import {Kernel} from '../src/kernel';

describe('Kernel', () => {

  const resolvedProviders = ReflectiveInjector.resolve(KERNEL_PROVIDERS);
  const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
  const kernel = injector.get(Kernel);
  kernel.setInjector(injector);

  beforeEach(async () => {

  });

  it('should ...', async () => {

  });
});