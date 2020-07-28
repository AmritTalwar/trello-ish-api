export {};

declare global {
  namespace Express {
    interface Request {
      user: any;
      board: any;
      team: any;
    }
  }
}
