export interface AppConfig {
  name: string;
  dir: string;
  version?: string;
}

export const environment = {
  app: {
    name: 'MyApp',
    env_value: 'MY_VALUE',
    dir: './my-dir'
  }
};