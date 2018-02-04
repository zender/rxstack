export const environment = {
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
  express_server: {
    port: 3200,
    prefix: '/api'
  }
};