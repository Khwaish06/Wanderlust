const express = require("express");
const User=require("../models/user.js");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");
router.get("/signup",userController.renderSignUpForm);
router.post("/signup", userController.signup);
router.get("/login",userController.renderLoginUpForm);
router.post(
  "/loginup",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",    //if there is failure in login then user must redirect to '/login' route(page).
    failureFlash: true,      // Flash error on failure
    successFlash: "Welcome!", // Flash success on login
    //here local is name of strategy which is used for passport like we have option (google,facebook,apple)
    //if login fails then it will no go ahead
  }),
  userController.login
);
router.get("/logout",userController.logout);
module.exports=router;