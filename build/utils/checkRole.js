import jwt from 'jsonwebtoken';
export const checkRole = (roles) => {
    return function (req, res, next) {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (token) {
            try {
                const { roles: userRoles } = jwt.verify(token, process.env.JWT_SECRET);
                let hasRole = false;
                userRoles.forEach((role) => {
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
            }
            catch (error) {
                return res.json({
                    message: 'Authorisation error',
                });
            }
        }
        else {
            return res.json({
                message: 'User is not authorized',
            });
        }
    };
};
//# sourceMappingURL=checkRole.js.map