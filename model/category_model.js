const mongoose = require('mongoose');
const categorySchema=new mongoose.Schema({
    name:{
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
         
        show_home:{
        type: String,
        default:null,
        }, 
         
});

const Category = mongoose.model('Category', categorySchema);
module.exports=Category;   