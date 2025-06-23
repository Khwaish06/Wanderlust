const Listing = require("./models/listing");
module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
    //req.isAuthenticated is method to check whether the user is logegd in or not 
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to create new listing");
    return  res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to modify this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId); // ✅ Fix typo: `ReviewId` → `reviewId`

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) { // ✅ Use req.user instead of res.locals
    req.flash("error", "You don't have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};