const User = require('../models/user');
const Role = require('../models/role');


const isSelf = (req) => {
  return req.user._id.equals(req.params.userId)
}

module.exports.isAuthorized = (action) => {
  return async (req, res, next) => {
    if (isSelf(req)) {
      next();
    } else {
      const role = await Role.findOne({ role: req.user.role });
      //This is an additional security layer, if someone figures out how to send a different role
      if (!role.users.includes(req.user._id)) {
        req.flash('error', 'Unauthorized account.');
        const redirectTo = req.session.returnTo;
        delete req.session.returnTo;
        return res.redirect(redirectTo || `/users/${req.user._id}`);
      }
      if (!role.auth[action].includes('OTHER')) {
        req.flash('error', `You don't have permission to do that.`);
        const redirectTo = req.session.returnTo;
        delete req.session.returnTo;
        return res.redirect(redirectTo || `/users/${req.user._id}`);
      }
      next();
      /*switch (role) {
        case "MODERATOR":
          const userRights = ['UPDATE', 'SHOW'];
          if (!userRights.includes(action)) {
            req.flash('error', 'You are not authorized.');
            return res.redirect(`/users/${req.user._id}`);
          }
          next();
          break;
        case "ADMIN":
          next()
          break;
        default:
          req.flash('error', 'You are not authorized.');
          return res.redirect(`/users/${req.user._id}`);
      }*/
    }
  }
}
