const User=require("../models/user.js");
module.exports.renderSignUpForm=(req,res)=>{
    res.render("user/signup.ejs");
};
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredStudent = await User.register(newUser, password);

    // LOGIN must finish before redirect
    req.login(registeredStudent, (err) => {
      if (err) return next(err); // handles login error

      req.flash("success", "Welcome to WanderLust!");
      return res.redirect("/listings"); // ✅ Only redirect if login succeeds
    });

  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup"); // ✅ Use return to stop further execution
  }
};
module.exports.renderLoginUpForm=(req,res)=>{
    res.render("user/login.ejs")
};
module.exports.login=async(req, res) => {
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){ 
            return next(err);}
    req.flash("success","you are logged out!");
    res.redirect("/listings");
});
}
