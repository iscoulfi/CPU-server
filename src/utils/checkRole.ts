import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: string[]) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
      try {
        const { roles: userRoles } = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        let hasRole = false;
        userRoles.forEach((role: string) => {
          if (roles.includes(role)) {
            hasRole = true;
          }
        });
        if (!hasRole) {
          return res.json({
            message: 'No access',
          });
        }
        next();
      } catch (error) {
        return res.json({
          message: 'Authorisation error',
        });
      }
    } else {
      return res.json({
        message: 'User is not authorized',
      });
    }
  };
};
