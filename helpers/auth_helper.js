module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("ERRORS_MESSAGE", "you are not authorized..");
      res.redirect("/auth/login", 301, () => {});
    }
  },
};
