const mongoose = require('mongoose');
const blogSchema=new mongoose.Schema({
    heading:{
          type: String,
          required: true,
          },
          by_blog:{
          type: String,
          required: true,
          },
          Descripation:{
          type: String,
          required: true,
          },
          image:{
          type: String,
          required: true,
          },
          date:{
            type: String,
            required: true,
            },
            show_home:{
            type: String,
            default:null,
            }, 
         
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports=Blog;   