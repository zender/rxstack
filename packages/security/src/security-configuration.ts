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

export class TokenExtractorsOptons {
  query_parameter?: QueryParameterExtractorOptions;
  authorization_header?: AuthorizationHeaderExtractorOptions;

  constructor(obj?: any) {
    this.query_parameter = new QueryParameterExtractorOptions(obj.query_parameter);
    this.authorization_header = new AuthorizationHeaderExtractorOptions(obj.authorization_header);
  }
}

export class SecurityConfiguration {
  token_extractors: TokenExtractorsOptons;
  local_authentication?: boolean;
  socket_authentication?: boolean;
  user_identity_field?: string;
  constructor(obj?: any) {
    this.token_extractors = new TokenExtractorsOptons(obj.token_extractors);
    this.local_authentication = obj.local_authentication || false;
    this.socket_authentication = obj.socket_authentication || false;
    this.user_identity_field = obj.user_identity_field || 'username';
  }
}