module.exports = (allowedRoles=[]) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No user' });
  if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
