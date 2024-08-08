const express = require('express')
const router=express.Router();
const bcrypt = require('bcryptjs');
const Login=require('../model/login_model.js')
const Admin=require('../model/admin_model.js')
const Blog=require('../model/blog_model.js')
const Testimonial=require('../model/testmonial_model.js')
const Category=require('../model/category_model.js')
const Gift=require('../model/gift_model.js')
const Slider=require('../model/silder_model.js')
const Store=require('../model/store_model.js')
const multer = require('multer');
const passport=require('passport');
const flash = require('connect-flash');
const upload=require('../file_upload.js')
const auth=require('../auth.js')

router.get('/home',auth.isAuthenticated,auth.fetchSliderData, (req, res) => {
          res.render('home');
      });
      router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/auth/login');
          }
          req.logIn(user, (err) => {
            if (err) { return next(err); }
            req.flash('success_msg', 'You are now logged in');
            return res.redirect('/auth/home');
          });
        })(req, res, next);
      });
      
        router.get('/login',(req,res)=>{
          res.render('login', { messages: req.flash('error') });
        })
 router.get('/register',(req,res)=>{
res.render('register')
 });

 router.get('/view_users',auth.isAuthenticated, async (req, res) => {
  try {
    const users = await Login.find().exec();
    res.render('view_users', { users: users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/old_register', upload.single('image'), async(req, res) => {
  try {
    const get_data = req.body;
    const imagePath = req.file ? req.file.path : '';
    const set_data = new Login({
      ...get_data,
      imagePath: imagePath // Add image path to the user data
    });

    const response = await set_data.save();
    req.flash('success_msg', 'Your account create success');
    res.redirect('/auth/login');
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // This may vary depending on your session cookie name
    res.redirect('/auth/login');
  });
}); 



 
 
 ////////////////////////////////////////// here we start slider code///////////////////////////////////////
 router.get('/add_slider',auth.fetchSliderData,(req,res)=>{
  res.render('slider/add_slider');
 });
 router.post('/add_slider',upload.none(),async(req,res)=>{
  try{
    const get_data=req.body;
    const set_data=new Admin(get_data);
    const responce=await set_data.save();
    res.redirect('/auth/home');
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
 });
 /////////////////////////////////// Blog section route here/////////////////////////////////
router.get('/add_blog',auth.fetchSliderData,(req,res)=>{
res.render('admin/blog/add_blog')
})

router.post('/add_blog',upload.single('image'),async(req,res)=>{
  try{
 const get_data=req.body
 const image = req.file ? req.file.location : '';
 const date = new Date();
 const set_data=new Blog({
  image,
  ...get_data,
  date
 })
 const responce=await set_data.save()
 req.flash('success_msg', 'Blog data insert sucessfull');
 res.redirect('/auth/view_blog')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
router.get('/view_blog',auth.fetchSliderData,async(req,res)=>{
  try{
    const response=await Blog.find().exec()
    res.render('admin/blog/view_blog',{response:response})

  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
router.post('/delete_blog/:id',async(req,res)=>{
const id=req.params.id
try{
const responce=await Blog.findByIdAndDelete(id)
req.flash('success_msg', 'Blog delete sucessfull');
res.redirect('/auth/view_blog')
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.get('/update_blog/:id',auth.fetchSliderData,async(req,res)=>{
  const id =req.params.id
try{
const get_data=await Blog.findById(id)
res.render('admin/blog/update_blog',{get_data:get_data})
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.post('/update_blog/:id',upload.single('image'),async(req,res)=>{
  const id=req.params.id
try{
 
const get_data=req.body
const update_data={...get_data}
if (req.file) {
  const image = req.file.location;
  update_data.image = image; // Add the new image path to the update data
} else {
  // If no new image, use the existing image path from get_data
  update_data.image = get_data.image;
}
const response = await Blog.findByIdAndUpdate(id,update_data, { new: true })
req.flash('success_msg', 'Blog update sucessfull');
res.redirect('/auth/view_blog')
}

catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
}) 
///////////// testmonial start here /////////////////////////////////////////////////////////////////
router.get('/add_testmonial',auth.fetchSliderData,(req,res)=>{
res.render('admin/testmonial/add_testmonial')
});

router.post('/add_testmonial',upload.single('image'),async(req,res)=>{
  try{
  const get_data=req.body
  const image=req.file.location
  const set_data=new Testimonial({image,...get_data})
  const responce=await set_data.save()
  req.flash('success_msg', 'new testmonial insert sucessfull');
  res.redirect('/auth/view_testmonial')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
router.get('/view_testmonial',auth.fetchSliderData,async(req,res)=>{
try{
 const responce=await Testimonial.find()
 res.render('admin/testmonial/view_testmonial',{responce:responce})
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.post('/delete_testmonial/:id',async(req,res)=>{
const id =req.params.id
try{
const responce=await Testimonial.findByIdAndDelete(id)
req.flash('success_msg', ' testmonial delete sucessfull');
res.redirect('/auth/view_testmonial')
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
}
)
router.get('/update_testmonial/:id',auth.fetchSliderData,async(req,res)=>{
  const id =req.params.id
try{
const responce=await Testimonial.findOne({ _id: id })
res.render('admin/testmonial/update_testmonial',{responce:responce})
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.post('/update_testmonial/:id',upload.single('image'),async(req,res)=>{
  const id=req.params.id
  try{
 const get_data=req.body
 const check_image = req.file ? req.file.location : null;
 const image = check_image ? check_image : get_data.image;
 const update_data={image,...get_data}
 const response = await Testimonial.findByIdAndUpdate(id, update_data, { new: true });
 req.flash('success_msg', ' testmonial update sucessfull');
 res.redirect('/auth/view_testmonial')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  }
)
////////////////////////// best category product crud here////////////////////
router.get('/add_category',auth.fetchSliderData,(req,res)=>{
res.render('admin/category/add_category')
})
router.post('/add_category',upload.single('image'),async(req,res)=>{
try{
const image=req.file.location
const get_data=req.body
const set_data= new Category({image,...get_data})
const responce=set_data.save()
req.flash('success_msg', 'category added sucessfull');
res.redirect('/auth/view_category')
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.get('/view_category',auth.fetchSliderData,async(req,res)=>{
try{
const responce=await Category.find()
res.render('admin/category/view_category',{responce:responce})
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.post('/delete_category/:id',async(req,res)=>{
const id =req.params.id
try{
const responce=await Category.findByIdAndDelete(id)
req.flash('success_msg', 'category delete sucessfull');
res.redirect('/auth/view_category')
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.get('/update_category/:id',auth.fetchSliderData,async(req,res)=>{
  const id=req.params.id
try{
 const responce=await Category.findById(id)
 res.render('admin/category/update_category',{responce:responce})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
router.post('/update_category/:id',upload.single('image'),async(req,res)=>{
  const id=req.params.id
  try{
 const get_data=req.body
 const check_image = req.file ? req.file.location : null;
 const image = check_image ? check_image : get_data.image;
 const update_data={image,...get_data}
 const response = await Category.findByIdAndUpdate(id, update_data, { new: true });
 req.flash('success_msg', ' category update sucessfull');
 res.redirect('/auth/view_category')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  }
)
/////////////////// gift item ///////////////////////
router.get('/add_gift',auth.fetchSliderData,(req,res)=>{
res.render('admin/gift_item/add_gift')
})
router.post('/add_gift',upload.single('image'),async(req,res)=>{
  
  try{
 const get_data=req.body
 const image=req.file.location
 const set_data=new Gift({image,...get_data})
 const responce=await set_data.save()
 req.flash('success_msg', ' gift added sucessfull');
 res.redirect('/auth/view_gift')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/view_gift',auth.fetchSliderData,async(req,res)=>{
  const responce=await Gift.find()
  res.render('admin/gift_item/view_gift',{responce:responce})
})
router.post('/delete_gift/:id',async(req,res)=>{
  const id =req.params.id
try{
const responce=await Gift.findByIdAndDelete(id)
req.flash('success_msg', ' gift item delete sucessfull');
res.redirect('/auth/view_gift')
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.get('/update_gift/:id',auth.fetchSliderData,upload.single('image'),async(req,res)=>{
const id =req.params.id
try{
const responce=await Gift.findOne({_id:id})
res.render('admin/gift_item/update_gift',{responce:responce})
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})
router.post('/update_gift/:id',upload.single('image'),async(req,res)=>{
  const id=req.params.id
  try{
 const get_data=req.body
 const check_image = req.file ? req.file.location : null;
 const image = check_image ? check_image : get_data.image;
 const update_data={image,...get_data}
 const response = await Gift.findByIdAndUpdate(id, update_data, { new: true });
 req.flash('success_msg', ' gift update sucessfull');
 res.redirect('/auth/view_gift')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  }
)
 module.exports=router;
 //////////////////// silder dyanmic here////////////////////
 router.get('/add_banner',auth.fetchSliderData,(req,res)=>{
  res.render('admin/slider/add_slider')
  })
  router.post('/add_banner',upload.single('image'),async(req,res)=>{
    
    try{
   const get_data=req.body
   const image=req.file.location
   const set_data=new Slider({image,...get_data})
   const responce=await set_data.save()
   req.flash('success_msg', ' banner added sucessfull');
   res.redirect('/auth/view_banner')
    }
    catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/view_banner',auth.fetchSliderData,async(req,res)=>{
    const responce=await Slider.find()
    res.render('admin/slider/view_slider',{responce:responce})
  })
  router.post('/delete_banner/:id',async(req,res)=>{
    const id =req.params.id
  try{
  const responce=await Slider.findByIdAndDelete(id)
  req.flash('success_msg', ' banner item delete sucessfull');
  res.redirect('/auth/view_banner')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  })
  router.get('/update_banner/:id',auth.fetchSliderData,upload.single('image'),async(req,res)=>{
  const id =req.params.id
  try{
  const responce=await Slider.findOne({_id:id})
  res.render('admin/slider/update_slider',{responce:responce})
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  })
  router.post('/update_banner/:id',upload.single('image'),async(req,res)=>{
    const id=req.params.id
    try{
   const get_data=req.body
   const check_image = req.file ? req.file.location : null;
   const image = check_image ? check_image : get_data.image;
   const update_data={image,...get_data}
   const response = await Slider.findByIdAndUpdate(id, update_data, { new: true });
   req.flash('success_msg', ' banner update sucessfull');
   res.redirect('/auth/view_banner')
    }
    catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
    }
  )
  /////////////////////////////////Store dyanmic here///////////////////////
  router.get('/add_store',auth.fetchSliderData,(req,res)=>{
    res.render('admin/store/add_store')
    });
    
    router.post('/add_store',upload.single('image'),async(req,res)=>{
      try{
      const get_data=req.body
      const image=req.file.location
      const set_data=new Store({image,...get_data})
      const responce=await set_data.save()
      req.flash('success_msg', 'new store insert sucessfull');
      res.redirect('/auth/view_store')
      }
      catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    })
    router.get('/view_store',auth.fetchSliderData,async(req,res)=>{
    try{
     const responce=await Store.find()
     res.render('admin/store/view_store',{responce:responce})
    }
    catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
    })
    router.post('/delete_store/:id',async(req,res)=>{
    const id =req.params.id
    try{
    const responce=await Store.findByIdAndDelete(id)
    req.flash('success_msg', ' store delete sucessfull');
    res.redirect('/auth/view_store')
    }
    catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
    }
    )
    router.get('/update_store/:id',auth.fetchSliderData,async(req,res)=>{
      const id =req.params.id
    try{
    const responce=await Store.findOne({ _id: id })
    res.render('admin/store/update_store',{responce:responce})
    }
    catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
    })
    router.post('/update_store/:id',upload.single('image'),async(req,res)=>{
      const id=req.params.id
      try{
     const get_data=req.body
    
     const check_image = req.file ? req.file.location : null;
     const image = check_image ? check_image : get_data.image;
     const update_data={image,...get_data}
     
     const response = await Store.findByIdAndUpdate(id, update_data, { new: true });
     req.flash('success_msg', ' store update sucessfull');
     res.redirect('/auth/view_store')
      }
      catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
      }
    )
   module.exports=router;
