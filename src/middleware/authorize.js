function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to perform this action.",
      });
    }
    next();
  };
}

function checkUserOrAdmin(req, res, next) {
  const targetUserId = Number(req.params.id);
  if (req.user.role === "admin" || req.user.id === targetUserId) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Forbidden: You cannot access or modify another user's resources.",
  });
}

module.exports = {
  authorizeRoles,
  checkUserOrAdmin,
};