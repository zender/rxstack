export const environment = {
  user_providers: {
    in_memory: {
      users: [
        {
          username: 'admin',
          password: 'admin',
          roles: ['ADMIN']
        },
        {
          username: 'user',
          password: 'user',
          roles: ['USER']
        }
      ]
    }
  },
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
  security: {  }
};
