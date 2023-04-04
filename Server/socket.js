let io;

module.exports = {
  init: (httpServer, httpClient) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: httpClient,
        methods: ['GET', 'POST'],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
