const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../views/user/cloudConfig.js")
const upload = multer({storage})//(dest: 'uploads/') dest here refers to that where we want to save our files(images) here under folder named uploads
//here dest:'/uploads/' is replaced by storgae which we have aqquired through cloudinary
// Create a test listing
router.get("/testListing", async (req, res) => {
  const sampleListing = new Listing({
    title: "My new villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });
  await sampleListing.save();
  res.send("Sample saved successfully");
});

// Index - show all listings
router.get("/", wrapAsync(listingController.index));
//show category wise listing 
router.get("/category",listingController.byCategory);
router.get("/search",listingController.byCountry);


// New - form to create listing
router.get("/new", isLoggedIn,listingController.renderNewForm);

// Create - new listing
// Create - new listing
router.post("/", upload.single('listing[image]'),isLoggedIn,wrapAsync(listingController.createListing));


// Show - one listing
// Show - one listing
router.get("/:id", wrapAsync(listingController.showListing));


// Edit - form to edit listing

router.get("/edit/:id", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// Update - patch listing

router.patch("/:id", isLoggedIn, upload.single('image'),wrapAsync(listingController.updateListing));

// Delete - listing
router.delete("/delete/:id", isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



module.exports = router;
