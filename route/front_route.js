const express = require('express')
const router=express.Router();
const Blog=require('../model/blog_model')
const Category=require('../model/category_model')
const Gift=require('../model/gift_model')
const Testmonial=require('../model/testmonial_model')
const Banner=require('../model/silder_model')
const Store=require('../model/store_model')
 const moment = require('moment');

router.get('/home',async(req,res)=>{
  try{
    const blog_data=await Blog.find({show_home:1})
    const cate_data=await Category.find({show_home:1})
    const gift_data=await Gift.find({show_home:1})
    const test_data=await Testmonial.find()
    const Banner_data=await Banner.find()
    const Store_data=await Store.find()
    const formattedBlogData = blog_data.map(b_data => ({
      ...b_data.toObject(),
      formattedDate: moment(b_data.date).format('YYYY-MM-DD HH:mm:ss')
    }));
    res.render('front/home',{blog_data:formattedBlogData,
      cate_data:cate_data,
      gift_data:gift_data,
      test_data:test_data,
      Banner_data:Banner_data,
      Store_data:Store_data,
    })
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
   
})
router.get('/blog',async(req,res)=>{
try{
const Blog_data=await Blog.find()
res.render('front/blog',{Blog_data:Blog_data})
}
catch (err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
})

module.exports=router;