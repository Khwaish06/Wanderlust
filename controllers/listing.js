const Listing = require("../models/listing.js");
module.exports.index= async (req, res) => {
  const lists = await Listing.find().populate("reviews").populate("owner");
  res.render("app.ejs", { lists });
}
module.exports.renderNewForm=(req, res) => {
 
  res.render("new.ejs");
}
module.exports.showListing=async (req, res) => {
  const { id } = req.params;
  
  const content = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!content) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("show.ejs", { content });
}
module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }

  const { title, price, location, country, category } = req.body.listing;

  // Check for missing required fields
  if (!title || !price || !location || !country || !category) {
    throw new ExpressError(400, "Missing required fields");
  }

  // Handle uploaded image
  let url = req.file?.path;
  let filename = req.file?.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // Only assign image if uploaded
  if (url && filename) {
    newListing.image = { url, filename };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
module.exports.editListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { content: listing });
}
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Update listing fields (title, price, category, etc.)
  const updateData = req.body.listing;

  const listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

  // If a new image was uploaded, update it
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");

  
}
module.exports.byCategory=async (req, res) => {
  const { category } = req.query;
  let listings;
  if (category) {
    listings = await Listing.find({ category });
  } else {
    listings = await Listing.find({});
  }
  res.render("showCategory.ejs", { listings, category });
}
module.exports.byCountry = async (req, res) => {
  const { country } = req.query;
  let listings;

  if (country) {
    listings = await Listing.find({ country: new RegExp(country, 'i') }); // optional: case-insensitive search
  } else {
    listings = await Listing.find({});
  }

  res.render("showCountry.ejs", { listings, country });
};
