export class QueryParameterExtractorOptions {
  name?: string;
  enabled: boolean;

  constructor(obj?: any) {
    this.name = obj && obj.name || 'bearer';
    this.enabled = obj && obj.enabled;
  }
}

export class AuthorizationHeaderExtractorOptions {
  name?: string;
  prefix?: string;
  enabled: boolean;

  constructor(obj?: any) {
    this.name = obj && obj.name || 'authorization';
    this.prefix = obj && obj.prefix || 'Bearer';
    this.enabled = obj && obj.enabled;
  }
}

export class TokenExtractorsOptions {
  query_parameter?: QueryParameterExtractorOptions;
  authorization_header?: AuthorizationHeaderExtractorOptions;

  constructor(obj?: any) {
    this.query_parameter = new QueryParameterExtractorOptions(obj.query_parameter);
    this.authorization_header = new AuthorizationHeaderExtractorOptions(obj.authorization_header);
  }
}

export class SecurityConfiguration {
  transports: string[];
  token_extractors: TokenExtractorsOptions;
  local_authentication?: boolean;
  user_identity_field?: string;
  ttl?: number
  constructor(obj?: any) {
    this.transports = obj.transports || [];
    this.token_extractors = new TokenExtractorsOptions(obj.token_extractors);
    this.local_authentication = obj.local_authentication || false;
    this.user_identity_field = obj.user_identity_field || 'username';
    this.ttl = obj.ttl || (300 * 1000);
  }
}