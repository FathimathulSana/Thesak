module.exports = {
  //-----------admin-session----------//
  adminSession: (req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect("/admin");
    }
  },
  //----------user-session----------//
  userSession: (req, res, next) => {
    if (req.session.userLoggedIn) {
      next();
    } else {
      res.redirect("/Login");
    }
  },
};
