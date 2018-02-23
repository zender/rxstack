export class Rsa {
  public_key: string;
  private_key?: string;
  passphrase?: string;

  constructor(obj: any) {
    this.public_key = obj.public_key;
    this.private_key = obj.private_key || null;
    this.passphrase = obj.passphrase || null;
  }
}

export class JwtConfiguration {
  secret: Rsa | string;
  signature_algorithm?: string;
  ttl?: number;
  issuer?: string;
  user_identity_field?: string;

  constructor(obj: any) {
    this.secret = (typeof obj.secret === 'string') ? obj.secret : new Rsa(obj.secret);
    this.signature_algorithm = obj.signature_algorithm || 'RS512';
    this.ttl = obj.ttl || 5000;
    this.issuer = obj.issuer || 'rxstack';
    this.user_identity_field = obj.user_identity_field || 'username';
  }
}