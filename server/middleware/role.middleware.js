/**
 * Middleware to check if the user has a specific role.
 * @param {Array} roles - Allowed roles.
 */
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Forbidden: Access denied for role: ${req.user ? req.user.role : 'none'}`);
    }
    next();
  };
};
