const bcrypt = require('bcryptjs');
const Login=require('./model/login_model.js')
const Admin=require('./model/admin_model.js')
const passport=require('passport');
const flash = require('connect-flash');

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Use await to handle the asynchronous query
    const user = await Login.findOne({ username: username }).exec();
    
    if (!user) {
      return done(null, false, { message: 'Username not found' });
    }
    
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }
    
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
}));
passport.serializeUser((user, done) => {
  
    done(null, user.id);
  
 
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Login.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
function isAuthenticated(req, res, next) {
          if (req.isAuthenticated()) {
            return next();
          }
          res.redirect('/auth/login');
        }
        const fetchSliderData = async (req, res, next) => {
          try {
            if (req.user) { // Assuming JWT-based authentication
              const user = await Login.findById(req.user.id);
              res.locals.currentUser = user;
            }
            else{
              return res.redirect('/auth/login');            }
            const sliders = await Admin.find({});
            res.locals.sliders = sliders;
            next();
          } catch (error) {
            next(error);
          }
        };
        
module.exports={
          isAuthenticated,LocalStrategy,fetchSliderData
}        