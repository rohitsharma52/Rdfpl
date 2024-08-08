const express = require('express')
const app = express()
const auth=require('./route/admin_route.js');
const front=require('./route/front_route.js');
const db=require('./db.js');
const path = require('path');
const bodyParser=require('body-parser')
const passport=require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const slider=require('./auth.js')

require('dotenv').config();

app.use(session({
          secret: 'your_secret_key',
          resave: false,
          saveUninitialized: false
        }));
                           
app.use(passport.initialize());
app.use(passport.session());        
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(flash());
app.use((req, res, next) => {
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error'); // Passport sets 'error' flash message
  next();
}); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth',auth);
app.use('/front',front)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
      }
  }
}));
app.use(slider.fetchSliderData);



const port = process.env.PORT || 3000;
app.listen(port,()=>{
          console.log('server is runing on port 3000');
        })

