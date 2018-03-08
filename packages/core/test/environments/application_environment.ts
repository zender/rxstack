export const application_environment = {
  app_name: 'My App',
  skipServers: false,
  logger: {
    handlers: [
      {
        type: 'console',
        options: {
          level: 'silly',
        }
      }
    ]
  },
  test_module_1: {
    name: 'test1 module name'
  }
};