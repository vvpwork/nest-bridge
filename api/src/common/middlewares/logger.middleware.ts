import { Request, Response, NextFunction } from 'express';

// TODO add custom logger if it needs
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`, req.baseUrl);
  next();
}
