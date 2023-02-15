export {};

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

declare global {
  var onlineUsers: any;
}
