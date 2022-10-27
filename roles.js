const AccessControl = require('accesscontrol');
const ac = new AccessControl();

module.exports.roles = (function () {
    ac.grant('USER')
        .createOwn('campground')
        .deleteOwn('campground')
        .readAny('campground')
        .readOwn('user')
        .updateOwn('user')
        .grant('MODERATOR')
        .extend('USER')
        .readAny('user')
        .updateAny('user')
        .grant('ADMIN')
        .extend('MODERATOR')
        .deleteAny('user')

    return ac;
})();