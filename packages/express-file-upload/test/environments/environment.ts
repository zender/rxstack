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
    port: 3210
  },
  express_file_upload: {
    enabled: true,
    directory: './test/uploads'
  }
};