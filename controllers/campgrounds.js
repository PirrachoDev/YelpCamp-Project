const Campground = require('../models/campground');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary/index');
const mapBoxToken = process.env.MAPBOX_TOKEN; //VSCode
//const mapBoxToken = process.env['MAPBOX_TOKEN']; Replit
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

/*module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}*/

module.exports.index = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const campgrounds = await Campground.find({})
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ title: 'asc' })
    .exec();
  const count = await Campground.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const currentPage = page;
  res.render('campgrounds/index', { campgrounds, totalPages, currentPage });
}

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const newCamp = new Campground(req.body.campground);
  newCamp.geometry = geoData.body.features[0].geometry;
  newCamp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
  newCamp.author = req.user._id;
  await newCamp.save();
  const user = await User.findById(req.user._id); //New: Adding campground to user db
  user.campgrounds.push(newCamp);                 //New: Adding campground to user db
  await user.save();                              //New: Adding campground to user db
  req.flash('success', 'Successfully made a new campground');
  res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({             //NESTED POPULATE
      path: 'reviews',    //IN ORDER TO POPULATE REVIEWS AUTHOR
      populate: {
        path: 'author'
      }
    })
    .populate('author');    //THIS IS CAMPGROUND AUTHOR
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
  campground.images.push(...imgs);
  campground.geometry = geoData.body.features[0].geometry;
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Campground successfully deleted.');
  res.redirect('/campgrounds');
}