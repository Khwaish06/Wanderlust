const Listing=require("../models/listing.js")
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
module.exports.createReview=async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body.review || {};

  // Validate review presence
  if (!req.body.review) {
    throw new ExpressError(400, "Please provide review data.");
  }

  // Validate comment
  if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
    throw new ExpressError(400, "Please provide a valid comment.");
  }

  // Validate rating
  const ratingValue = Number(rating);
  if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    throw new ExpressError(400, "Please provide a rating between 1 and 5.");
  }

  // Find the listing
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found.");
  }

  // Create new review
  const newReview = new Review({ comment, rating: ratingValue, author: req.user._id });
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyReview=async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove review from listing's array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete review
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully.");
  res.redirect(`/listings/${id}`);
}