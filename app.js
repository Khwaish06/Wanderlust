if(process.env.NODE_ENV!="prodcution"){
require('dotenv').config()}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL


const ExpressError = require("./utils/ExpressError.js");
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,//after one week cookie will expire (milliseconds)
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});
app.get("/demouser",async(req,res,)=>{
  let fakeUser=new User({
    email:"student@gmail.com",
    username:"delta@student",
  })
  let registeredStudent=await User.register(fakeUser,"helloworld");
  res.send(registeredStudent);
})
// Disable browser caching
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Mount listing routes
app.use("/listings", listingsRoute);
app.use("/listings", reviewsRoute); // reviews must come *after* listings
app.use("/",userRoute);


// Root test route
//app.get("/", (req, res) => {
  //res.send("Hi I am root");
//});

// MongoDB connection

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log("Mongo connection error:", err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

// Catch-all for 404s
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("layout/error", { message });
});

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
