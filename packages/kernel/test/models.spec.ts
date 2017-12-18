import {Request} from '../src/models/request';
import {HeaderBag} from '../src/models/header-bag';
import {ParameterBag} from '../src/models/parameter-bag';
import {AttributeBag} from '../src/models/attribute-bag';
import {FileBag} from '../src/models/file-bag';
import {Response} from '../src/models/response';
import {User} from '../src/models/user';
import {Token} from '../src/models/token';
import {StreamedResponse} from '../src/models/streamed-response';
import {File} from '../src/models/file';
import {DownloadableResponse} from '../src/models/downloadable-response';
const rootPath = process.mainModule['paths'][0].split('node_modules')[0].slice(0, -1);

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
    response.type.should.be.equal('standard');
    response.content.should.be.equal('content');
    response.statusCode.should.be.equal(200);
    response.headers.should.be.instanceOf(HeaderBag);
  });

  it('should initialize file download response', async () => {
    const response = new DownloadableResponse('file_path', 'file.pdf');
    response.type.should.be.equal('downloadable');
    response.path.should.be.equal('file_path');
    response.name.should.be.equal('file.pdf');
    response.statusCode.should.be.equal(200);
  });

  it('should initialize streamed response with range', async () => {
    const filePath = rootPath + '/test/assets/video.mp4';
    const response = new StreamedResponse(filePath, {start: 1, end: 10});
    response.type.should.be.equal('streamed');
    response.size.should.be.equal(10);
    (typeof response.fileReadStream !== 'undefined').should.be.true;
    response.mimetype.should.be.equal('video/mp4');
    response.statusCode.should.be.equal(206);
  });

  it('should initialize streamed response without range', async () => {
    const filePath = rootPath + '/test/assets/video.mp4';
    const response = new StreamedResponse(filePath);
    response.size.should.be.equal(424925);
    response.statusCode.should.be.equal(200);
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

  it('should initialize file', async () => {
    const filebag = new FileBag();
    filebag.fromObject({'file': {
      'name': 'file.txt',
      'size': 10,
      'type': 'text/plain',
      'path': 'path_to_file',
      'hash': 'hash',
    }});

    const file = filebag.get('file');

    file.name.should.be.equal('file.txt');
    file.size.should.be.equal(10);
    file.type.should.be.equal('text/plain');
    file.path.should.be.equal('path_to_file');
    file.hash.should.be.equal('hash');
  });

  it('should initialize file with no data', async () => {
    const file = new File();
    (file.name === null).should.be.true;
    (file.size === null).should.be.true;
    (file.type === null).should.be.true;
    (file.path === null).should.be.true;
    (file.hash === null).should.be.true;
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