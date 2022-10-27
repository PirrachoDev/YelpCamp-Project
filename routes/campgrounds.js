const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatcher = require('../utils/AsyncCatcher');
const { isAuthor, isLoggedIn, validateCampground, grantAccess } = require('../middleware');
const campgroundController = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index');

const upload = multer({ storage });

router.route('/')
    .get(asyncCatcher(campgroundController.index)) // READ ALL
    .post(isLoggedIn, upload.array('image'), validateCampground, asyncCatcher(campgroundController.createCampground)); // CREATE

//ADD-FORM
router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
    .get(asyncCatcher(campgroundController.showCampground)) // SHOW
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, asyncCatcher(campgroundController.updateCampground)) // UPDATE
    .delete(isLoggedIn, isAuthor, asyncCatcher(campgroundController.deleteCampground)) // DELETE

//EDIT-FORM
router.get('/:id/edit', isLoggedIn, isAuthor, asyncCatcher(campgroundController.renderEditForm));


module.exports = router;