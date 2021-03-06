import 'reflect-metadata';
import {Injector} from 'injection-js';
import {EncoderFactory} from '../src/password-encoders/encoder-factory';
import {TestUserWithEncoder} from './mocks/test-user-with-encoder';
import {PlainTextPasswordEncoder} from '../src/password-encoders/plain-text.password-encoder';
import {BcryptPasswordEncoder} from '../src/password-encoders/bcrypt.password-encoder';
import {User} from '../src/models/user';
import {Application} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:Encoder', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should get encoder by name', async () => {
    let encoder = injector.get(EncoderFactory).get('plain-text');
    encoder.getName().should.be.equal('plain-text');
  });

  it('should get encoder from user with defined encoder', async () => {
    let user = new TestUserWithEncoder('admin', 'pass', ['ADMIN']);
    let encoder = injector.get(EncoderFactory).getEncoder(user);
    encoder.getName().should.be.equal('plain-text');
  });

  it('should get encoder from user without defined one', async () => {
    let user = new User('admin', 'pass', ['ADMIN']);
    let encoder = injector.get(EncoderFactory).getEncoder(user);
    encoder.getName().should.be.equal('bcrypt');
  });

  it('should throw exception with non-existing encoder', async () => {
    let user = new TestUserWithEncoder('admin', 'pass', ['ADMIN']);
    user.encoderName = 'unknown';

    const fn = () => {
      let encoder = injector.get(EncoderFactory).getEncoder(user);
    };
    fn.should.throw(new RegExp('does not exist'));
  });

  describe('PlainTextEncoder', () => {
    it('should encode and validate', async () => {
      const encoder = new PlainTextPasswordEncoder();
      const encoded = await encoder.encodePassword('pass');
      const result1 = await encoder.isPasswordValid(encoded, 'pass');
      result1.should.be.true;
      const result2 = await encoder.isPasswordValid(encoded, 'pass1');
      result2.should.be.false;
    });
  });

  describe('BcryptPasswordEncoder', () => {
    it('should encode and validate', async () => {
      const encoder = new BcryptPasswordEncoder();
      const encoded = await encoder.encodePassword('pass');
      const result1 = await encoder.isPasswordValid(encoded, 'pass');
      result1.should.be.true;
      const result2 = await encoder.isPasswordValid(encoded, 'pass1');
      result2.should.be.false;
    });
  });
});
