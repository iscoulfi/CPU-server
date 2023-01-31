import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = decoded;
      next();
    } catch (error) {
      return res.json({
        message: 'No access',
      });
    }
  } else {
    return res.json({
      message: 'No access',
    });
  }
};
