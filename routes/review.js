const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controllers/review.js");
// POST: Create a new review
router.post("/:id/reviews", isLoggedIn, wrapAsync(reviewController.createReview));

// DELETE: Remove a review
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;