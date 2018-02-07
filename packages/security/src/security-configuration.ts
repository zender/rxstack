export interface SecurityProviderOption {
  name: string;
  target: Function;
}

export class SecurityConfiguration {
  authProviders?: string[];
  userProviders?: string[];
  login?: string;
  logout?: string;

  constructor(obj?: any) {
    this.authProviders = obj && Array.isArray(obj.authProviders) ? obj.authProviders : [];
    this.userProviders = obj && Array.isArray(obj.userProviders) ? obj.userProviders : [];
  }
}