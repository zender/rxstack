import {Request} from '../src/models/request';
import {HeaderBag} from '../src/models/header-bag';
import {ParameterBag} from '../src/models/parameter-bag';
import {AttributeBag} from '../src/models/attribute-bag';
import {FileBag} from '../src/models/file-bag';
import {Response} from '../src/models/response';
import {User} from '../src/models/user';
import {Token} from '../src/models/token';

describe('Models', () => {
  it('should initialize request', async () => {
    const request = new Request('HTTP');
    request.transport.should.be.equal('HTTP');
    request.headers.should.be.instanceOf(HeaderBag);
    request.query.should.be.instanceOf(ParameterBag);
    request.params.should.be.instanceOf(ParameterBag);
    request.attributes.should.be.instanceOf(AttributeBag);
    request.files.should.be.instanceOf(FileBag);
  });

  it('should initialize response', async () => {
    const response = new Response('content');
    response.content.should.be.equal('content');
    response.statusCode.should.be.equal(200);
    response.headers.should.be.instanceOf(HeaderBag);
  });

  it('should import and export values from ParameterBag', async () => {
    const bag = new ParameterBag({'id': 1});
    JSON.stringify(bag.toObject()).should.be.equal(JSON.stringify({'id': 1}));
  });

  it('should initialize token', async () => {
    const token = new Token();
    (typeof token.credentials).should.be.equal('undefined');
    (typeof token.user).should.be.equal('undefined');
    (null === token.getUsername()).should.be.true;
    token.getRoles().length.should.be.equal(0);
  });


  it('should initialize token with credentials and user', async () => {
    const user = new User('user', 'pass', ['ROLE_USER']);
    const token = new Token({'username': 'admin', 'password': 'pass'}, user);
    token.user.should.be.instanceOf(User);
    token.credentials.username.should.be.equal('admin');
    token.credentials.password.should.be.equal('pass');
    token.getRoles().length.should.be.equal(1);
    token.getUsername().should.be.equal('user');
    user.hasRole('ROLE_USER').should.be.true;
  });
});